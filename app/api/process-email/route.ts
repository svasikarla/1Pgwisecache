import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { supabase } from '@/lib/supabase'
import type { gmail_v1 } from 'googleapis'
import OpenAI from 'openai'
import { analyzeUrl, type AnalysisResult } from '../../../lib/url-analyzer'
import { addToKnowledgeBase } from '@/lib/supabase/actions'

interface ProcessedUrl {
  url: string
  status: 'success' | 'already_processed' | 'error'
  data?: {
    category: string
    headline: string
    summary: string
    original_url: string
  }
  error?: string
  details?: string
  source: 'subject' | 'body'
  line: string
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Initialize OAuth2 client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Set credentials
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
})

// Initialize Gmail API
const gmail = google.gmail({ version: 'v1', auth: oauth2Client })

// Helper function to decode base64
function decodeBase64(base64String: string): string {
  try {
    return Buffer.from(base64String, 'base64').toString('utf-8')
  } catch (error) {
    console.error('Error decoding base64:', error)
    return ''
  }
}

// Helper function to get first 5 lines of email body
function getFirstFiveLinesOfBody(payload: gmail_v1.Schema$MessagePart): string[] {
  try {
    let lines: string[] = []
    
    // If the body is directly in the payload
    if (payload.body?.data) {
      const decodedBody = decodeBase64(payload.body.data)
      lines = decodedBody.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 5)
    }

    // If the body is in parts
    if (payload.parts && lines.length === 0) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain') {
          const decodedBody = decodeBase64(part.body?.data || '')
          lines = decodedBody.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .slice(0, 5)
          break
        }
      }
    }

    return lines
  } catch (error) {
    console.error('Error getting first 5 lines of body:', error)
    return []
  }
}

// Helper function to process email content
async function process_email(email: gmail_v1.Schema$Message, user_id: string): Promise<ProcessedUrl | null> {
  try {
    const subject = email.payload?.headers?.find(
      (header: gmail_v1.Schema$MessagePartHeader) => header.name === 'Subject'
    )?.value || ''

    console.log('Email subject:', subject)

    // First try to find URL in subject
    let urlMatch = subject.match(/https?:\/\/[^\s<>"]+/)
    let urlSource: 'subject' | 'body' = 'subject'
    let urlLine = ''

    // If no URL in subject, try first 5 lines of body
    if (!urlMatch && email.payload) {
      const firstFiveLines = getFirstFiveLinesOfBody(email.payload)
      console.log('First 5 lines of body:', firstFiveLines)
      
      // Search through each line for a URL
      for (const line of firstFiveLines) {
        const lineUrlMatch = line.match(/https?:\/\/[^\s<>"]+/)
        if (lineUrlMatch) {
          urlMatch = lineUrlMatch
          urlSource = 'body'
          urlLine = line
          break // Stop at first URL found
        }
      }
    }
    
    if (urlMatch) {
      const url = urlMatch[0]
      console.log(`Found URL in ${urlSource}:`, url)
      if (urlSource === 'body') {
        console.log('URL found in line:', urlLine)
      }

      try {
        // Use the shared analyzeUrl function
        const result: AnalysisResult = await analyzeUrl(url)
        console.log('Analysis result:', result)
        
        if (result.status === 'success') {
          // Save to knowledge base
          const saveResult = await addToKnowledgeBase({
            category: result.category || '',
            headline: result.headline || '',
            summary: result.summary || '',
            original_url: url
          })

          if (!saveResult.success) {
            console.error('Failed to save to knowledge base:', saveResult.error)
            return {
              url,
              status: 'error',
              error: 'Failed to save to knowledge base',
              details: saveResult.error,
              source: urlSource,
              line: urlLine
            }
          }
        }
        
        return {
          url,
          status: result.status,
          data: result.status === 'success' ? {
            category: result.category || '',
            headline: result.headline || '',
            summary: result.summary || '',
            original_url: result.original_url || url
          } : undefined,
          error: result.status === 'error' ? result.error : undefined,
          details: result.status === 'error' ? result.details : undefined,
          source: urlSource,
          line: urlLine
        }
      } catch (error: any) {
        console.error('Error processing URL:', error)
        return {
          url,
          status: 'error',
          error: 'Failed to process URL',
          details: error.message,
          source: urlSource,
          line: urlLine
        }
      }
    } else {
      console.log('No URL found in subject or first 5 lines of body')
      return null
    }
  } catch (error: any) {
    console.error('Error processing email:', error)
    return null
  }
}

export async function POST(request: Request) {
  try {
    // Get the user_id from the request
    let user_id: string | undefined;
    try {
      const body = await request.json();
      user_id = body.user_id;
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json({
        success: false,
        error: 'Invalid request body'
      }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'user_id is required'
      }, { status: 400 });
    }

    // Get emails from the last 7 days to ensure we don't miss any
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    // Build query to filter for specific sender and receiver
    const query = `in:inbox after:${Math.floor(sevenDaysAgo.getTime() / 1000)} from:${user_id} to:wiisecache@gmail.com`
    
    console.log('Fetching emails with query:', query)
    
    // First, get the user's email address and verify authentication
    try {
      const profile = await gmail.users.getProfile({
        userId: 'me'
      })
      
      console.log('User email:', profile.data.emailAddress)
      
      // Only proceed if the email matches wiisecache@gmail.com
      if (profile.data.emailAddress !== 'wiisecache@gmail.com') {
        console.log('Email mismatch. Expected wiisecache@gmail.com, got:', profile.data.emailAddress)
        return NextResponse.json({
          success: false,
          error: 'Please authenticate with wiisecache@gmail.com account'
        }, { status: 403 })
      }
    } catch (authError: any) {
      console.error('Gmail API Authentication Error:', authError.message)
      return NextResponse.json({
        success: false,
        error: 'Failed to authenticate with Gmail API',
        details: authError.message
      }, { status: 401 })
    }

    // Try to list messages with error handling
    let response;
    try {
      response = await gmail.users.messages.list({
        userId: 'me',
        q: query,
        maxResults: 100,
        includeSpamTrash: false // Exclude spam and trash
      })
    } catch (listError: any) {
      console.error('Gmail API List Error:', listError.message)
      return NextResponse.json({
        success: false,
        error: 'Failed to list messages from Gmail',
        details: listError.message
      }, { status: 500 })
    }

    console.log('Gmail API response:', JSON.stringify(response.data, null, 2))
    console.log('Total messages found:', response.data.resultSizeEstimate || 0)

    const messages = response.data.messages || []
    console.log('Messages array length:', messages.length)
    
    if (messages.length === 0) {
      console.log('No messages found. This could be because:')
      console.log('1. No emails in the specified time range')
      console.log('2. Query might be too restrictive')
      console.log('3. Authentication might not have proper scope')
    }
    
    const processedUrls: ProcessedUrl[] = []
    let emailsWithUrls = 0

    // Process each email
    for (const message of messages) {
      if (!message.id) continue

      console.log('\nProcessing message:', message.id)
      
      try {
        const email = await gmail.users.messages.get({
          userId: 'me',
          id: message.id,
        })

        // Process the email using the existing process_email routine
        const result = await process_email(email.data, user_id)
        
        if (result) {
          processedUrls.push({
            url: result.url,
            status: result.status,
            data: result.data,
            error: result.error,
            details: result.details,
            source: result.source,
            line: result.line
          })
          emailsWithUrls++
        }
      } catch (messageError: any) {
        console.error('Error processing message:', messageError.message)
        continue // Skip to next message if there's an error
      }
    }

    return NextResponse.json({
      success: true,
      totalEmails: messages.length,
      emailsWithUrls,
      processedUrls: processedUrls.length,
      urls: processedUrls,
      query: query, // Include the query used for debugging
    })
  } catch (error: any) {
    console.error('Error processing emails:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process emails',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 
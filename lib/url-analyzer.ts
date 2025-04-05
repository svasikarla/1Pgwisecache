import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AnalysisResult {
  status: 'success' | 'already_processed' | 'error'
  category?: string
  headline?: string
  summary?: string
  original_url?: string
  error?: string
  details?: string
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    // Check if URL already exists in the database
    const { data: existingData, error: checkError } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('original_url', url)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking for existing URL:', checkError)
      return {
        status: 'error',
        error: 'Failed to check for existing URL',
        details: checkError.message
      }
    }

    if (existingData) {
      console.log('URL already processed:', url)
      return {
        status: 'already_processed',
        ...existingData
      }
    }

    // Analyze the URL using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that analyzes URLs and extracts key information. For each URL, provide a category, headline, and summary. The category should be one of: Technology, Business, Science, Health, Entertainment, Sports, Politics, Education, Environment, or Other. The headline should be concise and engaging. The summary should be 3 separate sentences with a line separator."
        },
        {
          role: "user",
          content: ` ${url}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || ''
    
    console.log('OpenAI response:', response)

    // Extract category, headline, and summary from the response
    const categoryMatch = response.match(/Category:\s*(.+)/i)
    const headlineMatch = response.match(/Headline:\s*(.+)/i)
    const summaryMatch = response.match(/Summary:\s*([\s\S]+?)(?=\n\n|$)/)

    const category = categoryMatch ? categoryMatch[1].trim() : 'Other'
    const headline = headlineMatch ? headlineMatch[1].trim() : 'No headline available'
    const summary = summaryMatch ? summaryMatch[1].trim() : 'No summary available'

    // Store the analyzed data in Supabase
    const { error: insertError } = await supabase
      .from('knowledge_base')
      .insert([{
        category,
        headline,
        summary,
        original_url: url
      }])

    if (insertError) {
      console.error('Error storing data in Supabase:', insertError)
      return {
        status: 'error',
        error: 'Failed to store data in database',
        details: insertError.message
      }
    }

    return {
      status: 'success',
      category,
      headline,
      summary,
      original_url: url
    }
  } catch (error: any) {
    console.error('Error analyzing URL:', error)
    return {
      status: 'error',
      error: 'Failed to analyze URL',
      details: error.message
    }
  }
} 
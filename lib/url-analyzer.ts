import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface AnalysisResult {
  status: 'success' | 'error'
  category?: string
  headline?: string
  summary?: string
  original_url?: string
  error?: string
  details?: string
}

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
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
import { NextResponse } from 'next/server'
import { analyzeUrl } from '../../../lib/url-analyzer'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const result = await analyzeUrl(url)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Error analyzing URL:', error)
    return NextResponse.json(
      { error: 'Failed to analyze URL', details: error.message },
      { status: 500 }
    )
  }
} 
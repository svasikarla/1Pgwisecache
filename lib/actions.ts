import { supabase } from './supabase'
import { KnowledgeBase } from './supabase'

export async function addToKnowledgeBase(data: Omit<KnowledgeBase, 'id' | 'created_at'>) {
  try {
    // Ensure summary is a string
    const processedData = {
      ...data,
      summary: typeof data.summary === 'string' ? data.summary : 
               (Array.isArray(data.summary) ? data.summary.join('\n') : '')
    }

    const { data: result, error } = await supabase
      .from('knowledge_base')
      .insert([processedData])
      .select()
      .single()

    if (error) throw error
    return { success: true, data: result }
  } catch (error) {
    console.error('Error adding to knowledge base:', error)
    return { success: false, error }
  }
}

export async function getKnowledgeBase() {
  try {
    console.log('Fetching knowledge base data...')
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    // Ensure summary is always a string
    const processedData = data?.map(item => ({
      ...item,
      summary: typeof item.summary === 'string' ? item.summary : 
               (Array.isArray(item.summary) ? item.summary.join('\n') : '')
    }))

    console.log('Successfully fetched knowledge base data:', processedData?.length, 'items')
    return { success: true, data: processedData }
  } catch (error) {
    console.error('Error fetching knowledge base:', error)
    return { success: false, error }
  }
} 
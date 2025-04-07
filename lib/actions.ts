import { createClient } from './supabase/server'
import type { KnowledgeBase } from './supabase'

export async function addToKnowledgeBase(item: {
  category: string
  headline: string
  summary: string
  original_url: string
}) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .insert([item])
    .select()
    .single()

  if (error) {
    console.error('Error adding to knowledge base:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function getKnowledgeBase() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching knowledge base:', error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}

export async function deleteFromKnowledgeBase(id: number) {
  const supabase = createClient()
  const { error } = await supabase
    .from('knowledge_base')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting from knowledge base:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
} 
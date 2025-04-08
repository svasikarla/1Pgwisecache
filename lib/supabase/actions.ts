'use server'

import { createClient } from './server'
import type { KnowledgeBase } from './supabase'
import { getCurrentUser } from '../auth-utils'

export async function addToKnowledgeBase(item: {
  category: string
  headline: string
  summary: string
  original_url: string
}) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'User must be authenticated to add to knowledge base' }
    }

    const supabase = await createClient()
    
    // First, ensure the user exists in the public.users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email
      })

    if (userError) {
      console.error('Error upserting user:', userError)
      return { success: false, error: 'Failed to verify user account' }
    }

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert([{ ...item, user_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('Error inserting knowledge base entry:', error)
      return { success: false, error: error.message }
    }

    if (!data) {
      return { success: false, error: 'Failed to create knowledge base entry' }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in addToKnowledgeBase:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function getKnowledgeBase() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'User must be authenticated to view knowledge base' }
    }

    const supabase = await createClient()
    
    // First, ensure the user exists in the public.users table
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email
      })

    if (userError) {
      console.error('Error upserting user:', userError)
      return { success: false, error: 'Failed to verify user account' }
    }

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching knowledge base:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error in getKnowledgeBase:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
}

export async function deleteFromKnowledgeBase(id: number) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return { success: false, error: 'User must be authenticated to delete from knowledge base' }
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting knowledge base entry:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteFromKnowledgeBase:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    }
  }
} 
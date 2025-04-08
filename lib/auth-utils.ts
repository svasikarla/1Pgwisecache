import { createClient as createServerClient } from './supabase/server'
import { createClient as createBrowserClient } from './supabase/client'
import { KnowledgeBase } from './supabase'
import { cookies } from 'next/headers'

// Helper function to determine if we're in a server component
function isServerComponent() {
  try {
    cookies()
    return true
  } catch {
    return false
  }
}

// Get the appropriate client based on the context
async function getSupabaseClient() {
  if (isServerComponent()) {
    try {
      return await createServerClient()
    } catch (error) {
      console.error('Error creating server client:', error)
      throw error
    }
  }
  return createBrowserClient()
}

export async function signUp(email: string, password: string) {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          email_confirm: false
        }
      }
    })

    if (error) {
      console.error('Sign up error:', error)
      throw error
    }

    // Create user record in public.users table
    if (data.user) {
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          email_confirm: false
        }])

      if (userError) {
        console.error('Error creating user record:', userError)
        throw userError
      }
    }

    return {
      success: true,
      message: 'Please check your email for the verification link.',
      data
    }
  } catch (error) {
    console.error('Error in signUp:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const supabase = await getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error

    // Ensure session is properly set
    if (!data.session) {
      throw new Error('No session returned after sign in')
    }

    return data
  } catch (error) {
    console.error('Error in signIn:', error)
    throw error
  }
}

export async function signOut() {
  try {
    const supabase = await getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  } catch (error) {
    console.error('Error in signOut:', error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await getSupabaseClient()
    
    // First check if we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return null
    }

    if (!session) {
      // Try to refresh the session
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession()
      if (refreshError) {
        console.error('Refresh session error:', refreshError)
        return null
      }

      if (!refreshedSession) {
        console.error('No session after refresh')
        return null
      }
    }

    // Get the user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Get user error:', userError)
      return null
    }

    if (!user) {
      console.error('No user found')
      return null
    }

    // Ensure user exists in public.users table
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (dbError) {
      if ((dbError as any).code === 'PGRST116') { // No rows returned
        // Create user record if it doesn't exist
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email
          }])

        if (insertError) {
          console.error('Error creating user record:', insertError)
          return null
        }
        return user
      }
      console.error('Error fetching user data:', dbError)
      return null
    }

    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

export async function createKnowledgeBaseEntry(entry: Omit<KnowledgeBase, 'id' | 'created_at' | 'user_id'>) {
  try {
    const supabase = await getSupabaseClient()
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated to create knowledge base entries')

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert([{ ...entry, user_id: user.id }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error in createKnowledgeBaseEntry:', error)
    throw error
  }
}

export async function getUserKnowledgeBase() {
  try {
    const supabase = await getSupabaseClient()
    const user = await getCurrentUser()
    if (!user) throw new Error('User must be authenticated to view knowledge base entries')

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error in getUserKnowledgeBase:', error)
    throw error
  }
} 
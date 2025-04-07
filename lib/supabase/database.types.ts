export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      knowledge_base: {
        Row: {
          id: number
          created_at: string
          category: string
          headline: string
          summary: string
          original_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          category: string
          headline: string
          summary: string
          original_url: string
        }
        Update: {
          id?: number
          created_at?: string
          category?: string
          headline?: string
          summary?: string
          original_url?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 
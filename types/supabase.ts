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
      links: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          url: string
          summary: string
          category: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          url: string
          summary: string
          category: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          url?: string
          summary?: string
          category?: string
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
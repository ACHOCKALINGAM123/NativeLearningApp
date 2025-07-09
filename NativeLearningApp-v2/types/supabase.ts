export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'student' | 'teacher' | 'admin'
          stripe_id: string | null
          languages: string[]
          profile_picture: string | null
          bio: string | null
          timezone: string
          is_featured: boolean
          email_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role?: 'student' | 'teacher' | 'admin'
          stripe_id?: string | null
          languages: string[]
          profile_picture?: string | null
          bio?: string | null
          timezone: string
          is_featured?: boolean
          email_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'student' | 'teacher' | 'admin'
          stripe_id?: string | null
          languages?: string[]
          profile_picture?: string | null
          bio?: string | null
          timezone?: string
          is_featured?: boolean
          email_notifications?: boolean
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          teacher_id: string
          type: 'hourly' | 'self_paced' | 'career_path'
          base_price: number
          language: string
          tags: string[]
          downloadable_resources: string[]
          is_featured: boolean
          is_published: boolean
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          estimated_duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          teacher_id: string
          type: 'hourly' | 'self_paced' | 'career_path'
          base_price: number
          language: string
          tags?: string[]
          downloadable_resources?: string[]
          is_featured?: boolean
          is_published?: boolean
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          estimated_duration?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          teacher_id?: string
          type?: 'hourly' | 'self_paced' | 'career_path'
          base_price?: number
          language?: string
          tags?: string[]
          downloadable_resources?: string[]
          is_featured?: boolean
          is_published?: boolean
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          estimated_duration?: number
          updated_at?: string
        }
      }
      career_paths: {
        Row: {
          id: string
          title: string
          description: string
          skill_goal: string
          course_ids: string[]
          estimated_duration: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          skill_goal: string
          course_ids: string[]
          estimated_duration: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          skill_goal?: string
          course_ids?: string[]
          estimated_duration?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          is_featured?: boolean
          updated_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          course_id: string
          date_time: string
          duration: number
          status: 'scheduled' | 'completed' | 'cancelled'
          student_id: string | null
          meeting_link: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          date_time: string
          duration: number
          status?: 'scheduled' | 'completed' | 'cancelled'
          student_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          date_time?: string
          duration?: number
          status?: 'scheduled' | 'completed' | 'cancelled'
          student_id?: string | null
          meeting_link?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          amount: number
          base_amount: number
          fee_amount: number
          session_id: string | null
          course_id: string | null
          student_id: string
          teacher_id: string
          stripe_payment_id: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          amount: number
          base_amount: number
          fee_amount: number
          session_id?: string | null
          course_id?: string | null
          student_id: string
          teacher_id: string
          stripe_payment_id: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          amount?: number
          base_amount?: number
          fee_amount?: number
          session_id?: string | null
          course_id?: string | null
          student_id?: string
          teacher_id?: string
          stripe_payment_id?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          session_id: string
          student_id: string
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          student_id: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          student_id?: string
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          payment_id?: string | null
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          rating: number
          comments: string | null
          teacher_id: string
          student_id: string
          course_id: string | null
          session_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          rating: number
          comments?: string | null
          teacher_id: string
          student_id: string
          course_id?: string | null
          session_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          rating?: number
          comments?: string | null
          teacher_id?: string
          student_id?: string
          course_id?: string | null
          session_id?: string | null
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          file_url: string
          file_type: string
          file_size: number
          course_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          file_url: string
          file_type: string
          file_size: number
          course_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          file_url?: string
          file_type?: string
          file_size?: number
          course_id?: string
          updated_at?: string
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
        }
      }
      teacher_verification: {
        Row: {
          id: string
          teacher_id: string
          status: 'pending' | 'approved' | 'rejected'
          notes: string | null
          reviewed_by: string | null
          documents: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string | null
          reviewed_by?: string | null
          documents?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string | null
          reviewed_by?: string | null
          documents?: string[]
          updated_at?: string
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

// Type aliases for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type User = Tables<'users'>
export type Course = Tables<'courses'>
export type CareerPath = Tables<'career_paths'>
export type Session = Tables<'sessions'>
export type Payment = Tables<'payments'>
export type Booking = Tables<'bookings'>
export type Review = Tables<'reviews'>
export type Resource = Tables<'resources'>
export type AdminUser = Tables<'admin_users'>
export type TeacherVerification = Tables<'teacher_verification'>
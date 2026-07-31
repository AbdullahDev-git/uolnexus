import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function checkSupabaseConfig() {
  return isConfigured
}

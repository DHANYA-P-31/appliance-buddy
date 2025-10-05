import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Supabase client for additional features (auth, realtime, storage, etc.)
export const supabase = env.SUPABASE_URL && env.SUPABASE_ANON_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  : null;

// Service role client for admin operations (if needed)
export const supabaseAdmin = env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);
};

// Supabase configuration info
export const getSupabaseInfo = () => {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      message: 'Supabase not configured. Using direct PostgreSQL connection.'
    };
  }

  return {
    configured: true,
    url: env.SUPABASE_URL,
    features: {
      auth: !!supabase?.auth,
      realtime: !!supabase?.realtime,
      storage: !!supabase?.storage,
    }
  };
};
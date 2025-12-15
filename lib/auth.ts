import { supabaseAdmin } from './supabase';
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

// Get user from server-side
export async function getUser(accessToken: string): Promise<AuthUser | null> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name,
      avatar_url: user.user_metadata?.avatar_url,
      created_at: user.created_at,
    };
  } catch {
    return null;
  }
}

// Verify session
export async function verifySession(accessToken: string): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    return !error && !!user;
  } catch {
    return false;
  }
}


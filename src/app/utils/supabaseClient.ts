import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Try to use environment variables first, fallback to protected info file
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey;

// Validate that we have the required values
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client for frontend
export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// API base URL
export const API_BASE_URL = `${SUPABASE_URL}/functions/v1/make-server-297fba9e`;

// Get auth token from session
export async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

// API helper with auth
export async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}
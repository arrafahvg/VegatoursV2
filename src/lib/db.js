// Centralized database client - now points to Supabase
import { supabase } from './supabase';

// Re-export the Supabase client for backward compatibility
export const db = supabase;

import { createClient } from '@supabase/supabase-js';

// These are public keys that can be safely exposed in the client
const supabaseUrl = 'https://ksrqcghgitoisxuslait.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcnFjZ2hnaXRvaXN4dXNsYWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMDk4NjEsImV4cCI6MjAzNjY4NTg2MX0.wczKpEJA51qG1tPxWrW1lpE2_TEJtX6x7zGNcg_gDNk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

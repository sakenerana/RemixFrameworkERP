import { createClient } from "@supabase/supabase-js";

// PENDING, WILL MOVE THIS LATER TO .ENV
const supabaseUrl= "https://ksrqcghgitoisxuslait.supabase.co";
const supabaseKey= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcnFjZ2hnaXRvaXN4dXNsYWl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMDk4NjEsImV4cCI6MjAzNjY4NTg2MX0.wczKpEJA51qG1tPxWrW1lpE2_TEJtX6x7zGNcg_gDNk";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
import { createClient } from "@supabase/supabase-js";
// PENDING, WILL MOVE THIS LATER TO .ENV (BETA)
const supabaseUrl = "https://ksrqcghgitoisxuslait.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcnFjZ2hnaXRvaXN4dXNsYWl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTEwOTg2MSwiZXhwIjoyMDM2Njg1ODYxfQ.Ts1BCTOtDbELesMR_ZyxwM3NR-D302aPgUKuxzmJmB0";

// PENDING, WILL MOVE THIS LATER TO .ENV (PRODUCTION)
// const supabaseUrl = "https://erp-api.cficoop.com";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ3NzU2ODAwLCJleHAiOjE5MDU1MjMyMDB9.OjwzT9YkaAcdst2xgU4Z4hD9CSpNFJCPF2LNeU6Oyoc";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

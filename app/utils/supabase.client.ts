import { createClient } from "@supabase/supabase-js";
// PENDING, WILL MOVE THIS LATER TO .ENV (BETA)
const supabaseUrl = "https://ksrqcghgitoisxuslait.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzcnFjZ2hnaXRvaXN4dXNsYWl0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTEwOTg2MSwiZXhwIjoyMDM2Njg1ODYxfQ.Ts1BCTOtDbELesMR_ZyxwM3NR-D302aPgUKuxzmJmB0";

// PENDING, WILL MOVE THIS LATER TO .ENV (PRODUCTION)
// const supabaseUrl = "https://erp-api.cficoop.com";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ3NzU2ODAwLCJleHAiOjE5MDU1MjMyMDB9.OjwzT9YkaAcdst2xgU4Z4hD9CSpNFJCPF2LNeU6Oyoc";

// PENDING, WILL MOVE THIS LATER TO .ENV (PRODUCTION)
// const supabaseUrl = "http://192.168.47.3:7000";
// const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

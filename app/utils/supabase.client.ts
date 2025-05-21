import { createClient } from "@supabase/supabase-js";

// PENDING, WILL MOVE THIS LATER TO .ENV
const supabaseUrl = "https://erp-api.cficoop.com";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzQ3NzU2ODAwLCJleHAiOjE5MDU1MjMyMDB9.OjwzT9YkaAcdst2xgU4Z4hD9CSpNFJCPF2LNeU6Oyoc";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vfxjoseyqpmyxyrtumhd.supabase.co";
const supabaseKey = "sb_publishable_5F2FOLBRUboHapISrwZOMg_rObFB98C";

export const supabase = createClient(supabaseUrl, supabaseKey);
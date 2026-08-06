import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://kgntlbaejgzbgaegzzpj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnbnRsYmFlamd6YmdhZWd6enBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5NTcxNzUsImV4cCI6MjEwMTUzMzE3NX0.dXv46hby-LzHuwnhupTvotBEuQ7tNlHAmUWVS5VeBZ0"

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)

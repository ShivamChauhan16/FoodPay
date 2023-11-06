import {createClient} from "@supabase/supabase-js";

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0c2htYXd1aHNrdWtmY2tqbXFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3OTIyNDg4MCwiZXhwIjoxOTk0ODAwODgwfQ.xDUeZ04TJ7JS_LYa6rafF6WQ061rzWHeSDaXFMMBaIk'
const supabaseUrl = 'https://ttshmawuhskukfckjmqa.supabase.co'

export const supabase = createClient(supabaseUrl, supabaseKey)


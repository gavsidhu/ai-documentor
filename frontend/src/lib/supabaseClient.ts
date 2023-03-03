import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLIC_ANON_KEY} from '$env/static/public'

// Create a single supabase client for interacting with your database
const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_PUBLIC_ANON_KEY)

export default supabase

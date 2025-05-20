// js/supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://igekrfiecemrexuahpho.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnZWtyZmllY2VtcmV4dWFocGhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNjg1NjgsImV4cCI6MjA2Mjc0NDU2OH0.1Xqg8RV6qsTL7EdnreGA7T8LwrVuWM4Xxj0VtVftV4I';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

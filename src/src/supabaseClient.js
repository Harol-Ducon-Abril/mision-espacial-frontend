// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqfapxqekbeqtbjxrvnb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZmFweHFla2JlcXRianhydm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDYxNDIsImV4cCI6MjA5MzA4MjE0Mn0.8re1ITATqddJFpjunSbrOueFvXrWlN6pzsPB_Ee_X3s'

export const supabase = createClient(supabaseUrl, supabaseKey)

    import React from "react";
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://dtuunslzscwpviyfstxi.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dXVuc2x6c2N3cHZpeWZzdHhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDcxNjAsImV4cCI6MjA2MjYyMzE2MH0.CHMr5e2rUg5ua3HfwsfLU8-heQm4WTPw9Ur1WjmGgws';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Guard against a blank screen: if the env vars are missing (e.g. .env.local is
// missing, the keys are misnamed, or the app was opened outside a running Vite
// dev server), the old code threw at module load, which broke every import chain
// and rendered a completely blank page with no visible error.
//
// Instead we log a clear message and build a client from safe fallbacks. The UI
// still mounts and sections fall back to their default content, so the problem
// is visible and diagnosable rather than a silent white screen.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Vegatours] Missing Supabase environment variables.\n' +
      'Create/check a ".env.local" file in the project root that contains:\n' +
      '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
      '  VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key\n' +
      'Then restart the dev server with `npm run dev`.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
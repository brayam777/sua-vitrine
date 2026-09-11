import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Standalone Supabase project for Sua Vitrine, on its own account —
// kept apart from the mecanicsafe app and the client vitrines.
const SUPABASE_URL = 'https://svovabwkremtnnesuknj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_rZ0ZbUXW3Ed5pY6Vtka2HQ_GXwrXFSy';

export const isConfigured = SUPABASE_URL !== 'PENDING_SETUP';

export const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { flowType: 'implicit' } })
  : null;

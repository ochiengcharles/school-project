/* Public browser configuration only. Never put a service_role key in frontend code. */
(function () {
  const SUPABASE_URL = "https://vinxmomgvapzyokauatb.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0w7BwNAL5FqN0uDLrfQlqA_Ph_Kmgxv";
  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase JS library did not load. Check the CDN connection.");
    return;
  }
  window.schoolSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
})();
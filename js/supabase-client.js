// Configuration Supabase, centralisée ici pour ne l'avoir qu'à UN SEUL endroit.
// Si un jour la clé change, c'est le seul fichier à modifier.
const SUPABASE_URL = 'https://fsrjhdxbdpdrdlcovdxg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7pg8_ejZTCj1D6dcnuLsSw_Kq4dpuxX';

// Le client Supabase, prêt à être utilisé par les autres fichiers JS.
// Comme ce fichier est chargé AVANT les autres scripts de chaque page,
// "supabaseClient" est disponible partout où on en a besoin.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

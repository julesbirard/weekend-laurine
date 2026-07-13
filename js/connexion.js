// Ce fichier utilise "supabaseClient", défini dans js/supabase-client.js,
// chargé juste avant celui-ci dans connexion.html.

async function seConnecter() {
  const messageEl = document.getElementById('message');
  const code = document.getElementById('code').value.trim();

  if (code === '') {
    messageEl.textContent = 'Merci de saisir un code.';
    messageEl.className = 'erreur';
    return;
  }

  messageEl.textContent = 'Vérification...';
  messageEl.className = '';

  // On appelle notre fonction "verifier_code" créée dans Supabase,
  // en lui passant le code saisi par l'invité
  const { data, error } = await supabaseClient.rpc('verifier_code', { code_saisi: code });

  if (error) {
    console.error(error);
    messageEl.textContent = "Une erreur est survenue, réessaie.";
    messageEl.className = 'erreur';
    return;
  }

  if (data.length === 0) {
    messageEl.textContent = 'Code invalide.';
    messageEl.className = 'erreur';
    return;
  }

  const invite = data[0];
  console.log('Invité trouvé :', invite);

  if (invite.profil_complete === false) {
    codeInviteActuel = code;
    document.getElementById('etape-code').style.display = 'none';
    document.getElementById('etape-profil').style.display = 'block';
  } else {
    sessionStorage.setItem('code', code);
    sessionStorage.setItem('prenom', invite.prenom);
    sessionStorage.setItem('surnom', invite.surnom);
    window.location.href = 'personal_homepage.html';
  }
}

// Variable qui garde en mémoire le code de l'invité entre l'étape 1 (connexion)
// et l'étape 2 (complétion du profil)
let codeInviteActuel = null;

async function validerProfil() {
  const messageEl = document.getElementById('message-profil');

  const nom = document.getElementById('nom').value.trim();
  const prenom = document.getElementById('prenom').value.trim();
  const surnom = document.getElementById('surnom').value.trim();
  const email = document.getElementById('email').value.trim();

  if (nom === '' || prenom === '' || email === '') {
    messageEl.textContent = 'Merci de remplir au moins Nom, Prénom et Email.';
    messageEl.className = 'erreur';
    return;
  }

  messageEl.textContent = 'Enregistrement...';
  messageEl.className = '';

  const { data, error } = await supabaseClient.rpc('completer_profil', {
    code_saisi: codeInviteActuel,
    nom_saisi: nom,
    prenom_saisi: prenom,
    surnom_saisi: surnom,
    email_saisi: email
  });

  if (error) {
    console.error(error);
    messageEl.textContent = "Une erreur est survenue, réessaie.";
    messageEl.className = 'erreur';
    return;
  }

  messageEl.textContent = 'Profil enregistré, merci !';
  messageEl.className = 'succes';

  sessionStorage.setItem('code', codeInviteActuel);
  sessionStorage.setItem('prenom', prenom);
  sessionStorage.setItem('surnom', surnom);
  setTimeout(() => { window.location.href = 'personal_homepage.html'; }, 800);
}

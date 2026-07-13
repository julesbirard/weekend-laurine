async function seConnecterAdmin() {
  const messageEl = document.getElementById('message');
  const code = document.getElementById('codeAdmin').value.trim();

  if (code === '') {
    messageEl.textContent = 'Merci de saisir un code.';
    messageEl.className = 'erreur';
    return;
  }

  messageEl.textContent = 'Vérification...';
  messageEl.className = '';

  const { data, error } = await supabaseClient.rpc('verifier_code_admin', { code_saisi: code });

  if (error) {
    console.error(error);
    messageEl.textContent = "Une erreur est survenue, réessaie.";
    messageEl.className = 'erreur';
    return;
  }

  if (data === true) {
    sessionStorage.setItem('codeAdmin', code);
    window.location.href = 'dashboard_admin.html';
  } else {
    messageEl.textContent = 'Code invalide.';
    messageEl.className = 'erreur';
  }
}

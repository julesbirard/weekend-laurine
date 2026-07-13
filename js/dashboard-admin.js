const codeAdmin = sessionStorage.getItem('codeAdmin');

// Affiche proprement une valeur vide ou un tableau (allergies, boissons)
function afficher(valeur) {
  if (valeur === null || valeur === undefined || valeur === '') return '—';
  if (Array.isArray(valeur)) return valeur.length > 0 ? valeur.join(', ') : '—';
  return valeur;
}

async function chargerDonnees() {
  if (!codeAdmin) {
    document.getElementById('erreur').textContent =
      'Tu dois te connecter via connexion-admin.html avant d\'accéder à cette page.';
    return;
  }

  const [resultInvites, resultReponses] = await Promise.all([
    supabaseClient.rpc('lire_invites', { code_admin: codeAdmin }),
    supabaseClient.rpc('lire_toutes_reponses', { code_admin: codeAdmin })
  ]);

  if (resultInvites.error || resultReponses.error) {
    console.error(resultInvites.error || resultReponses.error);
    document.getElementById('erreur').textContent = 'Une erreur est survenue lors du chargement.';
    return;
  }

  if (resultInvites.data.length === 0) {
    document.getElementById('erreur').textContent =
      'Aucune donnée trouvée. Vérifie que ton code admin est correct.';
  }

  const corpsInvites = document.querySelector('#table-invites tbody');
  resultInvites.data.forEach(invite => {
    const ligne = document.createElement('tr');
    ligne.innerHTML = `
      <td>${invite.code_acces}</td>
      <td>${invite.nom ?? ''}</td>
      <td>${invite.prenom ?? ''}</td>
      <td>${invite.surnom ?? ''}</td>
      <td>${invite.email ?? ''}</td>
      <td>${invite.profil_complete ? 'Oui' : 'Non'}</td>
    `;
    corpsInvites.appendChild(ligne);
  });

  const corpsReponses = document.querySelector('#table-reponses tbody');
  resultReponses.data.forEach(r => {
    const ligne = document.createElement('tr');
    ligne.innerHTML = `
      <td>${afficher(r.code_acces)}</td>
      <td>${afficher(r.date_arrivee)}</td>
      <td>${afficher(r.heure_arrivee)}</td>
      <td>${afficher(r.moyen_arrivee === 'Autre' ? r.autre_moyen_arrivee : r.moyen_arrivee)}</td>
      <td>${afficher(r.date_depart)}</td>
      <td>${afficher(r.heure_depart)}</td>
      <td>${afficher(r.moyen_depart === 'Autre' ? r.autre_moyen_depart : r.moyen_depart)}</td>
      <td>${afficher(r.regime_alimentaire)}</td>
      <td>${afficher(r.allergies)}${r.autre_allergie ? ' (' + r.autre_allergie + ')' : ''}</td>
      <td>${afficher(r.aliments_detestes)}</td>
      <td>${afficher(r.preference_chambre)}</td>
      <td>${afficher(r.avec_qui)}</td>
      <td>${afficher(r.eviter_qui)}</td>
      <td>${afficher(r.repas_vendredi_soir)}</td>
      <td>${afficher(r.repas_samedi_midi)}</td>
      <td>${afficher(r.repas_samedi_soir)}</td>
      <td>${afficher(r.repas_dimanche_matin)}</td>
      <td>${afficher(r.boissons)}</td>
      <td>${afficher(r.theme_vendredi)}</td>
      <td>${afficher(r.theme_samedi)}</td>
      <td>${afficher(r.activite_samedi_matin)}</td>
      <td>${afficher(r.activite_samedi_apres_midi)}</td>
      <td>${afficher(r.activite_dimanche_matin)}</td>
      <td>${afficher(r.activite_dimanche_apres_midi)}</td>
      <td>${afficher(r.suggestions_activites)}</td>
    `;
    corpsReponses.appendChild(ligne);
  });
}

chargerDonnees();

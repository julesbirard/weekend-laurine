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

  afficherStatistiques(resultInvites.data, resultReponses.data);
  genererGraphiques(resultReponses.data);
}

// ==================== RÉCAPITULATIF ====================

function afficherStatistiques(invites, reponses) {
  document.getElementById('stat-total').textContent = invites.length;
  document.getElementById('stat-profils').textContent =
    invites.filter(i => i.profil_complete).length;
  document.getElementById('stat-reponses').textContent = reponses.length;
}

// ==================== GRAPHIQUES ====================

// Palette réutilisée pour tous les graphiques, cohérente avec le reste du site
const COULEURS = ['#c9503f', '#2f6f62', '#e3a73c', '#2d3e63', '#8b5e3c', '#a9c4d4', '#8fa888'];

// Compte les occurrences d'une valeur simple (ex: regime_alimentaire) parmi les réponses,
// en ignorant les réponses vides
function compterValeurs(reponses, champ) {
  const compteur = {};
  reponses.forEach(r => {
    const valeur = r[champ];
    if (!valeur) return;
    compteur[valeur] = (compteur[valeur] || 0) + 1;
  });
  return compteur;
}

// Même principe, mais pour un champ qui contient une LISTE de valeurs
// (ex: allergies, boissons -> plusieurs choix possibles par invité)
function compterValeursMultiples(reponses, champ) {
  const compteur = {};
  reponses.forEach(r => {
    const valeurs = r[champ];
    if (!valeurs || valeurs.length === 0) return;
    valeurs.forEach(valeur => {
      compteur[valeur] = (compteur[valeur] || 0) + 1;
    });
  });
  return compteur;
}

// Dessine un graphique en barres simple à partir d'un objet {valeur: nombre}
function dessinerGraphiqueBarres(idCanvas, compteur) {
  const labels = Object.keys(compteur);
  const valeurs = Object.values(compteur);

  if (labels.length === 0) return; // rien à afficher

  new Chart(document.getElementById(idCanvas), {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        data: valeurs,
        backgroundColor: COULEURS[0],
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

// Dessine un graphique en barres groupées : plusieurs créneaux (ex: 4 repas),
// chacun avec ses options (Option A / B / C), pour comparer d'un coup d'œil
function dessinerGraphiqueGroupe(idCanvas, reponses, champsCreneaux, etiquettesCreneaux, options) {
  const datasets = options.map((option, index) => ({
    label: option,
    data: champsCreneaux.map(champ =>
      reponses.filter(r => r[champ] === option).length
    ),
    backgroundColor: COULEURS[index % COULEURS.length],
    borderRadius: 6
  }));

  new Chart(document.getElementById(idCanvas), {
    type: 'bar',
    data: { labels: etiquettesCreneaux, datasets: datasets },
    options: {
      responsive: true,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
    }
  });
}

function genererGraphiques(reponses) {
  dessinerGraphiqueBarres('graphique-regime', compterValeurs(reponses, 'regime_alimentaire'));
  dessinerGraphiqueBarres('graphique-allergies', compterValeursMultiples(reponses, 'allergies'));
  dessinerGraphiqueBarres('graphique-chambre', compterValeurs(reponses, 'preference_chambre'));
  dessinerGraphiqueBarres('graphique-boissons', compterValeursMultiples(reponses, 'boissons'));
  dessinerGraphiqueBarres('graphique-transport', compterValeurs(reponses, 'moyen_arrivee'));

  const options3 = ['Option A', 'Option B', 'Option C'];

  dessinerGraphiqueGroupe(
    'graphique-repas',
    reponses,
    ['repas_vendredi_soir', 'repas_samedi_midi', 'repas_samedi_soir', 'repas_dimanche_matin'],
    ['Ven. soir', 'Sam. midi', 'Sam. soir', 'Dim. matin'],
    options3
  );

  dessinerGraphiqueGroupe(
    'graphique-themes',
    reponses,
    ['theme_vendredi', 'theme_samedi'],
    ['Vendredi', 'Samedi'],
    options3
  );

  dessinerGraphiqueGroupe(
    'graphique-activites',
    reponses,
    ['activite_samedi_matin', 'activite_samedi_apres_midi', 'activite_dimanche_matin', 'activite_dimanche_apres_midi'],
    ['Sam. matin', 'Sam. aprem', 'Dim. matin', 'Dim. aprem'],
    options3
  );
}

chargerDonnees();

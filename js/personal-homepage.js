const code = sessionStorage.getItem('code');
const surnom = sessionStorage.getItem('surnom');

document.getElementById('salutation').textContent = surnom
  ? `Welcome, ${surnom} 👋`
  : 'Welcome ! (connecte-toi via connexion.html)';

document.getElementById('moyen_arrivee').addEventListener('change', function () {
  document.getElementById('bloc-autre-arrivee').style.display = (this.value === 'Autre') ? 'block' : 'none';
});
document.getElementById('moyen_depart').addEventListener('change', function () {
  document.getElementById('bloc-autre-depart').style.display = (this.value === 'Autre') ? 'block' : 'none';
});
document.getElementById('case-autre-allergie').addEventListener('change', function () {
  document.getElementById('bloc-autre-allergie').style.display = this.checked ? 'block' : 'none';
});

async function chargerReponsesExistantes() {
  if (!code) return;

  const { data, error } = await supabaseClient.rpc('lire_mes_reponses', { code_saisi: code });

  if (error) {
    console.error(error);
    return;
  }

  if (data.length === 0) return;

  const r = data[0];

  document.getElementById('date_arrivee').value = r.date_arrivee ?? '';
  document.getElementById('heure_arrivee').value = r.heure_arrivee ?? '';
  document.getElementById('moyen_arrivee').value = r.moyen_arrivee ?? '';
  document.getElementById('autre_moyen_arrivee').value = r.autre_moyen_arrivee ?? '';
  document.getElementById('date_depart').value = r.date_depart ?? '';
  document.getElementById('heure_depart').value = r.heure_depart ?? '';
  document.getElementById('moyen_depart').value = r.moyen_depart ?? '';
  document.getElementById('autre_moyen_depart').value = r.autre_moyen_depart ?? '';

  if (r.moyen_arrivee === 'Autre') document.getElementById('bloc-autre-arrivee').style.display = 'block';
  if (r.moyen_depart === 'Autre') document.getElementById('bloc-autre-depart').style.display = 'block';

  document.getElementById('regime_alimentaire').value = r.regime_alimentaire ?? '';
  document.getElementById('autre_allergie').value = r.autre_allergie ?? '';
  document.getElementById('aliments_detestes').value = r.aliments_detestes ?? '';

  if (r.allergies) {
    r.allergies.forEach(valeur => {
      const case_a_cocher = document.querySelector(`input[name="allergies"][value="${valeur}"]`);
      if (case_a_cocher) case_a_cocher.checked = true;
    });
    if (r.allergies.includes('Autre')) document.getElementById('bloc-autre-allergie').style.display = 'block';
  }

  document.getElementById('preference_chambre').value = r.preference_chambre ?? '';
  document.getElementById('avec_qui').value = r.avec_qui ?? '';
  document.getElementById('eviter_qui').value = r.eviter_qui ?? '';

  document.getElementById('repas_vendredi_soir').value = r.repas_vendredi_soir ?? '';
  document.getElementById('repas_samedi_midi').value = r.repas_samedi_midi ?? '';
  document.getElementById('repas_samedi_soir').value = r.repas_samedi_soir ?? '';
  document.getElementById('repas_dimanche_matin').value = r.repas_dimanche_matin ?? '';

  if (r.boissons) {
    r.boissons.forEach(valeur => {
      const case_a_cocher = document.querySelector(`input[name="boissons"][value="${valeur}"]`);
      if (case_a_cocher) case_a_cocher.checked = true;
    });
  }

  document.getElementById('theme_vendredi').value = r.theme_vendredi ?? '';
  document.getElementById('theme_samedi').value = r.theme_samedi ?? '';

  document.getElementById('activite_samedi_matin').value = r.activite_samedi_matin ?? '';
  document.getElementById('activite_samedi_apres_midi').value = r.activite_samedi_apres_midi ?? '';
  document.getElementById('activite_dimanche_matin').value = r.activite_dimanche_matin ?? '';
  document.getElementById('activite_dimanche_apres_midi').value = r.activite_dimanche_apres_midi ?? '';
  document.getElementById('suggestions_activites').value = r.suggestions_activites ?? '';
}

chargerReponsesExistantes();

async function enregistrerToutesLesReponses() {
  const messageEl = document.getElementById('message-global');

  if (!code) {
    messageEl.textContent = 'Erreur : reconnecte-toi via connexion.html.';
    return;
  }

  messageEl.textContent = 'Enregistrement...';

  const allergiesChoisies = Array.from(document.querySelectorAll('input[name="allergies"]:checked')).map(c => c.value);
  const boissonsChoisies = Array.from(document.querySelectorAll('input[name="boissons"]:checked')).map(c => c.value);

  const { data, error } = await supabaseClient.rpc('enregistrer_reponses', {
    code_saisi: code,
    p_date_arrivee: document.getElementById('date_arrivee').value || null,
    p_heure_arrivee: document.getElementById('heure_arrivee').value || null,
    p_moyen_arrivee: document.getElementById('moyen_arrivee').value || null,
    p_autre_moyen_arrivee: document.getElementById('autre_moyen_arrivee').value || null,
    p_date_depart: document.getElementById('date_depart').value || null,
    p_heure_depart: document.getElementById('heure_depart').value || null,
    p_moyen_depart: document.getElementById('moyen_depart').value || null,
    p_autre_moyen_depart: document.getElementById('autre_moyen_depart').value || null,
    p_regime_alimentaire: document.getElementById('regime_alimentaire').value || null,
    p_allergies: allergiesChoisies,
    p_autre_allergie: document.getElementById('autre_allergie').value || null,
    p_aliments_detestes: document.getElementById('aliments_detestes').value || null,
    p_preference_chambre: document.getElementById('preference_chambre').value || null,
    p_avec_qui: document.getElementById('avec_qui').value || null,
    p_eviter_qui: document.getElementById('eviter_qui').value || null,
    p_repas_vendredi_soir: document.getElementById('repas_vendredi_soir').value || null,
    p_repas_samedi_midi: document.getElementById('repas_samedi_midi').value || null,
    p_repas_samedi_soir: document.getElementById('repas_samedi_soir').value || null,
    p_repas_dimanche_matin: document.getElementById('repas_dimanche_matin').value || null,
    p_boissons: boissonsChoisies,
    p_theme_vendredi: document.getElementById('theme_vendredi').value || null,
    p_theme_samedi: document.getElementById('theme_samedi').value || null,
    p_activite_samedi_matin: document.getElementById('activite_samedi_matin').value || null,
    p_activite_samedi_apres_midi: document.getElementById('activite_samedi_apres_midi').value || null,
    p_activite_dimanche_matin: document.getElementById('activite_dimanche_matin').value || null,
    p_activite_dimanche_apres_midi: document.getElementById('activite_dimanche_apres_midi').value || null,
    p_suggestions_activites: document.getElementById('suggestions_activites').value || null
  });

  if (error) {
    console.error(error);
    messageEl.textContent = "Une erreur est survenue, réessaie.";
    return;
  }

  messageEl.textContent = 'Tes réponses ont bien été enregistrées, merci !';
}

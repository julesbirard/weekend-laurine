// Même logique de compte à rebours et de bascule automatique qu'avant,
// juste déplacée dans son propre fichier.
const dateOuverture = new Date('2026-07-25T00:00:00');

function mettreAJourCompteARebours() {
  const maintenant = new Date();
  const difference = dateOuverture - maintenant;

  if (difference <= 0) {
    window.location.href = 'homepage.html';
    return;
  }

  const jours = Math.floor(difference / (1000 * 60 * 60 * 24));
  const heures = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const secondes = Math.floor((difference / 1000) % 60);

  document.getElementById('jours').textContent = jours;
  document.getElementById('heures').textContent = heures;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('secondes').textContent = secondes;
}

mettreAJourCompteARebours();
setInterval(mettreAJourCompteARebours, 1000);

const jourJ = new Date('2026-09-04T17:00:00');

function mettreAJourCompteARebours() {
  const maintenant = new Date();
  const difference = jourJ - maintenant;

  if (difference <= 0) {
    document.getElementById('countdown').textContent = "C'est parti !";
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

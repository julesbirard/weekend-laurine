// Utilise la fonction partagée définie dans js/countdown.js
demarrerCompteARebours(
  new Date('2026-09-04T17:00:00'),
  () => { document.getElementById('countdown').textContent = "C'est parti !"; }
);

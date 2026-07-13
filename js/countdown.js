// Fonction de compte à rebours réutilisable.
// - dateCible : la date/heure vers laquelle compter
// - actionQuandTermine : fonction appelée une fois la date atteinte
//   (ex : rediriger vers une autre page, ou afficher un message)
//
// Suppose que la page contient 4 éléments avec ces identifiants :
// #jours, #heures, #minutes, #secondes
function demarrerCompteARebours(dateCible, actionQuandTermine) {
  function mettreAJour() {
    const maintenant = new Date();
    const difference = dateCible - maintenant;

    if (difference <= 0) {
      actionQuandTermine();
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

  mettreAJour();
  setInterval(mettreAJour, 1000);
}

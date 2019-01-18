/**
 * Metodo per verificare se l'utente è loggato correttamente
 */
var utente = sessionStorage.getItem("utente");
if(utente == null){
    alert("Effettua LogIn");
    window.location.href = '../../Login/login.html';
}

function logout(){
    firebase.auth().signOut().then(function() {
        window.location.href = '../../Login/login.html';
      }).catch(function(error) {
        // An error happened.
      });
}

/**
 * Collegamento verso le altre pagine
 */
function goToNuovoBug(){
  window.location.href = '../NuovoBug/nuovo_bug.html';
}

function goToNuovoUtente(){
  window.location.href = '../CreaUtente/creautente.html';
}

function goToVisualizza(){
  window.location.href = '../VisualizzaBug/visualizzabug.html';
}
function goToStats(){
  window.location.href = '../Statistiche/statistiche.html';
}
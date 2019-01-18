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
function goToNuovoBug(){
  window.location.href = '../NuovoBug/nuovo_bug.html';
}

function goToVisualizza(){
  window.location.href = '../VisualizzaBug/visualizzabug_agenti.html';
}

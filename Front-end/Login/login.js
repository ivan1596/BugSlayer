/**
 * Questa funzione utilizza il metodo della libreria firebase
 * per effettuare il login, se l'utente esiste viene chiamato il metodo ruolo
 * altrimenti compare un messaggio d'errore
 */
function login(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
      firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        ruolo(email);
      }).catch(function(error) {
        
        var errorCode = error.code;
        var errorMessage = error.message;
        window.alert(errorMessage);
      });
    

}

/**
 * Funzione per verificare il ruolo dell'utente e reindirizzarlo nella corrispondente homepage
 * @param {*} email 
 */
function ruolo(email){
  $.ajax({ 
    url : "http://localhost:8080/ruolo/"+email+"/", 
    //dataType: 'json', 
    cache: false,
    async : false,
    headers: {
        'Content-Type':'application/json',
    },
    type : "GET", 
    "success": function(result) {
      var valoreArray = result[0];
      if(valoreArray != null){
        var ruolo = result[0].Ruolo;
        if(ruolo == 'ADMIN'){
          sessionStorage.setItem("utente",email);
          sessionStorage.setItem("ruolo",ruolo);
          window.location.href = '../Admin/Home/home.html';
          
        }else if(ruolo == 'AGENTE'){
          sessionStorage.setItem("utente",email);
          sessionStorage.setItem("ruolo",ruolo);
          window.location.href = '../Agente/Home/home_agente.html';
          
        }else{
          alert('Credenziali errate');
        }
      }else{alert("L'utente non esiste nel database, potrebbe essere stato cancellato.")}
    },

      
    "error" : function(xhr, status, error) {
        var errore = JSON.stringify(xhr.responseText);
        var errorMessage = xhr.status + ':' + xhr.statusText;
        alert('Errore - ' + errorMessage +'['+ errore +']' );
        
        
    }
  });
}

function segnala(){
  window.location.href = '../Utente/home_utente.html';
}


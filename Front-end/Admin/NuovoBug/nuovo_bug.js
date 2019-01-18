/**
 * Metodo per verificare se l'utente è loggato correttamente
 */
var utente = sessionStorage.getItem("utente");
if(utente == null){
    alert("Effettua LogIn");
    window.location.href = '../../Login/login.html';
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

/**
 * Funzione per effettuare il logout
 */
function logout(){
    firebase.auth().signOut().then(function() {
        window.location.href = '../../Login/login.html';
      }).catch(function(error) {
        // An error happened.
      });
}

/**
 * Funzione che invia i dati relativi al bug al server
 */
function crea_bug(){
    //creo la data
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; 
    var yyyy = today.getFullYear();
    var ore = today.getHours();
    var min = today.getMinutes();
    if (dd < 10) {
    dd = '0' + dd;
    }

    if (mm < 10) {
    mm = '0' + mm;
    }

    today = dd + '/' + mm + '/' + yyyy + " "+ ore +":"+min;
    //prendo dati dal form
    var email = sessionStorage.getItem("utente");
    var software = document.getElementById("software").value;
    var selGrav = document.getElementById("grav");
    var gravità = selGrav.options[selGrav.selectedIndex].text;
    var selPrior = document.getElementById("prior");
    var priorità = selPrior.options[selPrior.selectedIndex].text;
    var selFreq = document.getElementById("freq");
    var frequenza = selFreq.options[selFreq.selectedIndex].text;
    var selAss = document.getElementById("ass");
    var assegnatario = selAss.options[selAss.selectedIndex].text;
    var descrizione = document.getElementById("desc").value;
    var ripetizione = document.getElementById("riprod").value;

    if(software =="" || descrizione =="" || ripetizione == "")
    {
      alert("Inserisci tutti i campi obbligatori");
      return;
    }
    $.ajax({ 
      url : "http://localhost:8080/nuovobug/", 
      contentType: "application/json; charset=utf-8",
      cache: false,
      type : "POST", 
      data: JSON.stringify({segnalatore:email,software:software,gravità:gravità,priorità:priorità,frequenza:frequenza,assegnatario:assegnatario,descrizione:descrizione,ripetizione:ripetizione,data:today}),
      "success": function(result) {
        alert("Bug aggiunto con successo");
        location.reload();
  
      },
  
        
      "error" : function(xhr, status, error) {
          var errore = JSON.stringify(xhr.responseText);
          var errorMessage = xhr.status + ':' + xhr.statusText;
          alert('Errore - ' + errorMessage +'['+ errore +']' );
          
          
      }
    });
  }

  /**
 * Questa funzione chiama l'endpoint /agenti per ricevere la lista degli agenti
 */
function agenti(){
    $.ajax({ 
        url : "http://localhost:8080/agenti/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        //async: false,
        type : "GET", 
        "success": function(result) {
          var arrayAgenti = result;
          arrayAgenti.forEach(element => {
            var agente = element.email;
            crea_option_agente(agente);
          });
          
          
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
      });
}

/**
 * questa funzione crea le opzioni per la select di agenti
 * @param {} agente 
 */
function crea_option_agente(agente){
    var select = document.getElementById("ass");
    var option = document.createElement("option");
    option.text = agente;
    //option.value = id;
    select.add(option);
}
var utente = sessionStorage.getItem("utente");
if(utente == null){
    alert("Effettua LogIn");
    window.location.href = '../../Login/login.html';
}

function goToNuovoBug(){
window.location.href = '../NuovoBug/nuovo_bug.html';
}


function goToVisualizza(){
    window.location.href = '../VisualizzaBug/visualizzabug_agenti.html';
}



function logout(){
    firebase.auth().signOut().then(function() {
        window.location.href = '../../Login/login.html';
      }).catch(function(error) {
        // An error happened.
      });
}

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
      //async : false,
      type : "POST", 
      data: JSON.stringify({segnalatore:email,software:software,gravità:gravità,priorità:priorità,frequenza:frequenza,descrizione:descrizione,ripetizione:ripetizione,data:today}),
      "success": function() {
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

  
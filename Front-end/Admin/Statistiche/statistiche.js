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
 * Questa funzione prende dal server i dati relativi all'apertura e alla chiusura di un bug
 */
function dati_chiusura(){
    $.ajax({ 
        url : "http://localhost:8080/statistica_creazione/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        type : "GET", 
        "success": function(result) {
          var arrayDati = result;
          arrayDati.forEach(element => {
            var id = element.id;
            var data_segnalazione = element.data_segnalazione;
            var data_risoluzione = element.data_risoluzione;
            crea_riga(id,data_segnalazione,data_risoluzione);
          });
          
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
      });
      dati_risoluzione();
      dati_gravità();
}

function crea_riga(id,data_segnalazione,data_risoluzione){
    
    var tr =$('<tr/>', {
        id: 'tr'+id ,
    });
    

    var td_id = $('<td/>',{
        id: 'id' 
    }).appendTo(tr);
    $(td_id).html(id);

    var td_ds = $('<td/>',{
        id: 'ds' 
    }).appendTo(tr);
    $(td_ds).html(data_segnalazione);

    var td_dr = $('<td/>',{
        id: 'dr' 
    }).appendTo(tr);
    $(td_dr).html(data_risoluzione);
   
    tr.appendTo("#table > tbody");
    
}

function dati_risoluzione(){
    $.ajax({ 
        url : "http://localhost:8080/statistica_risoluzione/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        type : "GET", 
        "success": function(result) {
            var totale = result[0].Totale;
            var risolti = result[1].Risolti;
            var differenza = parseInt(totale) - parseInt(risolti);
            $('#totale').html(totale);
            $('#risolti').html(risolti);
            $('#differenza').html(differenza);
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
      });
}

function dati_gravità(){
    $.ajax({ 
        url : "http://localhost:8080/statistica_gravita/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        type : "GET", 
        "success": function(result) {
            var minimaArr = result[0];
            var moderataArr = result[1];
            var massimaArr = result[2];

            if (minimaArr == null) {
                var minima = 0;
            }else{
                var minima = result[0].minimo;
            }
            if (moderataArr == null) {
                var moderata = 0;
            }else{
                var moderata = result[1].moderato;
            }
            if (massimaArr == null) {
                var massima = 0;
            }else{
                var massima = result[2].massimo;
            }
            $('#minima').html(minima);
            $('#moderata').html(moderata);
            $('#massima').html(massima);
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
      });
}

function logout(){
    firebase.auth().signOut().then(function() {
        window.location.href = '../../Login/login.html';
      }).catch(function(error) {
        // An error happened.
      });
}
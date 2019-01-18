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
 * Questa funzione chiama l'endpoint /bugs/ per ottenere la lista completa
 * dei bug presenti nel database
 */
function visualizza_bug(){
    //var select = document.getElementById("id_bug");
    $.ajax({ 
        url : "http://localhost:8080/bugs/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        //async : false,
        //mode:'cors',
        //crossDomain: true,
        type : "GET", 
        "success": function(result) {
          var arrayBug = result;
          arrayBug.forEach(element => {
            var id = element.id;
            crea_option_bug(id);
            var segnalatore = element.segnalatore;
            var assegnatario = element.assegnatario;
            var software = element.software;
            var priorita = element.priorita;
            var gravita = element.gravita;
            var descrizione = element.descrizione;
            crea_riga(id,software,segnalatore,assegnatario,priorita,gravita,descrizione);
          });
          agenti();
          
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
      });
}

/**
 * Questa funzione crea le righe per la tabella contentente i bug
 * prende in input tutti i campi relativi al bug
 * @param {*} id 
 * @param {*} software 
 * @param {*} segnalatore 
 * @param {*} assegnatario 
 * @param {*} priorita 
 * @param {*} gravita 
 * @param {*} descrizione 
 */
function crea_riga(id,software,segnalatore,assegnatario,priorita,gravita,descrizione){
    
    var tr =$('<tr/>', {
        id: 'tr'+id ,
    });
    

    var td_id = $('<td/>',{
        id: 'id' 
    }).appendTo(tr);
    //$(td_id).html(id);

    var button = $('<button/>',
    {
        id: 'button',
        //value: bolla,
        text: id,
        type: 'submit',
        class: 'btn btn-danger',
        click: function () { 
            var conferma = confirm("ATTENZIONE! Confermando il bug e i relativi dati verranno cancellati dal database. Confermare?");
            if (conferma == true) {
                elimina_bug(id);
            } 
            
        }
    }).appendTo(td_id);

    var td_sw = $('<td/>',{
        id: 'sw' 
    }).appendTo(tr);
    $(td_sw).html(software);

    var td_segn = $('<td/>',{
        id: 'segn' 
    }).appendTo(tr);
    $(td_segn).html(segnalatore);

    var td_ass = $('<td/>',{
        id: 'ass' 
    }).appendTo(tr);
    $(td_ass).html(assegnatario);

    var td_prio = $('<td/>',{
        id: 'prio' 
    }).appendTo(tr);
    $(td_prio).html(priorita);

    var td_grav = $('<td/>',{
        id: 'grav' 
    }).appendTo(tr);
    $(td_grav).html(gravita);

    var td_desc = $('<td/>',{
        id: 'desc' 
    }).appendTo(tr);
    $(td_desc).html(descrizione);

   
    tr.appendTo("#table > tbody");
    
}

/**
 * Questa funzione crea le opzione per la select dei bug
 * @param {id del bug} id 
 */
function crea_option_bug(id){
    var select = document.getElementById("idbug");
    var option = document.createElement("option");
    option.text = id;
    //option.value = id;
    select.add(option);
}

/**
 * Questa funzione chiama l'endpoint /agenti per ricevere la lista degli agenti
 */
function agenti(){
    $.ajax({ 
        url : "http://localhost:8080/agenti/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        async: false,
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
    var select = document.getElementById("agenti");
    var option = document.createElement("option");
    option.text = agente;
    option.value = id;
    select.add(option);
}

/**
 * Funzione che invia i dati dell'assegnazione del bug al server
 */
function assegna(){
    var id = $("#idbug option:selected").html();
    var assegnatario = $("#agenti option:selected").html();
    $.ajax({ 
        url : "http://localhost:8080/assegna_bug/"+id+"/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        type : "PATCH", 
        data: JSON.stringify({agente:assegnatario}),
        "success": function(result) {
          alert("Bug assegnato!");
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
 * Questa funzione richiama l'endpoint per l'eliminazione del bug selezionato
 * @param {} id 
 */
function elimina_bug(id){
    $.ajax({ 
        url : "http://localhost:8080/elimina_bug/"+id+"/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        type : "DELETE", 
        "success": function() {
            alert("Bug eliminato con successo!")
            location.reload();
    
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


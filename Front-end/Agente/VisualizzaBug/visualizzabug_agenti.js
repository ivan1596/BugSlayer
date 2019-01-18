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
    window.location.href = '../VisualizzaBug/visualizzabug.html';
}



/**
 * Questa funzione chiama l'endpoint /bugs/ per ottenere la lista completa
 * dei bug presenti nel database
 */
function visualizza_bug(){
    
    var email = sessionStorage.getItem("utente");
    $.ajax({ 
        url : "http://localhost:8080/bugs/"+email+"/", 
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
            var software = element.software;
            var priorita = element.priorita;
            var gravita = element.gravita;
            var descrizione = element.descrizione;
            var riproduzione = element.riproduzione;
            crea_riga(id,software,segnalatore,priorita,gravita,descrizione,riproduzione);
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
function crea_riga(id,software,segnalatore,priorita,gravita,descrizione,riproduzione){
    
    var tr =$('<tr/>', {
        id: 'tr'+id ,
    });
    

    var td_id = $('<td/>',{
        id: 'id' 
    }).appendTo(tr);
    $(td_id).html(id);

    var td_sw = $('<td/>',{
        id: 'sw' 
    }).appendTo(tr);
    $(td_sw).html(software);

    var td_segn = $('<td/>',{
        id: 'segn' 
    }).appendTo(tr);
    $(td_segn).html(segnalatore);

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

   var td_rip = $('<td/>',{
        id: 'rip' 
    }).appendTo(tr);
    $(td_rip).html(riproduzione);

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
 * Questa funzione invia i dati di risoluzione del bug al server
 */

function risolvi(){
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

    var id = $("#idbug option:selected").html();
    var commento = document.getElementById("commento").value;
    $.ajax({ 
        url : "http://localhost:8080/risolvi_bug/"+id+"/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        type : "PATCH", 
        data: JSON.stringify({commento:commento,data:today}),
        "success": function() {
          alert("Bug risolto!");
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
        sessionStorage.clear();
        window.location.href = '../../Login/login.html';
      }).catch(function(error) {
        // An error happened.
      });
}
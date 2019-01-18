/**
 * Metodo per verificare se l'utente è loggato correttamente
 */
var utente = sessionStorage.getItem("utente");
if(utente == null){
    alert("Effettua LogIn");
    window.location.href = '../../Login/login.html';
}

/**
 * Collegamenti verso le altre pagine
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

function crea_utente_fb(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
            crea_utente_db();
        }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
      });
    
}

function crea_utente_db(){
    var email = document.getElementById("email").value;
    var username = document.getElementById("user").value;
    var selRuolo = document.getElementById("ruolo");
    var ruolo = selRuolo.options[selRuolo.selectedIndex].text; 
    $.ajax({ 
        url : "http://localhost:8080/creautente/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        async : false,
        //mode:'cors',
        crossDomain: true,
        type : "POST", 
        data: JSON.stringify({email:email,username:username,ruolo:ruolo}),
        "success": function() {
          alert("Utente aggiunto con successo");
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

function utenti(){
    var email = sessionStorage.getItem("utente"); 
    $.ajax({ 
        url : "http://localhost:8080/utenti/"+email+"/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        async : false,
        //mode:'cors',
        //crossDomain: true,
        type : "GET", 
        "success": function(result) {
            var arrayUtenti = result;
            arrayUtenti.forEach(element => {
                
                var email = element.email;
                var username = element.username;
                var ruolo = element.ruolo;
                crea_riga_utente(email,username,ruolo);
            });
          
    
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
    });

}


function crea_riga_utente(email,username,ruolo){
    
    var tr =$('<tr/>', {
        id: 'tr' ,
    });
    
    var td_email = $('<td/>',{
        id: 'email' 
    }).appendTo(tr);
    $(td_email).html(email);

    var td_user = $('<td/>',{
        id: 'user' 
    }).appendTo(tr);
    $(td_user).html(username);

    var td_ruolo = $('<td/>',{
        id: 'ruolo' 
    }).appendTo(tr);
    $(td_ruolo).html(ruolo);

    var td_button = $('<td/>',{
        id: 'ruolo' 
    }).appendTo(tr);
    
    var button = $('<button/>',
    {
        id: 'button',
        //value: bolla,
        text: "Elimina",
        type: 'submit',
        class: 'btn btn-danger',
        click: function () { 
            var conferma = confirm("ATTENZIONE! Questa operazione potrebbe compromettere l'integrità del database. Confermare?");
            if (conferma == true) {
                elimina_utente(email);
            } 
        }
    }).appendTo(td_button);

    tr.appendTo("#table > tbody");
    
}

function elimina_utente(email){
    $.ajax({ 
        url : "http://localhost:8080/elimina_utente/"+email+"/", 
        contentType: "application/json; charset=utf-8",
        cache: false,
        //async : false,
        //mode:'cors',
        //crossDomain: true,
        type : "DELETE", 
        "success": function() {
            alert("Utente eliminato con successo!")
            location.reload();
    
        },
    
          
        "error" : function(xhr, status, error) {
            var errore = JSON.stringify(xhr.responseText);
            var errorMessage = xhr.status + ':' + xhr.statusText;
            alert('Errore - ' + errorMessage +'['+ errore +']' );
            
            
        }
    });

}



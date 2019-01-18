var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
var sqlite = require("./sqlite/sqlite.js");
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

  app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,application/json, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  next();
}); 

/**
 * Endpoint per ricavare il ruolo dall'email
 */
app.get('/ruolo/:email/',function(req,res){
    
  var email = req.params.email;
  sqlite.getRuolo(function (Ruoli){
    res.json(Ruoli);   
  },email)
}); 

/**
 * Endpoint per inserire i dati del bug nel database
 */
app.post('/nuovobug/',function(req,res){
  var bugReq= req.body;
  var segnalatore = bugReq.segnalatore;
  var assegnatario = bugReq.assegnatario;
  var priorità= bugReq.priorità;
  var gravità = bugReq.gravità;
  var ripetizione = bugReq.frequenza; 
  var data = bugReq.data;
  var software = bugReq.software;
  var descrizione = bugReq.descrizione;
  var riproduzione = bugReq.ripetizione;

  sqlite.aggiungiBug(segnalatore,assegnatario,priorità,gravità,ripetizione,data,software,descrizione,riproduzione); 
  res.end();
});

/**
 * Endpoint per la creazione dell'utente
 */
app.post('/creautente/',function(req,res){
  var utenteReq= req.body;
  var email = utenteReq.email;
  var username = utenteReq.username;
  var ruolo = utenteReq.ruolo;
  sqlite.aggiungiDatiUtenti(email,username,ruolo); 
  res.end();
});
/**
 * Endpoint dove è reperibile tutta la lista dei bug
 */
app.get('/bugs/',function(req,res){
  sqlite.getBugs(function (Bugs){
    res.json(Bugs);   
  })
}); 
/**
 * Endpoint dove sono reperibili tutti gli agenti
 */
app.get('/agenti/',function(req,res){
  sqlite.getAgenti(function (Agenti){
    res.json(Agenti);   
  })
}); 

/**
 * Endpoint per l'assegnazione di un bug
 */
app.patch('/assegna_bug/:id/',function(req,res){
  var id = req.params.id;
  var agente = req.body.agente;
  sqlite.assegnaAgente(id,agente);
  res.end();
}); 

/**
 * Endpoint per le statistiche di creazione del bug
*/
app.get('/statistica_creazione/',function(req,res){
  sqlite.statisticaChiusura(function (datiStat){
    res.json(datiStat);   
  })
}); 

/**
 * Endpoint per le statistiche quantitative
 */
app.get('/statistica_risoluzione/',function(req,res){
  sqlite.statisticheQuantitative(function (Dati){
    res.json(Dati);   
  })
}); 

/**
 * Endpoint per le statistiche quantitative
 */
app.get('/statistica_gravita/',function(req,res){
  sqlite.statisticheGravità(function (Dati){
    res.json(Dati);   
  })
}); 

/**
 * Endpoint per la risoluzione di un bug
 */
app.patch('/risolvi_bug/:id/',function(req,res){
  var id = req.params.id;
  var data = req.body.data;
  var commento = req.body.commento;
  sqlite.risolviBug(id,data,commento);
  res.end();
}); 

/**
 * Endpoint per i bug assegnati a uno specifico agente
 */
app.get('/bugs/:agente/', function (req, res) {
  //console.log ('body req !stringify'+req.body);
  var agente = req.params.agente; 
  sqlite.getBugsAgente(function (Bugs){
    res.json(Bugs);
  },agente)

});

/**
 * Endpoint per prendere tutti i dati utente dal database
 */
app.get('/utenti/:email/',function(req,res){
    
  var email = req.params.email;
  sqlite.getUtenti(function (Utenti){
    res.json(Utenti);   
  },email)
}); 

/**
 * Endpoin presso cui è possibile eliminare un utente
 */
app.delete('/elimina_utente/:email/',function(req,res){
  var email = req.params.email;
  sqlite.eliminaUtente(email);
  res.end();
}); 

/**
 * Endpoint presso cui è possibile eliminare un bug
 */
app.delete('/elimina_bug/:id/',function(req,res){
  var id = req.params.id;
  sqlite.eliminaBug(id);
  res.end();
}); 
//Inizializza il server
app.listen(8080, function() {
    console.log('In ascolto su 8080');
  });
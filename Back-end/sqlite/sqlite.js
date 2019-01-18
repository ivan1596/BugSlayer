const sqlite3 = require('sqlite3').verbose();
const database = './bug_tracker.db';

module.exports = {
    
    /**
     * Questa funzione esegue la query per inserire i dati del bug all'interno del database
     * I parametri sono i dati del bug
     * @param {*} segnalatore 
     * @param {*} assegnatario 
     * @param {*} priorità 
     * @param {*} gravità 
     * @param {*} ripetizione 
     * @param {*} data 
     * @param {*} software 
     * @param {*} descrizione 
     * @param {*} riproduzione 
     */

    aggiungiBug: function (segnalatore,assegnatario,priorità,gravità,ripetizione,data,software,descrizione,riproduzione) {
        let db = new sqlite3.Database(database);
        let sql = `INSERT INTO BUG (Segnalatore,Assegnatario,Priorita,Gravita,Ripetizione,Data_Segnalazione,Software,Descrizione,Riproduzione)  
        VALUES (?,?,?,?,?,?,?,?,?)`;
        db.run(sql,segnalatore,assegnatario,priorità,gravità,ripetizione,data,software,descrizione,riproduzione, function(err){
            if (err) {
                console.error(err.message);
                }
            console.log('Hai immesso correttamente i dati del bug!');
    
            });
        db.close();
      
    },
    /**
     * Questa funziona ritorna la riga di database 
     * dove l'email è uguale a quella passata come parametro
     * @param {*} email 
     */
    getRuolo: function (callback,email) {
        let db = new sqlite3.Database(database);
        var Ruoli = [];
        let sql = `SELECT Ruolo FROM Utente WHERE Email = ?`;

        db.get(sql,email, [], (err, row) => {
            if (err) {
                throw err;
            }
            Ruoli.push(row);
            callback(Ruoli);

        });

        db.close();

    },

    /**
     * Questa funzione inserisce nel database i dati dell'utente
     * @param {*} email 
     * @param {*} username 
     * @param {*} ruolo 
     */
    aggiungiDatiUtenti: function (email,username,ruolo) {
        let db = new sqlite3.Database(database);
        let sql = `INSERT INTO UTENTE (Email,Username,Ruolo) VALUES (?,?,?)`;
        db.run(sql,email,username,ruolo, function(err){
            if (err) {
                console.error(err.message);
                }
            console.log('Hai immesso correttamente i dati utente!');
    
            });
        db.close();
      
    },

    /**
     * Questa funzione prende dal database tutti i bug presenti nel sistema
     * @param {*} callback 
     * @param {*} utente 
     */
    getBugs: function (callback) {
        let db = new sqlite3.Database(database);

        var Bugs = [];


        let sql = `SELECT ID,Segnalatore,Assegnatario,Priorita,Gravita,Software,Descrizione FROM Bug `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                
                var bug = {}; 
                bug.id = row.ID;
                bug.segnalatore = row.Segnalatore;
                bug.assegnatario = row.Assegnatario;
                bug.priorita = row.Priorita;
                bug.gravita = row.Gravita;
                bug.software = row.Software;
                bug.descrizione = row.Descrizione;
                
                Bugs.push(bug);
                
            });
            //call the callback
            callback(Bugs);

        });


        db.close();

    },

    /**
     * Questa funzione estrapola dal database l'email di tutti gli agenti
     * @param {*} callback 
     */
    getAgenti: function (callback) {
        let db = new sqlite3.Database(database);

        var Agenti = [];

        let sql = `SELECT Email FROM Utente WHERE Ruolo = 'AGENTE' `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                
                var agente = {}; 
                agente.email = row.Email;                
                Agenti.push(agente);
                
            });
            //call the callback
            callback(Agenti);

        });


        db.close();

    },

    /**
     * Questa funzione assegna il bug selezionato all'utente selezionato
     * @param {*} id 
     * @param {*} agente 
     */
    assegnaAgente: function (id,agente) {
        let db = new sqlite3.Database(database);

        let sql = 'UPDATE Bug SET Assegnatario = ? WHERE ID = ?'
        db.run(sql,agente,id,function(err){
            if(err){
                console.error(err.message);
            }
            console.log('Hai assegnato il bug!');
        });
        db.close();


    },
    /**
     * Questa funzione prende dal database le date di apertura e chiusura di tutti i bug risolti
     * @param {*} callback 
     */
    statisticaChiusura: function (callback) {
        let db = new sqlite3.Database(database);

        var datiStat = [];

        let sql = `SELECT ID,Data_Segnalazione,Data_Risoluzione FROM Bug WHERE Data_Risoluzione IS NOT NULL `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                
                var statistica = {}; 
                statistica.id = row.ID; 
                statistica.data_segnalazione = row.Data_Segnalazione;
                statistica.data_risoluzione = row.Data_Risoluzione;              
                datiStat.push(statistica);
                
            });
            //call the callback
            callback(datiStat);

        });


        db.close();


    },

    /**
     * Questa funzione ricava le statistiche quantitative dal database
     * @param {*} callback 
     */
    statisticheQuantitative: function (callback) {
        let db = new sqlite3.Database(database);
        var Dati = [];
        let sql = 'SELECT COUNT(ID) AS Totale FROM Bug';
        let sql2 = 'SELECT COUNT(ID) AS Risolti FROM Bug WHERE Data_Risoluzione IS NOT NULL;';
        db.get(sql,function(err,row){
            if(err){
                console.error(err.message);
            }
            
            Dati.push(row);
            
        });
        db.get(sql2,function(err,row){
            if(err){
                console.error(err.message);
            }
            //var risolti = [row];
            Dati.push(row);
            callback(Dati);
        });

        db.close();

        
    },

    /**
     * Questa funzione ricava le statistiche riguardanti la gravità dei bug 
     * @param {*} callback 
     */
    statisticheGravità: function (callback) {
        let db = new sqlite3.Database(database);
        var Dati = [];
        let sql = 'SELECT COUNT(*) AS minimo  FROM Bug GROUP BY Gravita Having Gravita = "Minima"';
        let sql2 = 'SELECT COUNT(*) AS moderato FROM Bug GROUP BY Gravita Having Gravita = "Moderata"';
        let sql3 = 'SELECT COUNT(*) AS massimo FROM Bug GROUP BY Gravita Having Gravita = "Massima"';
        db.get(sql,function(err,row){
            if(err){
                console.error(err.message);
            }
            
            Dati.push(row);
            
        });

        db.get(sql2,function(err,row){
            if(err){
                console.error(err.message);
            }
            
            Dati.push(row);
            
        });

        db.get(sql3,function(err,row){
            if(err){
                console.error(err.message);
            }
            Dati.push(row);
            callback(Dati);
        });

        db.close();

        
    },

    /**
     * Questa funzione assegna il bug selezionato all'utente selezionato
     * @param {*} id 
     * @param {*} data
     * @param {*} commento
     */
    risolviBug: function (id,data,commento) {
        let db = new sqlite3.Database(database);

        let sql = 'UPDATE Bug SET Data_Risoluzione = ?, Commento_Risoluzione = ? WHERE ID = ?'
        db.run(sql,data,commento,id,function(err){
            if(err){
                console.error(err.message);
            }
            console.log('Hai risolto il bug!');
        });
        db.close();


    },

    /**
     * Questa funzione prende dal database tutti i bug presenti nel sistema
     * @param {*} callback 
     * @param {*} utente 
     */
    getBugsAgente: function (callback,agente) {
        let db = new sqlite3.Database(database);

        var Bugs = [];


        let sql = `SELECT ID,Segnalatore,Priorita,Gravita,Software,Descrizione,Riproduzione FROM Bug WHERE Assegnatario = ? AND Data_Risoluzione IS NULL`;

        db.all(sql,agente, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                
                var bug = {}; 
                bug.id = row.ID;
                bug.segnalatore = row.Segnalatore;  
                bug.priorita = row.Priorita;
                bug.gravita = row.Gravita;
                bug.software = row.Software;
                bug.descrizione = row.Descrizione;
                bug.riproduzione = row.Riproduzione;
                Bugs.push(bug);
                
            });
            //call the callback
            callback(Bugs);

        });


        db.close();

    },

    /**
     * Questa funziona prende tutti gli utenti dal database
     * tranne l'utente che ha chiamato la funzione
     * @param {*} email 
     */
    getUtenti: function (callback,email) {
        let db = new sqlite3.Database(database);
        var Utenti = [];
        let sql = `SELECT * FROM Utente WHERE Email <> ?;`;

        db.all(sql,email, [], (err, rows) => {
            if (err) {
                throw err;
            }

            rows.forEach((row) => {
                var utente = {};
                utente.email = row.Email;
                utente.username = row.Username;
                utente.ruolo = row.Ruolo;
                Utenti.push(utente);
                
            });
            
            callback(Utenti);

        });

        db.close();

    },

    /**
     * Metodo per eliminare un utente dal database
     * @param {*} email utente da eliminare 
     */
    eliminaUtente: function (email) {
        let db = new sqlite3.Database(database);

        let sql = 'DELETE FROM Utente WHERE Email = ?'
        db.run(sql,email,function(err){
            if(err){
                console.error(err.message);
            }
            console.log('Hai eliminato l utente!');
        });
        db.close();


    },

    /**
     * Questa funzione elimina dal database il bug con l'id del parametro
     * @param {*} id 
     */
    eliminaBug: function (id) {
        let db = new sqlite3.Database(database);

        let sql = 'DELETE FROM Bug WHERE ID = ?'
        db.run(sql,id,function(err){
            if(err){
                console.error(err.message);
            }
            console.log('Hai eliminato il bug!');
        });
        db.close();


    },



    

    
    
}
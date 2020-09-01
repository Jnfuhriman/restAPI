const express = require('express');
const mysql = require('mysql');
const router = express.Router();

function getTodaysDate(){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    //today = mm + '/' + dd + '/' + yyyy;
    today = `${yyyy}-${mm}-${dd}`;
    return today;
}

//DB table format
// users table = (username, password, access_level)
// tickets table = (ID, created_by, date_created, date_closed, open, description)
// 0 means open, 1 means closed

//gets all tickets
//  localhost:5000/api/tickets
router.get('/', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
    connection.query('SELECT * FROM tickets', (err, result)=>{
        res.json(result);
    });
    connection.end();
});

//  localhost:5000/api/tickets/openTickets
router.get('/openTickets', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
    connection.query('SELECT * FROM tickets WHERE status = 0', (err, result)=>{
        if(err){
            res.status(400).json({ msg: err });
        } else{
            res.json(result);
        }
        
    });
    connection.end();
});

// Create ticket
//  localhost:5000/api/tickets/:created_by/:description
router.post('/:created_by/:description', (req, res) => {
    let tickets = 'tickets';
    let todays_date = getTodaysDate();
    let generic_date = "1111-11-11";
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
    let ticket_data = {
            "created_by":req.params.created_by,
            "date_created":todays_date,
            "date_closed":generic_date,
            "status":0,
            "description":req.params.description
    };    
    let sqlQuery = `INSERT INTO tickets (created_by, date_created, date_closed, status, description) VALUES ("${ticket_data.created_by}", "${ticket_data.date_created}","${ticket_data.date_closed}", "${ticket_data.status}", "${ticket_data.description}")`;
    connection.query(sqlQuery, (err, result) =>{
        if (err) {
            return res.status(400).json({ msg:"There was an issue creating that ticket" });
            console.log(err);
        } else{
            return res.status(200).json({ msg:"Successfully added the ticket" });
        }
    });
    connection.end();
});

//Mark a ticket as closed
// localhost:5000/api/tickets/:ID
router.put('/:ID', (req,res) => {
    let ticket_ID = 'ID';
    let tickets = 'tickets';
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
    let ticket_data = {
        'ID': req.params.ID
    };
    let sqlQuery = `UPDATE tickets SET status = 1, date_closed = '${getTodaysDate()}' WHERE ${ticket_ID} = ${ticket_data.ID}`;
    connection.query(sqlQuery, (err,result)=>{
        if (err){
            return res.status(400).json({ msg:err });
            
        } else {
            return res.status(200).json({ msg:'Successfully updated the ticket' });
        }
    });
});

module.exports = router;
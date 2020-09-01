const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//gets all users
//  localhost:5000/api/users
router.get('/', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
    connection.query('SELECT * FROM users', (err, result)=>{
        res.json(result);
    });
    connection.end();
});

//get user by username
//  localhost:5000/api/users/getUser
router.get('/:getUser', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
      let user_data = {
            "user": req.params.getUser
      }
    //let sqlQuery =  `SELECT * FROM tickets WHERE username = ${user}`
    connection.query(`SELECT * FROM users WHERE username = '${user_data.user}'`, (err, result)=>{
        if(err){
            res.status(400).json({ msg: err });
        } else{
            res.json(result);
        }
        
    });
    connection.end();
});

//add user
//   localhost:5000/api/users/:user/:password/:authLevel
router.post('/:user/:password/:authLevel', (req, res) => {
    let connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "root",
        database: "bug_tracker"
      });
    let user_data = {
        "username":req.params.user,
        "password":req.params.password,
        "access_level":req.params.authLevel
    };    
    if (user_data.access_level == "admin" || user_data.access_level == "user"){
        let sqlQuery = `INSERT INTO users (username, password, access_level) VALUES ("${user_data.username}", "${user_data.password}", "${user_data.access_level}")`;
        connection.query(sqlQuery, (err, result) =>{
            if (err) {
                return res.status(400).json({ msg:"There was an issue creating that user" });
                console.log(err);
            } else{
                return res.status(200).json({ msg:"Successfully added the user" });
            }
        });
        connection.end();
    } else{
        return res.status(400).json({ msg:"access level must be either user or admin" });
    }
});

module.exports = router;
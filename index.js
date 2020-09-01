const express = require('express');
const path = require('path');
//const logger = require('./middleware/logger');
const app = express();


//init middleware
//app.use(logger);
//Body Parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended:false }));
//allow cors requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

//Set a static folder
app.use(express.static(path.join(__dirname, "public")));

//api tickets routes
app.use('/api/tickets', require('./routes/api/tickets'));
//api users routes
app.use('/api/users', require('./routes/api/users'));

const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});
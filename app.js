//get environmental variables from env file
require('dotenv').config();

const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

var index = require('./routes/index');
var dynamic= require('./routes/dynamic');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', index);
app.use('/dynamic', dynamic);

app.listen(PORT, function(){
	console.log('Server running on port ' + PORT);
});

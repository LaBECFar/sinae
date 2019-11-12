const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const db = require('./db/connect');

const router = express.Router();

//Rotas
const index = require('./routes/index');
const deviceRoutes   = require('./routes/deviceRoutes');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

const cors = require('cors')

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

app.use(cors(corsOptions));

app.use('/device', deviceRoutes);

app.use('/', index);

module.exports = app;
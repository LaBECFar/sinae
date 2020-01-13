const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const db = require('./db/connect');

const router = express.Router();

//Rotas
const index = require('./routes/index');
const experimentoRoutes   = require('./routes/experimentoRoutes');
const analiseRoutes   = require('./routes/analiseRoutes');
const frameRoutes   = require('./routes/frameRoutes');
const pocoRoutes   = require('./routes/pocoRoutes');
const userRoutes   = require('./routes/userRoutes');

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

app.use('/experimento', experimentoRoutes);
app.use('/analise', analiseRoutes);
app.use('/frame', frameRoutes);
app.use('/poco', pocoRoutes);
app.use('/user', userRoutes);
app.use('/', index);

module.exports = app;
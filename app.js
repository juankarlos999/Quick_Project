const swaggerUI = require('swagger-ui-express');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const yaml = require('yamljs');
require('dotenv').config()


// will use in the future
// const swaggerJSDocs = require('swagger-jsdoc');
const swaggerJS = yaml.load('./documentation.yaml');

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJS));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const mongoDB = "mongodb+srv://quick:quick@cluster0.lwjfu.mongodb.net/testdb?retryWrites=true&w=majority";

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

/**
 * Redirection
 */
app.get('/', function (req, res) {
  res.status(200).send('Welcome to the LaDificil API, If you need information please go to the /api-docs');
});

app.use('/api', require('./routes/index.js'));

/**
 * redirect 404 errors in ExpressJS
 */
app.use((req, res, next) => {
  res.status(404).send({ error: 'Not found. Please following this guide https://github.com/SneyderHOL/Quick_Project' });
  next();
});

module.exports = app;

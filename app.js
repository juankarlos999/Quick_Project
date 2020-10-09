const swaggerUI = require('swagger-ui-express');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const yaml = require('yamljs');
const dotenv = require('dotenv');

// will use in the future
// const swaggerJSDocs = require('swagger-jsdoc');
const swaggerJS = yaml.load('./documentation.yaml');
dotenv.config();
const { nameDb, passwdDb, dbName } = require('./config');

const app = express();
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJS));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const mongoDB = process.env.URL_DB || 'mongodb://localhost:27017/Peajes';

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use('/api', require('./routes/index.js'));

/**
 * redirect 404 errors in ExpressJS
 */
app.use((req, res, next) => {
  res.status(404);
  res.send({ error: 'Not found. Please following this guide https://github.com/SneyderHOL/Quick_Project' });
  next();
});

module.exports = app;

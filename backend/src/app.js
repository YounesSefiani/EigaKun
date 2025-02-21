const express = require('express');

const app = express();

const path = require('path');

const cors = require('cors');

// Configuration CORS pour autoriser les requêtes de votre domaine frontend
const corsOptions = {
  origin: 'http://localhost:5173', // Assurez-vous que cette URL correspond à l'URL de votre frontend
  credentials: true, // Permet les cookies cross-origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées pour les requêtes CORS
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const router = require('./router');

app.use('/api', router);

app.use((req, res, next) => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(`URL: ${req.originalUrl}`);
  next();
});

/* *********MOVIES********* */

app.use(
  '/src/assets/Movies/posters',
  express.static(path.join(__dirname, '../src/assets/Movies/posters'))
);

app.use(
  '/src/assets/Movies/logos',
  express.static(path.join(__dirname, '../src/assets/Movies/logos'))
);

app.use(
  '/src/assets/Movies/backgrounds',
  express.static(path.join(__dirname, '../src/assets/Movies/backgrounds'))
);

/* *********SERIES********* */

app.use(
  '/src/assets/Series/posters',
  express.static(path.join(__dirname, '../src/assets/Series/posters'))
);

app.use(
  '/src/assets/Series/logos',
  express.static(path.join(__dirname, '../src/assets/Series/logos'))
);

app.use(
  '/src/assets/Series/backgrounds',
  express.static(path.join(__dirname, '../src/assets/Series/backgrounds'))
);

/* *********SEASONS********* */

app.use(
  '/src/assets/Seasons/posters',
  express.static(path.join(__dirname, '../src/assets/Seasons'))
);

/* *********EPISODES********* */

app.use(
  '/src/assets/Episodes',
  express.static(path.join(__dirname, '../src/assets/Episodes'))
);

/* *********PERSONALITIES********* */

app.use(
  '/src/assets/Personalities',
  express.static(path.join(__dirname, '../src/assets/Personalities'))
);

/* *********USERS********* */

app.use(
  '/src/assets/Users',
  express.static(path.join(__dirname, '../src/assets/Users'))
);

const logErrors = (err, req, res, next) => {
  console.error(err);
  console.error('on req:', req.method, req.path);
  next(err);
};

app.use(logErrors);

module.exports = app;

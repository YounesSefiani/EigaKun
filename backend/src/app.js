const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');

// Autorise toutes les origines (pour Postman et le frontend)
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.use((req, res, next) => {
  // eslint-disable-next-line no-restricted-syntax
  console.log(`URL: ${req.originalUrl}`);
  next();
});

// Movies //
app.use('/src/assets/Movies/Posters', express.static('../src/assets/Movies/Posters'));
app.use('/src/assets/Movies/Logos', express.static('../src/assets/Movies/Logos'));
app.use('/src/assets/Movies/Backgrounds', express.static('../src/assets/Movies/Backgrounds'));


// Series //
app.use('/src/assets/Series/Posters', express.static('../src/assets/Series/Posters'));
app.use('/src/assets/Series/Logos', express.static('../src/assets/Series/Logos'));
app.use('/src/assets/Series/Backgrounds', express.static('../src/assets/Series/Backgrounds'));

// Ajoute cette ligne pour que l'app soit exportée correctement
module.exports = app;
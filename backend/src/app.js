const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./router');

// Autorise toutes les origines (pour Postman et le frontend)
app.use(
  cors({
    origin: "http://localhost:3000", // l'URL de ton frontend
    credentials: true,
  })
);
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

// Seasons //
app.use('/src/assets/Series/Seasons/Posters', express.static('../src/assets/Series/Seasons/Posters'));

// Episodes //
app.use('/src/assets/Series/Episodes/Images', express.static('../src/assets/Series/Episodes/Images'));

// Personalities //
app.use('/src/assets/Personalities/Images', express.static('../src/assets/Personalities/Images'));

// Users //
app.use('/src/assets/Users/Avatars', express.static('../src/assets/Users/Avatars'));
module.exports = app;
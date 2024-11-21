const express = require('express');

const app = express();

const cors = require('cors');

const path = require('path');

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

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

const logErrors = (err, req, res, next) => {
  console.error(err);
  console.error('on req:', req.method, req.path);
  next(err);
};

app.use(logErrors);

module.exports = app;

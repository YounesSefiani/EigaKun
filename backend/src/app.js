const express = require('express');

const app = express();

const cors = require('cors');

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
  // console.log(`URL: ${req.originalUrl}`);
  next();
});

const logErrors = (err, req, res, next) => {
  console.error(err);
  console.error('on req:', req.method, req.path);
  next(err);
};

app.use(logErrors);

module.exports = app;

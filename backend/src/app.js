const express = require("express");

const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended : true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const router = require("./router");
app.use("/api", router);

app.use((req, res, next) => {
    next();
});

const logErrors = (err, req, res, next) => {
    console.error(err);
    console.error("on req:", req.method, req.path);
    next(err);
};

app.use(logErrors);

module.exports = app;
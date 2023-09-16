"use strict";

// $ npx expose-wsl@latest # Expose server to Windows

// Import dependencies
const express = require("express");
const session = require("express-session");
const routes = require("./routes/routes.js");

const { minutesToMilliseconds } = require("./src/utils/miscUtil.js");

// Make instances
require("dotenv").config();

const app = express();
const store = new session.MemoryStore();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET || "17b54fc2-1761-4e7d-9402-2905f108303e",
    cookie: { maxAge: minutesToMilliseconds(45) },
    resave: false,
    saveUninitialized: false,
    store: store,
});

app.use(sessionMiddleware);

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.use((error, req, res, next) => {
    console.error('Error: ', error)

    if (error.type == 'redirect') {
        req.session.context = error;
        res.redirect('/error');
    }
    else if (error.type == 'time-out')
        res.status(408).send(error);
    else
        res.status(500).send(error);
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
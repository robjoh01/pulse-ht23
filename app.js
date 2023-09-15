"use strict";

require("dotenv").config();

const express = require("express");
const session = require("express-session");
const routes = require("./routes/routes.js");

const { minutesToMilliseconds } = require("./src/helpers.js");

const app = express();
const store = new session.MemoryStore();

const port = 1337;

app.set("view engine", "ejs");

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: minutesToMilliseconds(45) },
    resave: false,
    saveUninitialized: false,
    store: store,
});

app.use((req, res, next) => {
    try {
        if (!process.env.COOKIE_SECRET) {
            throw new Error("COOKIE_SECRET is missing!");
        }
        
        sessionMiddleware(req, res, next);
    } catch (error) {
        next(error);
    }
});

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
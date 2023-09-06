"use strict";

const express = require("express");
const port = 1337;
const app = express();
const routes = require("./routes/routes.js");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({extended: false}));

app.use(routes);

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

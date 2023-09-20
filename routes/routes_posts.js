"use strict";

// Import dependencies
const express = require("express");
const bcrypt = require('bcrypt');

// Import libraries
const dbUtil = require("./../src/utils/dbUtil.js");
const appUtil = require("./../src/utils/appUtil.js");
const conversionUtil = require("./../src/utils/conversionUtil.js");
const emailUtil = require("./../src/utils/emailUtil.js");
const profanityUtil = require("./../src/utils/profanityUtil.js");

// Import errors
const errors = require("./../src/errors/errors.js");

// Make instances
const router = express.Router();



module.exports = router;

/*

  <form action="/upload" method="POST" enctype="multipart/form-data">
    <input type="file" name="file" required>
    <button type="submit">Upload</button>
  </form>

  res.render('index', { helper:helper });

  <%= helper.common1() %>

*/

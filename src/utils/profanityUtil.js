"use strict";

const profanity = require("@2toad/profanity");

const options = new profanity.ProfanityOptions();
options.wholeWord = false;
options.grawlix = '*****';
options.grawlixChar = '$';

const prof = new profanity.Profanity(options);

let profanityUtil = {
    exists: function(text) {
        return prof.exists(text);
    },
};

module.exports = profanityUtil;

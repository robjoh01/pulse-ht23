"use strict";

const profanity = require("@2toad/profanity");

const options = new profanity.ProfanityOptions();
options.wholeWord = false;
options.grawlix = "*****";
options.grawlixChar = "$";

const prof = new profanity.Profanity(options);

/**
 * Utility for detecting profanity in text.
 * @namespace
 */
const profanityUtil = {
    /**
     * Check if profanity exists in the given text.
     * @function
     * @param {string} text - The text to check for profanity.
     * @returns {boolean} - Whether profanity exists in the text.
     */
    exists: function (text) {
        return prof.exists(text);
    }
};

module.exports = profanityUtil;

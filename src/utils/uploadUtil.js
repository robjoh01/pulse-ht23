"use strict";

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

/**
 * Utility for handling file uploads.
 * @namespace
 */
const uploadUtil = {
    /**
     * Returns the storage configuration for file uploads.
     * @function
     * @returns {Object} Storage configuration Object.
     * @memberof uploadUtil
     */
    getStorage: function () {
        return storage;
    }
};

module.exports = uploadUtil;

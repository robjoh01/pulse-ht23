"use strict";

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
async function copyToClipboard (text) {
    try {
        await navigator.clipboard.writeText(text);
        showSnackBar("Successfully Copied");
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
}
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */

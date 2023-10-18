"use strict";

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
async function copyToClipboard (text) {
    try {
        await navigator.clipboard.writeText(text);
        Toastify({
            text: "Copy was successfully",
            className: "toastify-success",
            duration: 3000,
            gravity: "bottom",
            position: "center",
        }).showToast();
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
}
/* eslint-enable no-undef */
/* eslint-enable no-unused-vars */

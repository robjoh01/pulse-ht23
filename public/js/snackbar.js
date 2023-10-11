"use strict";

const messageQueue = [];
let isSnackbarVisible = false;

/* eslint-disable no-unused-vars */
function showSnackBar (message) {
    messageQueue.push(message);

    if (!isSnackbarVisible) {
        displayNextMessage();
    }
}
/* eslint-enable no-unused-vars */

function displayNextMessage () {
    const sb = document.getElementById("snackbar");
    if (messageQueue.length > 0) {
        const message = messageQueue.shift();
        sb.textContent = message;
        sb.className = "show";

        isSnackbarVisible = true;

        setTimeout(() => {
            sb.className = sb.className.replace("show", "");
            isSnackbarVisible = false;

            // Display the next message after a short delay
            setTimeout(() => {
                displayNextMessage();
            }, 200);
        }, 3000);
    }
}

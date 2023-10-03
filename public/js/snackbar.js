"use strict";

function showSnackBar(message, time = 3000) {
    const sb = document.getElementById("snackbar");

    sb.textContent = message;

    //this is where the class name will be added & removed to activate the css
    sb.className = "show";

    setTimeout(() => { sb.className = sb.className.replace("show", ""); }, time);
}
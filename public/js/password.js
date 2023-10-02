"use strict";

const passwordInput = document.getElementById("passwordInput");
const passwordBtn = document.getElementById("passwordBtn");
const passwordHidden = document.getElementById("passwordHidden");
const passwordShown = document.getElementById("passwordShown");

passwordHidden.style.display = "block";
passwordShown.style.display = "none";

passwordBtn.addEventListener("click", () => {
    if (passwordInput.getAttribute("type") === "password") {
        passwordInput.setAttribute("type", "text");
        passwordHidden.style.display = "none";
        passwordShown.style.display = "block";
    } else {
        passwordInput.setAttribute("type", "password");
        passwordHidden.style.display = "block";
        passwordShown.style.display = "none";
    }
});

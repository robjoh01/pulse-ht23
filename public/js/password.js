"use strict";

const passwordBtn = document.getElementById("passwordBtn");
const passwordHidden = document.getElementById("passwordHidden");
const passwordShown = document.getElementById("passwordShown");

const passwords = document.querySelectorAll(".form-password-input[type='password']");

passwords.forEach(x => {
    x.setAttribute("minlength", "8");
});

passwordHidden.style.display = "block";
passwordShown.style.display = "none";

passwordBtn.addEventListener("click", () => {
    if (passwordShown.style.display === "none") {
        passwords.forEach(x => x.setAttribute("type", "text"));
        passwordHidden.style.display = "none";
        passwordShown.style.display = "block";
    } else {
        passwords.forEach(x => x.setAttribute("type", "password"));
        passwordHidden.style.display = "block";
        passwordShown.style.display = "none";
    }
});

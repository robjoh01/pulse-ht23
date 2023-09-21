"use strict";

// function updateTheme(matches) {
//     const link = document.getElementById("window-style");
//     const type = matches ? "dark" : "light";
//     link.setAttribute("href", `/styles/style-${type}.css`);
// }

// const mql = window.matchMedia("(prefers-color-scheme: dark)");

// mql.addEventListener("change", e => {
//     updateTheme(e.matches);
// });

// updateTheme(mql.matches);

// mdc.ripple.MDCRipple.attachTo(document.querySelector<HTMLElement>('.foo-button'));

// const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';

// const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
//     return new MDCRipple(el);
// });

// const togglePassword = document.querySelector("#togglePassword");
// const password = document.querySelector("#password");

// togglePassword.addEventListener("click", function () {
//     // toggle the type attribute
//     const type = password.getAttribute("type") === "password" ? "text" : "password";
//     password.setAttribute("type", type);
    
//     // toggle the icon
//     this.classList.toggle("bi-eye");
// });

// // prevent form submit
// const form = document.querySelector("form");
// form.addEventListener('submit', function (e) {
//     e.preventDefault();
// });

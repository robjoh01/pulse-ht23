"use strict";

let matchMedia = window.matchMedia?.("(prefers-color-scheme: dark)");
let overrideColorTheme = localStorage.getItem("color-theme");

if (overrideColorTheme) {
    document.body.className = overrideColorTheme;
} else {
    document.body.className = matchMedia.matches ? "light" : "dark";
}

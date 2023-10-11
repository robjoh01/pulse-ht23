"use strict";

const matchMedia = window.matchMedia?.("(prefers-color-scheme: dark)");
const overrideColorTheme = localStorage.getItem("color-theme");

if (overrideColorTheme) {
    document.body.className = overrideColorTheme;
} else {
    document.body.className = matchMedia.matches ? "light" : "dark";
}

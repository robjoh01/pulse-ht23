"use strict";

const themeBtn = document.getElementById("themeBtn");

/* eslint-disable no-undef */
if (overrideColorTheme) {
    themeBtn.className = (overrideColorTheme === "dark") ? "light" : "dark";
} else {
    themeBtn.className = matchMedia.matches ? "light" : "dark";
}

matchMedia.addEventListener("change", e => {
    if (overrideColorTheme) {
        return;
    }

    themeBtn.className = e.matches ? "light" : "dark";
});
/* eslint-enable no-undef */

themeBtn.addEventListener("click", () => {
    if (themeBtn.classList.contains("dark")) {
        themeBtn.classList.remove("dark");
        themeBtn.classList.add("light");

        // Dark theme
        document.body.classList.add("dark");
        document.body.classList.remove("light");

        localStorage.setItem("color-theme", "dark");
    } else if (themeBtn.classList.contains("light")) {
        themeBtn.classList.remove("light");
        themeBtn.classList.add("dark");

        // Light light
        document.body.classList.add("light");
        document.body.classList.remove("dark");

        localStorage.setItem("color-theme", "light");
    }
});

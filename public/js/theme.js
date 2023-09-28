"use strict";

const themeToggleBtn = document.getElementById("themeBtn");

const matchMedia = window.matchMedia?.("(prefers-color-scheme: dark)");
themeToggleBtn.className = matchMedia.matches ? "light" : "dark";

const overrideColorTheme = localStorage.getItem("color-theme");

if (overrideColorTheme) {
    document.body.className = overrideColorTheme;
    themeToggleBtn.className = (overrideColorTheme === "dark") ? "light" : "dark";
}

matchMedia.addEventListener("change", e => {
    if (overrideColorTheme) {
        return;
    }

    themeToggleBtn.className = e.matches ? "light" : "dark";
});

themeToggleBtn.addEventListener("click", () => {
    if (themeToggleBtn.classList.contains("dark")) {
        themeToggleBtn.classList.remove("dark");
        themeToggleBtn.classList.add("light");

        // Dark theme
        document.body.classList.add("dark");
        document.body.classList.remove("light");

        localStorage.setItem("color-theme", "dark");
    } else if (themeToggleBtn.classList.contains("light")) {
        themeToggleBtn.classList.remove("light");
        themeToggleBtn.classList.add("dark");

        // Light light
        document.body.classList.add("light");
        document.body.classList.remove("dark");

        localStorage.setItem("color-theme", "light");
    }
});
"use strict";

const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeToggleBtnIcon = document.getElementById("themeToggleBtnIcon");

const matchMedia = window.matchMedia?.("(prefers-color-scheme: dark)");
themeToggleBtnIcon.className = matchMedia.matches ? "bi-brightness-high-fill" : "bi-moon-stars-fill";

const overrideColorTheme = localStorage.getItem("color-theme");

if (overrideColorTheme) {
    document.body.className = overrideColorTheme;
    themeToggleBtnIcon.className = (overrideColorTheme === "dark") ? "bi-brightness-high-fill" : "bi-moon-stars-fill";
}

matchMedia.addEventListener("change", e => {
    if (overrideColorTheme) {
        return;
    }

    themeToggleBtnIcon.className = e.matches ? "bi-brightness-high-fill" : "bi-moon-stars-fill";
});

themeToggleBtn.addEventListener("click", () => {
    if (themeToggleBtnIcon.classList.contains("bi-moon-stars-fill")) {
        themeToggleBtnIcon.classList.remove("bi-moon-stars-fill");
        themeToggleBtnIcon.classList.add("bi-brightness-high-fill");

        // Dark theme
        document.body.classList.add("dark");
        document.body.classList.remove("light");

        localStorage.setItem("color-theme", "dark");
    } else if (themeToggleBtnIcon.classList.contains("bi-brightness-high-fill")) {
        themeToggleBtnIcon.classList.remove("bi-brightness-high-fill");
        themeToggleBtnIcon.classList.add("bi-moon-stars-fill");

        // Light light
        document.body.classList.add("light");
        document.body.classList.remove("dark");

        localStorage.setItem("color-theme", "light");
    }
});
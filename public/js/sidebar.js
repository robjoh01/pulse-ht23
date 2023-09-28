"use strict";

const sidebarBtn = document.getElementById("sidebarBtn");
const sidebar = document.getElementById("sidebar");

if (localStorage.getItem("sidebar")) {
    const isActive = localStorage.getItem("sidebar");

    if (isActive === "true") {
        sidebar.classList.add("active");
    } else {
        sidebar.classList.remove("active");
    }
}

sidebarBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("active")) {
        sidebar.classList.remove("transitioning");
        sidebar.classList.remove("active");
        localStorage.setItem("sidebar", false);
    } else {
        sidebar.classList.add("transitioning");
    }
});

sidebar.addEventListener("transitionend", () => {
    if (!sidebar.classList.contains("transitioning")) {
        return;
    }

    sidebar.classList.add("active");
    localStorage.setItem("sidebar", true);
});

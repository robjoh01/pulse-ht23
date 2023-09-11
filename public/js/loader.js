"use strict";

function updateTheme(matches) {
    const link = document.getElementById("window-style");
    const type = matches ? "dark" : "light";
    link.setAttribute("href", `/styles/style-${type}.css`);
}

const mql = window.matchMedia("(prefers-color-scheme: dark)");

mql.addEventListener("change", e => {
    updateTheme(e.matches);
});

updateTheme(mql.matches);

// mdc.ripple.MDCRipple.attachTo(document.querySelector<HTMLElement>('.foo-button'));

const selector = '.mdc-button, .mdc-icon-button, .mdc-card__primary-action';

const ripples = [].map.call(document.querySelectorAll(selector), function(el) {
    return new MDCRipple(el);
});
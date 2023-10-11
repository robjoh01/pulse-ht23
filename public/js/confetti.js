"use strict";

const circleProgressComponent = document.getElementById("circleProgressComponent");

const duration = 5 * 1000; // 5 seconds
const animationEnd = Date.now() + duration;
const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange (min, max) {
    return Math.random() * (max - min) + min;
}

document.addEventListener("DOMContentLoaded", function () {
    const value = Math.floor(circleProgressComponent.value);
    const hasdisplayedConfetti = localStorage.getItem("confetti") === "true" || false;

    if (hasdisplayedConfetti) {
        if (value < 100) {
            localStorage.setItem("confetti", false);
        }

        return;
    }

    if (value < 100) {
        return;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        /* eslint-disable no-undef */
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        /* eslint-enable no-undef */
    }, 250);

    localStorage.setItem("confetti", true);
});

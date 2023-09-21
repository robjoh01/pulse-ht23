"use strict";

const dateElements = document.querySelectorAll(".project-card_date");

dateElements.forEach((e) => {
    const dateTime = new Date(e.dataset.date);

    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const formattedDateTime = dateTime.toLocaleString('en-US', options);
    e.textContent = formattedDateTime;
});

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

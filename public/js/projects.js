"use strict";

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showSnackBar("Successfully Copied");
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

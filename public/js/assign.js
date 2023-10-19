"use strict";

const dropArea = document.getElementById("dropArea");
const dropForm = document.getElementById("dropForm");
const dropText = document.getElementById("dropText");
const dropInput = document.getElementById("dropInput");

const projectInput = document.getElementById("projectInput");

resetDropForm();

let fileText = null;

dropArea.addEventListener("dragover", (event) => {
    event.stopPropagation();
    event.preventDefault();

    // Style the drag-and-drop as a "copy file" operation.
    event.dataTransfer.dropEffect = "copy";
});

dropArea.addEventListener("drop", (event) => {
    event.stopPropagation();
    event.preventDefault();

    onFileSelected(event.dataTransfer.files[0]);
});

dropInput.addEventListener("change", (e) => {
    const files = e.target.files;

    if (files.length <= 0) {
        return;
    }

    onFileSelected(files[0]);
});

async function onFileSelected (file) {
    dropText.textContent = "File Selected";

    /* eslint-disable no-undef */
    Toastify({
        text: "File selected",
        className: "toastify-success",
        duration: 3000,
        gravity: "bottom",
        position: "center"
    }).showToast();
    /* eslint-enable no-undef */

    fileText = await file.text();
}

function resetDropForm () {
    dropForm.reset();
    dropText.textContent = "Choose a file or drag it here";
}

function displayToast (wasSuccessful, message) {
    return new Promise(resolve => {
        setTimeout(() => {
            /* eslint-disable no-undef */
            Toastify({
                text: message,
                className: wasSuccessful ? "toastify-success" : "toastify-failure",
                duration: wasSuccessful ? 8000 : 15000,
                close: !wasSuccessful,
                stopOnFocus: true,
                gravity: "bottom",
                position: "center"
            }).showToast();
            /* eslint-enable no-undef */

            resolve(); // Resolve the promise after displaying the toast
        }, 1500); // Delay of 1500 milliseconds (1.5 seconds)
    });
}

async function processStack (output) {
    while (output.stack.length > 0) {
        const obj = output.stack.pop(); // Pop the last message
        await displayToast(obj.wasSuccessful, obj.message);
    }
}

const uploadData = async (formData) => {
    /* eslint-disable no-undef */
    Toastify({
        text: "Processing data...",
        className: "toastify-success",
        duration: 3000,
        gravity: "bottom",
        position: "center"
    }).showToast();
    /* eslint-enable no-undef */

    try {
        const res = await fetch("/project/assign/upload", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        const json = await res.json();
        await processStack(json.output);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);

        /* eslint-disable no-undef */
        Toastify({
            text: "Error fetching data. Please try again.",
            className: "toastify-error",
            duration: 3000,
            gravity: "bottom",
            position: "center"
        }).showToast();
        /* eslint-enable no-undef */
    }
};

dropForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", fileText);
    formData.append("projectId", projectInput.value);

    await uploadData(formData);

    resetDropForm();
});

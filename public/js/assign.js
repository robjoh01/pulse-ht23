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
    showSnackBar("File selected");
    /* eslint-enable no-undef */

    fileText = await file.text();
}

function resetDropForm () {
    dropForm.reset();
    dropText.textContent = "Choose a file or drag it here";
}

dropForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", fileText);
    formData.append("projectId", projectInput.value);

    const res = await fetch("/project/assign/upload", {
        method: "POST",
        body: formData
    });

    if (!res) {
        return;
    }

    /* eslint-disable no-undef */
    showSnackBar("Processing the data");
    /* eslint-enable no-undef */

    const json = await res.json();

    if (json.wasUploaded) {
        /* eslint-disable no-undef */
        showSnackBar("Data was uploaded");
        /* eslint-enable no-undef */

        resetDropForm();
    }
});

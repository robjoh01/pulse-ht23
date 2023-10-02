"use strict";

const dropForm = document.getElementById("dropForm");
const dropText = document.getElementById("dropText");
const dropInput = document.getElementById("dropInput");
const projectInput = document.getElementById("projectInput");
const reportFreq = document.getElementById("reportFreq");
const reportDate = document.getElementById("reportDate");

const sendFile = async() => {
    const file = dropInput.files[0];
    const formData = new FormData();

    formData.append(file.name, file);
    formData.append("projectId", projectInput.value);
    formData.append("reportFreq", reportFreq.value);
    formData.append("reportDate", reportDate.value);

    const res = await fetch("/project/assign/upload", {
        method: "POST",
        body: formData
    });

    // TODO: Use toastify-js instead!

    const json = await res.json();

    dropText.textContent = "Team members were successfully uploaded to the database.";

    console.log(json);
};

dropForm.addEventListener("submit", (e) => {
    e.preventDefault();

    sendFile();

    dropText.textContent = "Uploading...";
});

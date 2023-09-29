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

    const json = await res.json();

    console.log(json);
};

dropForm.addEventListener("submit", (e) => {
    e.preventDefault();

    sendFile();
});

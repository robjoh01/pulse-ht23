"use strict";

import util from "./util.mjs";

const dropArea = document.getElementById("drag-drop-area");
const dropInput = document.getElementById("drag-drop-input");

dropInput.addEventListener("change", uploadCSV);

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();

    dropInput.files = e.dataTransfer.files;
});

function uploadCSV() {
    const file = dropInput.files[0];

    if (!file) {
        // TODO: Dialog popup (from Material Web Components)
        return;
    }

    const name = file.name ? file.name : 'NOT SUPPORTED';
    const type = file.type ? file.type : 'NOT SUPPORTED';
    const size = file.size ? file.size : 'NOT SUPPORTED'; // bytes

    if (size && size > util.megabytesToBytes(100)) {
        // TODO: Dialog popup (from Material Web Components)
        return;
    }

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function() {
        const data = Papa.parse(reader.result);

        console.log(data);
    };

    // reader.addEventListener("load", () => {
    //     // this will then display a text file
    //     content.innerText = reader.result;
    // }, false);

}

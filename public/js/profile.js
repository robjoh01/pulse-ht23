"use strict";

const profileImageForm = document.getElementById("profileImageForm");
const profileImageInput = document.getElementById("profileImageInput");
const profileImagePreview = document.getElementById("profileImagePreview");

const defaultImageSrc = profileImagePreview.getAttribute("srcset");

profileImageInput.addEventListener("change", (e) => {
    const file = profileImageInput.files[0];

    if (file) {
        const fileReader = new FileReader();

        fileReader.onload = event => {
            /* eslint-disable no-undef */
            Toastify({
                text: "Image selected",
                className: "toastify-success",
                duration: 3000,
                gravity: "bottom",
                position: "center"
            }).showToast();
            /* eslint-enable no-undef */

            profileImagePreview.setAttribute("srcset", event.target.result);
        };

        fileReader.readAsDataURL(file);
    }
});

profileImageForm.addEventListener("reset", () => {
    profileImagePreview.setAttribute("srcset", defaultImageSrc);

    /* eslint-disable no-undef */
    Toastify({
        text: "Image was defaulted",
        className: "toastify-success",
        duration: 3000,
        gravity: "bottom",
        position: "center"
    }).showToast();
    /* eslint-enable no-undef */
});

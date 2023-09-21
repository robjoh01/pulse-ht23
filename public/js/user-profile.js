"use strict";

const profileImg = document.getElementById("profileImg");
const profileImgFile = document.getElementById("profileImgFile");
const profileImgSubmit = document.getElementById("profileImgSubmit");
const profileImgReset = document.getElementById("profileImgReset");

localStorage.setItem("profileImgURL", profileImg.src);

profileImgReset.addEventListener("click", () => {
    profileImg.setAttribute("src", localStorage.getItem("profileImgURL"));
});

profileImgFile.addEventListener("change", () => {
    const file = profileImgFile.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        localStorage.setItem("profileImgURL", profileImg.src);
        profileImg.setAttribute("src", reader.result);
    }

    if (!file) {
        profileImg.setAttribute("src", localStorage.getItem("profileImgURL"));
        return;
    }

    reader.readAsDataURL(file);
});

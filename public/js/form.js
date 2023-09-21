const password = document.getElementById("password");
const passwordToggle = document.getElementById("passwordToggle");
const passwordIcon = document.getElementById("passwordIcon");

passwordToggle.addEventListener("click", () => {
    if (passwordIcon.classList.contains("bi-eye-slash-fill")) {
        passwordIcon.classList.remove("bi-eye-slash-fill");
        passwordIcon.classList.add("bi-eye-fill");
        password.type = "text";
    } else if (passwordIcon.classList.contains("bi-eye-fill")) {
        passwordIcon.classList.add("bi-eye-slash-fill");
        passwordIcon.classList.remove("bi-eye-fill");
        password.type = "password";
    }
});
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const passwordToggle = document.querySelector("#toggle-password");
const passwordIcon = passwordToggle.querySelector(".material-symbols-outlined");
const emailPattern = /^[a-z0-9._-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;
const allowedDomains = [
    "@students.undip.ac.id",
    "@lectures.undip.ac.id",
    "@staff.undip.ac.id",
    "@officer.undip.ac.id",
    "@admin.undip.ac.id"
];

passwordToggle.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.textContent = "visibility_off";
        passwordToggle.setAttribute("aria-label", "Sembunyikan password");
    } else {
        passwordInput.type = "password";
        passwordIcon.textContent = "visibility";
        passwordToggle.setAttribute("aria-label", "Tampilkan password");
    }
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    emailError.textContent = "";
    passwordError.textContent = "";
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    if (email === "") {
        emailError.textContent = "Email wajib diisi.";
        emailInput.focus();
        return;
    } 
    if (!emailPattern.test(email)) {
        emailError.textContent = "Format email tidak valid.";
        emailInput.focus();
        return;
    }

    const isOfficialEmail = allowedDomains.some(function (domain) {
        return email.endsWith(domain);
    });

    if (!isOfficialEmail) {
        emailError.textContent = "Gunakan email resmi UNDIP.";
        emailInput.focus();
        return;
    }

    if (password === "") {
        passwordError.textContent = "Password wajib diisi.";
        passwordInput.focus();
        return;
    }

    console.log("Form login valid.");
    console.log("Email:", email);
});
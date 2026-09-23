const registerForm = document.querySelector("#register-form");

const nameInput = document.querySelector("#name");
const identityInput = document.querySelector("#identity_number");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const confirmationInput = document.querySelector("#password_confirmation");

const nameError = document.querySelector("#name-error");
const identityError = document.querySelector("#identity-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const confirmationError = document.querySelector("#confirmation-error");

const togglePassword = document.querySelector("#toggle-password");
const toggleConfirmation = document.querySelector("#toggle-confirmation");

const passwordIcon = togglePassword.querySelector(".material-symbols-outlined");
const confirmationIcon = toggleConfirmation.querySelector(
  ".material-symbols-outlined",
);

const requirementLength = document.querySelector("#requirement-length");
const requirementLowercase = document.querySelector("#requirement-lowercase");
const requirementUppercase = document.querySelector("#requirement-uppercase");
const requirementNumber = document.querySelector("#requirement-number");
const requirementSpecial = document.querySelector("#requirement-special");

const emailPattern = /^[a-z0-9._-]+@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/;
const allowedDomains = [
  "@students.undip.ac.id",
  "@lectures.undip.ac.id",
  "@staff.undip.ac.id",
  "@admin.undip.ac.id",
];

function togglePasswordVisibility(input, icon, button) {
  if (input.type === "password") {
    input.type = "text";
    icon.textContent = "visibility_off";
    button.setAttribute("aria-label", "Sembunyikan password");
  } else {
    input.type = "password";
    icon.textContent = "visibility";
    button.setAttribute("aria-label", "Tampilkan password");
  }
}

togglePassword.addEventListener("click", function () {
  togglePasswordVisibility(passwordInput, passwordIcon, togglePassword);
});

toggleConfirmation.addEventListener("click", function () {
  togglePasswordVisibility(
    confirmationInput,
    confirmationIcon,
    toggleConfirmation,
  );
});

function updatePasswordRequirements() {
  const password = passwordInput.value;
  const hasLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&#_]/.test(password);

  requirementLength.classList.toggle("valid", hasLength);
  requirementLowercase.classList.toggle("valid", hasLowercase);
  requirementUppercase.classList.toggle("valid", hasUppercase);
  requirementNumber.classList.toggle("valid", hasNumber);
  requirementSpecial.classList.toggle("valid", hasSpecial);
}

passwordInput.addEventListener("input", function () {
  updatePasswordRequirements();
});

registerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  nameError.textContent = "";
  identityError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmationError.textContent = "";

  const name = nameInput.value.trim();
  const identityNumber = identityInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const confirmation = confirmationInput.value;
  if (name === "") {
    nameError.textContent = "Nama lengkap wajib diisi";
    nameInput.focus();
    return;
  }

  if (identityNumber === "") {
    identityError.textContent = "NIM/NIP wajib diisi";
    identityInput.focus();
    return;
  }

  if (email === "") {
    emailError.textContent = "Email wajib diisi";
    emailInput.focus();
    return;
  }

  if (!emailPattern.test(email)) {
    emailError.textContent = "Format email tidak valid";
    emailInput.focus();
    return;
  }

  const isAllowedDomain = allowedDomains.some(function (domain) {
    return email.endsWith(domain);
  });

  if (!isAllowedDomain) {
    emailError.textContent = "Gunakan email resmi UNDIP untuk pengguna";
    emailInput.focus();
    return;
  }

  if (password === "") {
    passwordError.textContent = "Password wajib diisi";
    passwordInput.focus();
    return;
  }

  const hasLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&#_]/.test(password);
  if (!hasLength) {
    passwordError.textContent = "Password minimal 8 karakter";
    passwordInput.focus();
    return;
  }

  if (!hasLowercase) {
    passwordError.textContent = "Password harus mengandung huruf kecil";
    passwordInput.focus();
    return;
  }

  if (!hasUppercase) {
    passwordError.textContent = "Password harus mengandung huruf besar";
    passwordInput.focus();
    return;
  }

  if (!hasNumber) {
    passwordError.textContent = "Password harus mengandung angka";
    passwordInput.focus();
    return;
  }

  if (!hasSpecial) {
    passwordError.textContent = "Password harus mengandung karakter khusus";
    passwordInput.focus();
    return;
  }

  if (confirmation === "") {
    confirmationError.textContent = "Konfirmasi password wajib diisi";
    confirmationInput.focus();
    return;
  }

  if (password !== confirmation) {
    confirmationError.textContent = "Konfirmasi password tidak sama";
    confirmationInput.focus();
    return;
  }

  console.log("Form registrasi valid");
  console.log("Nama:", name);
  console.log("NIM/NIP:", identityNumber);
  console.log("Email:", email);
});

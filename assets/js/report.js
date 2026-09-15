const reportForm = document.querySelector("#report-form");
const cameraInput = document.querySelector("#camera-input");
const galleryInput = document.querySelector("#gallery-input");
const takePhotoButton = document.querySelector("#take-photo-button");
const choosePhotoButton = document.querySelector("#choose-photo-button");
const selectedPhoto = document.querySelector("#selected-photo");
const fileError = document.querySelector("#file-error");
const descriptionInput = document.querySelector("#description");

let selectedFile = null;
takePhotoButton.addEventListener("click", function () {
    cameraInput.click();
});

choosePhotoButton.addEventListener("click", function () {
    galleryInput.click();
});

function handlePhoto(file) {
    if (!file) {
        return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxFileSize = 5 * 1024 * 1024;
    if (!allowedTypes.includes(file.type)) {
        fileError.textContent = "Format foto harus JPG, PNG, atau WEBP.";
        selectedPhoto.textContent = "";
        selectedFile = null;
        return;
    }
    if (file.size > maxFileSize) {
        fileError.textContent = "Ukuran foto maksimal 5 MB.";
        selectedPhoto.textContent = "";
        selectedFile = null;
        return;
    }

    selectedFile = file;
    fileError.textContent = "";
    selectedPhoto.textContent = `Foto dipilih: ${file.name}`;
}

cameraInput.addEventListener("change", function () {
    handlePhoto(cameraInput.files[0]);
});

galleryInput.addEventListener("change", function () {
    handlePhoto(galleryInput.files[0]);
});

reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    if (description.length < 10) {
        alert("Deskripsi masalah harus dijelaskan dengan lebih detail.");
        return;
    }

    alert("Laporan berhasil dikirim.");
    window.location.href = "dashboard.html";
});
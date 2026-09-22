const reportForm = document.querySelector("#report-form");

const facilityInput = document.querySelector("#facility");
const categoryInput = document.querySelector("#category");
const locationInput = document.querySelector("#location-detail");
const descriptionInput = document.querySelector("#description");

const cameraInput = document.querySelector("#camera-input");
const galleryInput = document.querySelector("#gallery-input");
const takePhotoButton = document.querySelector("#take-photo-button");
const choosePhotoButton = document.querySelector("#choose-photo-button");
const selectedPhoto = document.querySelector("#selected-photo");
const fileError = document.querySelector("#file-error");

const successOverlay = document.querySelector("#report-success-overlay");
const successClose = document.querySelector("#report-success-close");
const successCloseButton = document.querySelector("#report-success-close-button");

const successFacility = document.querySelector("#success-report-facility");
const successCategory = document.querySelector("#success-report-category");
const successLocation = document.querySelector("#success-report-location");
const successDate = document.querySelector("#success-report-date");
const successDescription = document.querySelector("#success-report-description");
const successPhoto = document.querySelector("#success-report-photo");

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

function formatDate(date) {
    return new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function saveReport(report) {
    const reports = JSON.parse(localStorage.getItem("reports")) || [];

    reports.unshift(report);

    localStorage.setItem("reports", JSON.stringify(reports));
}

function showSuccessOverlay(report) {
    successFacility.textContent = report.facility;
    successCategory.textContent = report.category;
    successLocation.textContent = report.location;
    successDate.textContent = report.date;
    successDescription.textContent = report.description;
    successPhoto.textContent = report.photo;

    successOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeSuccessOverlay() {
    successOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const facility = facilityInput.options[facilityInput.selectedIndex].text;
    const category = categoryInput.options[categoryInput.selectedIndex].text;
    const location = locationInput.value.trim();
    const description = descriptionInput.value.trim();

    if (description.length < 10) {
        alert("Deskripsi masalah harus dijelaskan dengan lebih detail.");
        return;
    }

    const report = {
        id: Date.now(),
        facility: facility,
        category: category,
        location: location,
        date: formatDate(new Date()),
        status: "Baru",
        statusClass: "new",
        description: description,
        photo: selectedFile ? selectedFile.name : "Tidak ada foto",
        note: "Laporan telah diterima dan menunggu pemeriksaan petugas."
    };

    saveReport(report);
    showSuccessOverlay(report);
});

successClose.addEventListener("click", closeSuccessOverlay);

successCloseButton.addEventListener("click", closeSuccessOverlay);

successOverlay.addEventListener("click", function (event) {
    if (event.target === successOverlay) {
        closeSuccessOverlay();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeSuccessOverlay();
    }
});
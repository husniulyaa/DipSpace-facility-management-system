const reservationForm = document.querySelector("#reservation-form");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const startTimeInput = document.querySelector("#start-time");
const endTimeInput = document.querySelector("#end-time");
const purposeInput = document.querySelector("#purpose");
const supportingFileInput = document.querySelector("#supporting-file");
const fileError = document.querySelector("#file-error");
const today = new Date().toISOString().split("T")[0];

startDateInput.min = today;
endDateInput.min = today;
startDateInput.addEventListener("change", function () {
    endDateInput.min = startDateInput.value;
    if (endDateInput.value && endDateInput.value < startDateInput.value) {
        endDateInput.value = startDateInput.value;
    }
});

reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    const purpose = purposeInput.value.trim();
    const supportingFile = supportingFileInput.files[0];
    if (endDate < startDate) {
        alert("Tanggal selesai tidak boleh lebih awal dari tanggal mulai.");
        return;
    }
    if (startDate === endDate && endTime <= startTime) {
        alert("Jam selesai harus lebih dari jam mulai.");
        return;
    }
    if (purpose.length < 5) {
        alert("Keperluan harus diisi dengan jelas.");
        return;
    }
    alert("Pengajuan reservasi berhasil dikirim.");
    window.location.href = "dashboard.html";
});
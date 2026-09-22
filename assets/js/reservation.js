const reservationForm = document.querySelector("#reservation-form");

const facilityInput = document.querySelector("#facility");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const startTimeInput = document.querySelector("#start-time");
const endTimeInput = document.querySelector("#end-time");
const purposeInput = document.querySelector("#purpose");
const supportingFileInput = document.querySelector("#supporting-file");
const fileError = document.querySelector("#file-error");

const successOverlay = document.querySelector("#reservation-success-overlay");
const successClose = document.querySelector("#reservation-success-close");
const successCloseButton = document.querySelector("#reservation-success-close-button");

const successFacility = document.querySelector("#success-reservation-facility");
const successDate = document.querySelector("#success-reservation-date");
const successTime = document.querySelector("#success-reservation-time");
const successPurpose = document.querySelector("#success-reservation-purpose");
const successFile = document.querySelector("#success-reservation-file");

const today = new Date().toISOString().split("T")[0];

startDateInput.min = today;
endDateInput.min = today;

startDateInput.addEventListener("change", function () {
    endDateInput.min = startDateInput.value;

    if (endDateInput.value && endDateInput.value < startDateInput.value) {
        endDateInput.value = startDateInput.value;
    }
});

function formatDate(date) {
    return new Date(date + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function getFacilityName() {
    return facilityInput.options[facilityInput.selectedIndex].text;
}

function saveReservation(reservation) {
    const reservations = JSON.parse(localStorage.getItem("reservations")) || [];

    reservations.unshift(reservation);

    localStorage.setItem("reservations", JSON.stringify(reservations));
}

function showSuccessOverlay(reservation) {
    successFacility.textContent = reservation.facility;
    successDate.textContent = reservation.date;
    successTime.textContent = reservation.time;
    successPurpose.textContent = reservation.purpose;
    successFile.textContent = reservation.file;

    successOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeSuccessOverlay() {
    successOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const facility = getFacilityName();
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

    const reservation = {
        id: Date.now(),
        facility: facility,
        startDate: startDate,
        endDate: endDate,
        date: startDate === endDate
            ? formatDate(startDate)
            : formatDate(startDate) + " - " + formatDate(endDate),
        time: startTime + " - " + endTime,
        purpose: purpose,
        file: supportingFile ? supportingFile.name : "Tidak ada berkas",
        status: "Menunggu",
        statusClass: "pending",
        submitted: new Date().toISOString()
    };

    saveReservation(reservation);
    showSuccessOverlay(reservation);
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
const logoutButton = document.querySelector("#logout-button");
const reservationDetailOverlay = document.querySelector("#reservation-detail-overlay");
const reservationDetailClose = document.querySelector("#reservation-detail-close");
const reservationDetailCancel = document.querySelector("#reservation-detail-cancel");
const reservationCancelButton = document.querySelector("#reservation-cancel-button");

const detailFacility = document.querySelector("#detail-facility");
const detailFacilityName = document.querySelector("#detail-facility-name");
const detailDate = document.querySelector("#detail-date");
const detailTime = document.querySelector("#detail-time");
const detailPurpose = document.querySelector("#detail-purpose");
const detailStatus = document.querySelector("#detail-status");
const detailFile = document.querySelector("#detail-file");
const detailSubmitted = document.querySelector("#detail-submitted");
const detailCancellationDeadline = document.querySelector("#detail-cancellation-deadline");

const reservationDetailButtons = document.querySelectorAll(".reservation-detail-button");
let selectedReservationButton = null;
logoutButton.addEventListener("click", function () {
    window.location.href = "index.html";
});

function openReservationDetail(button) {
    selectedReservationButton = button;

    const facility = button.dataset.facility;
    const date = button.dataset.date;
    const time = button.dataset.time;
    const purpose = button.dataset.purpose;
    const status = button.dataset.status;
    const statusClass = button.dataset.statusClass;
    const file = button.dataset.file;
    const submitted = button.dataset.submitted;
    const cancellationDeadline = button.dataset.cancellationDeadline;

    detailFacility.textContent = facility;
    detailFacilityName.textContent = facility;
    detailDate.textContent = date;
    detailTime.textContent = time;
    detailPurpose.textContent = purpose;
    detailStatus.textContent = status;
    detailFile.textContent = file;
    detailSubmitted.textContent = submitted;
    detailCancellationDeadline.textContent = formatDateTime(cancellationDeadline);

    detailStatus.className = "dashboard-status";
    if (statusClass === "pending") {
        detailStatus.classList.add("pending");
    }
    if (statusClass === "approved") {
        detailStatus.classList.add("approved");
    }
    if (statusClass === "rejected") {
        detailStatus.classList.add("rejected");
    }
    if (statusClass === "cancelled") {
        detailStatus.classList.add("cancelled");
    }

    updateCancellationButton(statusClass, cancellationDeadline);
    reservationDetailOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function updateCancellationButton(statusClass, cancellationDeadline) {
    const allowedStatuses = ["pending", "approved"];
    if (!allowedStatuses.includes(statusClass)) {
        reservationCancelButton.style.display = "none";
        return;
    }

    const deadline = new Date(cancellationDeadline);
    const now = new Date();
    if (now <= deadline) {
        reservationCancelButton.style.display = "inline-flex";
    } else {
        reservationCancelButton.style.display = "none";
    }
}

function cancelReservation() {
    if (!selectedReservationButton) {
        return;
    }

    const confirmed = confirm(
        "Apakah kamu yakin ingin membatalkan reservasi ini?"
    );
    if (!confirmed) {
        return;
    }

    selectedReservationButton.dataset.status = "Dibatalkan";
    selectedReservationButton.dataset.statusClass = "cancelled";

    const row = selectedReservationButton.closest("tr");
    const statusElement = row.querySelector(".dashboard-status");

    statusElement.textContent = "Dibatalkan";
    statusElement.className = "dashboard-status cancelled";

    detailStatus.textContent = "Dibatalkan";
    detailStatus.className = "dashboard-status cancelled";

    reservationCancelButton.style.display = "none";
    alert("Reservasi berhasil dibatalkan.");
}

function closeReservationDetail() {
    reservationDetailOverlay.classList.remove("active");
    document.body.style.overflow = "";
    selectedReservationButton = null;
}

function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }) + ", " + date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}

reservationDetailButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        openReservationDetail(button);
    });
});

reservationCancelButton.addEventListener("click", cancelReservation);
reservationDetailClose.addEventListener("click", closeReservationDetail);
reservationDetailCancel.addEventListener("click", closeReservationDetail);

reservationDetailOverlay.addEventListener("click", function (event) {
    if (event.target === reservationDetailOverlay) {
        closeReservationDetail();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeReservationDetail();
        closeReportDetail();
    }
});

const reportDetailOverlay = document.querySelector("#report-detail-overlay");
const reportDetailClose = document.querySelector("#report-detail-close");
const reportDetailCancel = document.querySelector("#report-detail-cancel");

const reportDetailFacility = document.querySelector("#report-detail-facility");
const reportDetailFacilityName = document.querySelector("#report-detail-facility-name");
const reportDetailCategory = document.querySelector("#report-detail-category");
const reportDetailLocation = document.querySelector("#report-detail-location");
const reportDetailDate = document.querySelector("#report-detail-date");
const reportDetailStatus = document.querySelector("#report-detail-status");
const reportDetailDescription = document.querySelector("#report-detail-description");
const reportDetailPhoto = document.querySelector("#report-detail-photo");
const reportDetailNote = document.querySelector("#report-detail-note");

const reportDetailButtons = document.querySelectorAll(".report-detail-button");

function openReportDetail(button) {
    const facility = button.dataset.facility;
    const category = button.dataset.category;
    const location = button.dataset.location;
    const date = button.dataset.date;
    const status = button.dataset.status;
    const statusClass = button.dataset.statusClass;
    const description = button.dataset.description;
    const photo = button.dataset.photo;
    const note = button.dataset.note;

    reportDetailFacility.textContent = facility;
    reportDetailFacilityName.textContent = facility;
    reportDetailCategory.textContent = category;
    reportDetailLocation.textContent = location;
    reportDetailDate.textContent = date;
    reportDetailStatus.textContent = status;
    reportDetailDescription.textContent = description;
    reportDetailPhoto.textContent = photo;
    reportDetailNote.textContent = note;

    reportDetailStatus.className = "report-status " + statusClass;

    reportDetailOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeReportDetail() {
    reportDetailOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

reportDetailButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        openReportDetail(button);
    });
});

reportDetailClose.addEventListener("click", closeReportDetail);
reportDetailCancel.addEventListener("click", closeReportDetail);

reportDetailOverlay.addEventListener("click", function (event) {
    if (event.target === reportDetailOverlay) {
        closeReportDetail();
    }
});
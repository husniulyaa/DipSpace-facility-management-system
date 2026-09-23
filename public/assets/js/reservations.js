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

    detailStatus.className = "status-" + statusClass;

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
    const statusElement = row.querySelector(".reservation-status");

    statusElement.textContent = "Dibatalkan";
    statusElement.className = "reservation-status reservation-status-cancelled";

    detailStatus.textContent = "Dibatalkan";
    detailStatus.className = "status-cancelled";

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
    }
});
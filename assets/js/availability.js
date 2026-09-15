const availabilityOverlay = document.querySelector("#availability-overlay");
const availabilityClose = document.querySelector("#availability-close");
const availabilityCancel = document.querySelector("#availability-cancel");
const availabilityDate = document.querySelector("#availability-date");
const availabilityReserve = document.querySelector("#availability-reserve");
const availabilityFacilityName = document.querySelector("#availability-facility-name");

function openAvailability(facilityName) {
    availabilityFacilityName.textContent = facilityName;

    availabilityOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeAvailability() {
    availabilityOverlay.classList.remove("active");
    document.body.style.overflow = "";
}

availabilityClose.addEventListener("click", closeAvailability);
availabilityCancel.addEventListener("click", closeAvailability);
availabilityOverlay.addEventListener("click", function (event) {
    if (event.target === availabilityOverlay) {
        closeAvailability();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeAvailability();
    }
});

availabilityReserve.addEventListener("click", function () {
    console.log("Ajukan reservasi");
});
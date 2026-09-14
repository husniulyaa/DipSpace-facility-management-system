const searchInput = document.querySelector(".search-box-input input");
const searchButton = document.querySelector(".search-button");
const typeFilter = document.getElementById("facility-type");
const locationFilter = document.getElementById("facility-location");
const capacityFilter = document.getElementById("facility-capacity");
const applyFilterButton = document.querySelector(".filter-submit");
const facilityCards = document.querySelectorAll(".facility-card");

function filterFacilities() {
    const searchKeyword = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value.toLowerCase();
    const selectedLocation = locationFilter.value.toLowerCase();
    const selectedCapacity = capacityFilter.value;

    facilityCards.forEach((card) => {
        const name = card.dataset.name.toLowerCase();
        const type = card.dataset.type.toLowerCase();
        const location = card.dataset.location.toLowerCase();
        const capacity = card.dataset.capacity;

        const matchesSearch =
            searchKeyword === "" || name.includes(searchKeyword);
        const matchesType =
            selectedType === "" || type === selectedType;
        const matchesLocation =
            selectedLocation === "" || location === selectedLocation;
        const matchesCapacity =
            selectedCapacity === "" || capacity === selectedCapacity;
        const shouldShow = matchesSearch && matchesType && matchesLocation && matchesCapacity;
        card.style.display = shouldShow ? "" : "none";
    });
}

searchButton.addEventListener("click", () => {
    filterFacilities();
});

applyFilterButton.addEventListener("click", () => {
    filterFacilities();
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        filterFacilities();
    }
});
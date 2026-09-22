const searchForm = document.querySelector("#facility-filter");
const searchInput = document.querySelector("#facility-search");
const typeFilter = document.querySelector("#facility-type");
const locationFilter = document.querySelector("#facility-location");
const capacityFilter = document.querySelector("#facility-capacity");
const facilityCards = document.querySelectorAll(".facility-card");

function filterFacilities() {
  const searchKeyword = searchInput.value.trim().toLowerCase();
  const selectedType = typeFilter.value.toLowerCase();
  const selectedLocation = locationFilter.value.toLowerCase();
  const selectedCapacity = capacityFilter.value;

  facilityCards.forEach((card) => {
    const name = (card.dataset.name || "").toLowerCase();
    const type = (card.dataset.type || "").toLowerCase();
    const location = (card.dataset.location || "").toLowerCase();
    const capacity = Number(card.dataset.capacity || 0);

    const address = (
      card.querySelector(".facility-card-address")?.textContent || ""
    ).toLowerCase();

    const searchableText = `
            ${name}
            ${type}
            ${location}
            ${capacity}
            ${address}
        `.toLowerCase();

    const matchesSearch =
      searchKeyword === "" || searchableText.includes(searchKeyword);

    const matchesType = selectedType === "" || type === selectedType;

    const matchesLocation =
      selectedLocation === "" || location === selectedLocation;

    let matchesCapacity = true;

    if (selectedCapacity === "0-50") {
      matchesCapacity = capacity <= 50;
    }

    if (selectedCapacity === "51-100") {
      matchesCapacity = capacity >= 51 && capacity <= 100;
    }

    if (selectedCapacity === "101-300") {
      matchesCapacity = capacity >= 101 && capacity <= 300;
    }

    if (selectedCapacity === "301-800") {
      matchesCapacity = capacity >= 301 && capacity <= 800;
    }

    if (selectedCapacity === "801-2000") {
      matchesCapacity = capacity >= 801 && capacity <= 2000;
    }

    if (selectedCapacity === "2001+") {
      matchesCapacity = capacity >= 2001;
    }

    const shouldShow =
      matchesSearch && matchesType && matchesLocation && matchesCapacity;

    card.style.display = shouldShow ? "" : "none";
  });
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  filterFacilities();
});

searchInput.addEventListener("input", () => {
  filterFacilities();
});

typeFilter.addEventListener("change", () => {
  filterFacilities();
});

locationFilter.addEventListener("change", () => {
  filterFacilities();
});

capacityFilter.addEventListener("change", () => {
  filterFacilities();
});
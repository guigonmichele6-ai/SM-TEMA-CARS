const header = document.querySelector("[data-header]");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
const bookingForm = document.querySelector("#quick-booking");
const pickupDate = document.querySelector("#pickup-date");
const returnDate = document.querySelector("#return-date");
const vehicleType = document.querySelector("#vehicle-type");
const requestSummary = document.querySelector("#request-summary");
const copyAddressButton = document.querySelector("#copy-address");
const copyStatus = document.querySelector("#copy-status");
const address = "3189, Lot Wifak Erak T/461 RDC - Temara (M)";

const formatDateValue = (date) => date.toISOString().slice(0, 10);

const setTodayBounds = () => {
  if (!pickupDate || !returnDate) {
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  pickupDate.min = formatDateValue(today);
  returnDate.min = formatDateValue(tomorrow);

  if (!pickupDate.value) {
    pickupDate.value = formatDateValue(today);
  }

  if (!returnDate.value) {
    returnDate.value = formatDateValue(tomorrow);
  }
};

const updateHeader = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeNav = () => {
  if (!nav || !navToggle || !header) {
    return;
  }

  document.body.classList.remove("nav-open");
  nav.classList.remove("is-open");
  header.classList.remove("nav-active");
  navToggle.setAttribute("aria-expanded", "false");
};

const buildSummary = () => {
  if (!pickupDate || !returnDate || !vehicleType || !requestSummary) {
    return;
  }

  const start = new Date(`${pickupDate.value}T00:00:00`);
  const end = new Date(`${returnDate.value}T00:00:00`);
  const days = Math.max(1, Math.round((end - start) / 86400000));
  const plural = days > 1 ? "jours" : "jour";

  if (end <= start) {
    requestSummary.textContent =
      "La date de retour doit être après la date de départ pour préparer la demande.";
    return;
  }

  requestSummary.textContent = `Demande préparée : ${vehicleType.value}, départ le ${pickupDate.value}, retour le ${returnDate.value}, durée estimée ${days} ${plural}. Confirmation finale auprès de l'agence SM TEMA CARS.`;
};

setTodayBounds();
updateHeader();
document.querySelectorAll("#year").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

window.addEventListener("scroll", updateHeader, { passive: true });

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    header.classList.toggle("nav-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

if (pickupDate && returnDate) {
  pickupDate.addEventListener("change", () => {
    const nextDay = new Date(`${pickupDate.value}T00:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    returnDate.min = formatDateValue(nextDay);

    if (!returnDate.value || new Date(`${returnDate.value}T00:00:00`) <= new Date(`${pickupDate.value}T00:00:00`)) {
      returnDate.value = formatDateValue(nextDay);
    }
  });
}

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    buildSummary();
    document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

document.querySelectorAll(".segment").forEach((segment) => {
  segment.addEventListener("click", () => {
    const filter = segment.dataset.filter;

    document.querySelectorAll(".segment").forEach((button) => {
      button.classList.toggle("active", button === segment);
    });

    document.querySelectorAll(".fleet-card").forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

document.querySelectorAll(".choose-car").forEach((button) => {
  button.addEventListener("click", () => {
    vehicleType.value = button.dataset.choice;
    buildSummary();
    document.querySelector("#reservation").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (copyAddressButton && copyStatus) {
  copyAddressButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address);
      copyStatus.textContent = "Adresse copiée.";
    } catch {
      copyStatus.textContent = address;
    }
  });
}

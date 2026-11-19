(() => {
  "use strict";

  // ==============================
  // NORTWAY CONFIGURATION
  // Replace these placeholders.
  // ==============================
  const CONFIG = {
    whatsappNumber: "5511999999999", // country code + area code + number, digits only
    instagramUrl: "https://instagram.com/",
    email: "hello@nortway.studio"
  };

  document.documentElement.style.scrollBehavior = "smooth";
  document.getElementById("year").textContent = new Date().getFullYear();

  // Cursor
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(pointer:fine)").matches) {
    cursor.style.display = "block";
    window.addEventListener("mousemove", e => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    }, {passive:true});
  }

  // Header
  const header = document.querySelector(".site-header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, {passive:true});
  onScroll();

  // Mobile navigation
  const menuBtn = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const toggleMenu = () => {
    const open = mobileMenu.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn?.addEventListener("click", toggleMenu);
  mobileMenu?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) toggleMenu();
  }));

  // Reveal animations
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:.08});
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Project modal
  const projectData = {
    digital: {
      kicker:"01 — DIGITAL EXPERIENCE",
      title:"Northline / Web Direction",
      visual:"WEB",
      description:"A conceptual digital experience focused on hierarchy, speed and a clear product narrative.",
      details:"Creative challenge: make a complex offer feel simple. Design approach: editorial typography, restrained UI and strong content hierarchy. Outcome: a flexible visual direction ready to translate into a responsive product experience."
    },
    identity: {
      kicker:"02 — VISUAL IDENTITY",
      title:"Monument / Brand System",
      visual:"N / W",
      description:"A monochromatic identity study built around contrast, structure and a memorable typographic mark.",
      details:"Creative challenge: create recognition without relying on visual noise. Design approach: modular typography, a strict grid and a compact identity system."
    },
    motion: {
      kicker:"03 — MOTION DIRECTION",
      title:"Frame / Motion Study",
      visual:"MOVE",
      description:"An experimental motion direction exploring rhythm, scale and typography as the main visual language.",
      details:"Creative challenge: make motion feel expressive without becoming decorative. Design approach: timing, repetition, cropping and kinetic typography."
    },
    campaign: {
      kicker:"04 — CREATIVE ADVERTISING",
      title:"Signal / Campaign Direction",
      visual:"MAKE NOISE.",
      description:"A campaign concept built around a simple principle: strong advertising can be bold without becoming unclear.",
      details:"Creative challenge: compete for attention while preserving message clarity. Design approach: high-contrast composition, concise copy and a flexible campaign system."
    }
  };

  const modal = document.getElementById("projectModal");
  const modalKicker = document.getElementById("modalKicker");
  const modalTitle = document.getElementById("modalTitle");
  const modalVisual = document.getElementById("modalVisual");
  const modalDescription = document.getElementById("modalDescription");
  const modalDetails = document.getElementById("modalDetails");

  document.querySelectorAll(".project").forEach(project => {
    project.addEventListener("click", () => {
      const data = projectData[project.dataset.project];
      if (!data) return;
      modalKicker.textContent = data.kicker;
      modalTitle.textContent = data.title;
      modalVisual.textContent = data.visual;
      modalDescription.textContent = data.description;
      modalDetails.textContent = data.details;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  };
  document.querySelector(".modal-close")?.addEventListener("click", closeModal);
  modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  // Project builder
  const form = document.getElementById("projectForm");
  const steps = [...document.querySelectorAll(".form-step")];
  const progressFill = document.querySelector(".progress-fill");
  const stepCurrent = document.getElementById("stepCurrent");
  const reviewBox = document.getElementById("reviewBox");
  let currentStep = 1;

  function fieldValue(name) {
    const checked = form.querySelector(`[name="${name}"]:checked`);
    return checked ? checked.value : (form.elements[name]?.value || "");
  }

  function validateStep(step) {
    const active = steps.find(s => Number(s.dataset.step) === step);
    if (!active) return false;
    const required = [...active.querySelectorAll("[required]")];
    let valid = true;
    required.forEach(field => {
      if ((field.type === "radio" && !form.querySelector(`[name="${field.name}"]:checked`)) || (field.type !== "radio" && !field.value.trim())) {
        valid = false;
      }
    });
    if (!valid) {
      active.animate([{transform:"translateX(0)"},{transform:"translateX(-7px)"},{transform:"translateX(7px)"},{transform:"translateX(0)"}], {duration:240});
    }
    return valid;
  }

  function renderStep(step) {
    steps.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === step));
    currentStep = step;
    stepCurrent.textContent = String(step).padStart(2,"0");
    progressFill.style.width = `${step * 25}%`;
    document.querySelector(".builder").scrollIntoView({behavior:"smooth", block:"start"});
    if (step === 4) renderReview();
  }

  function renderReview() {
    const rows = [
      ["Service", fieldValue("service")],
      ["Budget", fieldValue("budget")],
      ["Name", form.elements.name.value.trim()],
      ["Company", form.elements.company.value.trim()],
      ["Email", form.elements.email.value.trim()],
      ["Project", form.elements.description.value.trim()],
      ["Reference", form.elements.reference.value.trim() || "Not provided"]
    ];
    reviewBox.innerHTML = rows.map(([label,value]) =>
      `<div class="review-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
    ).join("");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[char]));
  }

  document.querySelectorAll(".form-next").forEach(btn => btn.addEventListener("click", () => {
    if (validateStep(currentStep) && currentStep < 4) renderStep(currentStep + 1);
  }));
  document.querySelectorAll(".form-back").forEach(btn => btn.addEventListener("click", () => {
    if (currentStep > 1) renderStep(currentStep - 1);
  }));

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateStep(4)) return;
    const text = [
      "NORTWAY — PROJECT INQUIRY",
      "",
      `Service: ${fieldValue("service")}`,
      `Budget: ${fieldValue("budget")}`,
      `Name: ${form.elements.name.value.trim()}`,
      `Company: ${form.elements.company.value.trim()}`,
      `Email: ${form.elements.email.value.trim()}`,
      `Project: ${form.elements.description.value.trim()}`,
      `Reference: ${form.elements.reference.value.trim() || "Not provided"}`
    ].join("\n");

    const number = CONFIG.whatsappNumber.replace(/\D/g, "");
    if (!number || number.length < 10) {
      alert("Please configure the WhatsApp number in script.js before using the project inquiry.");
      return;
    }
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  });

  // Configurable links
  document.querySelectorAll("[data-whatsapp]").forEach(link => {
    link.href = `https://wa.me/${CONFIG.whatsappNumber.replace(/\D/g, "")}`;
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.querySelectorAll("[data-instagram]").forEach(link => {
    link.href = CONFIG.instagramUrl;
    link.target = "_blank";
    link.rel = "noopener";
  });
  document.querySelectorAll("[data-email]").forEach(link => {
    link.href = `mailto:${CONFIG.email}`;
  });
})();

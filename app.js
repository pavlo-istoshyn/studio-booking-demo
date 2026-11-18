const SERVICES = {
  nails: [
    {
      id: "mani-gel",
      name: "Комбі-манікюр + гель-лак",
      price: 950,
      duration: 90,
      desc: "Зняття старого покриття, комбінований манікюр, вирівнювання базою та однотонне покриття."
    },
    {
      id: "mani-hard",
      name: "Укріплення твердим гелем",
      price: 1150,
      duration: 110,
      desc: "Вирівнювання та укріплення нігтьової пластини твердим гелем перед покриттям."
    },
    {
      id: "pedi-spa",
      name: "Смарт-педикюр + покриття",
      price: 1300,
      duration: 100,
      desc: "Обробка стопи смарт-дисками, догляд за кутикулою та покриття гель-лаком."
    }
  ],
  brows: [
    {
      id: "brow-arch",
      name: "Корекція та фарбування брів",
      price: 650,
      duration: 45,
      desc: "Підбір форми, корекція воском або пінцетом та фарбування фарбою або хною."
    },
    {
      id: "brow-lami",
      name: "Ламінування брів",
      price: 950,
      duration: 60,
      desc: "Довготривала укладка неслухняних волосків, фарбування, корекція та догляд."
    },
    {
      id: "lash-lami",
      name: "Ламінування вій + фарбування",
      price: 1100,
      duration: 70,
      desc: "Завиток, фіксація форми та фарбування натуральних вій без нарощування."
    }
  ],
  hair: [
    {
      id: "hair-cut",
      name: "Стрижка + укладка",
      price: 1200,
      duration: 75,
      desc: "Миття голови, стрижка з урахуванням форми обличчя та укладка по формі."
    },
    {
      id: "hair-airtouch",
      name: "Складне фарбування Airtouch",
      price: 4200,
      duration: 240,
      desc: "Техніка плавного переходу кольору з тонуванням і захисним доглядом."
    },
    {
      id: "hair-care",
      name: "Холодне відновлення волосся",
      price: 1650,
      duration: 90,
      desc: "Глибоке живлення та відновлення пошкодженого волосся ампульним доглядом."
    }
  ],
  face: [
    {
      id: "face-clean",
      name: "Комбінована чистка обличчя",
      price: 1450,
      duration: 90,
      desc: "Ультразвукова та мануальна чистка, заспокійлива маска та сонцезахисний крем."
    },
    {
      id: "face-peel",
      name: "Всесезонний пілінг PRX-T33",
      price: 1900,
      duration: 45,
      desc: "Оновлювальний пілінг без сильного лущення, підходить у будь-яку пору року."
    },
    {
      id: "face-massage",
      name: "Моделювальний масаж обличчя",
      price: 1150,
      duration: 60,
      desc: "Масаж обличчя та шиї для зменшення набряків і зняття м'язової напруги."
    }
  ]
};

const ALL_SERVICES = Object.values(SERVICES).flat();

// Стан форми запису
const bookingState = {
  serviceId: ALL_SERVICES[0].id,
  master: "Будь-який вільний майстер",
  day: "Сьогодні",
  time: "12:30",
  brandName: "AURA Studio",
  tgUsername: ""
};

// 1. Персоналізація через URL (?name=...&city=...&tg=...)
function applyUrlPersonalization() {
  const params = new URLSearchParams(window.location.search);
  const customName = params.get("name")?.trim();
  const customCity = params.get("city")?.trim();
  const customTg = params.get("tg")?.trim().replace(/^@/, "");

  if (customName) {
    bookingState.brandName = customName;
    document.title = `${customName}: онлайн-запис за 30 секунд`;
    document.getElementById("ribbonBrand").textContent = customName;
    document.getElementById("brandNameHeader").textContent = customName.toUpperCase();
    document.getElementById("brandNameHero").textContent = customName;
    document.getElementById("brandNameFooter").textContent = customName.toUpperCase();
    document.querySelectorAll(".brand-inline").forEach((el) => {
      el.textContent = customName;
    });
  }

  if (customCity) {
    document.getElementById("cityBadge").textContent = `${customCity} · Вільні віконця на сьогодні`;
  }

  if (customTg) {
    bookingState.tgUsername = customTg;
  }
}

// 2. Рендер карток послуг
function renderServices(category) {
  const grid = document.getElementById("servicesGrid");
  const items = SERVICES[category] || SERVICES.nails;

  grid.innerHTML = items
    .map(
      (item) => `
      <article class="service-card">
        <div>
          <div class="service-card__top">
            <h3>${item.name}</h3>
            <span class="service-card__price">${item.price} грн</span>
          </div>
          <p class="service-card__desc">${item.desc}</p>
        </div>
        <div class="service-card__foot">
          <span>~${item.duration} хв</span>
          <button type="button" class="btn btn--sm btn--outline pick-service-btn" data-id="${item.id}">
            Обрати
          </button>
        </div>
      </article>
    `
    )
    .join("");

  grid.querySelectorAll(".pick-service-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      selectServiceAndScroll(id);
    });
  });
}

// 3. Заповнення select в формі
function populateServiceSelect() {
  const select = document.getElementById("serviceSelect");
  select.innerHTML = ALL_SERVICES.map(
    (s) => `<option value="${s.id}">${s.name} · ${s.price} грн (~${s.duration} хв)</option>`
  ).join("");

  select.value = bookingState.serviceId;
  select.addEventListener("change", (e) => {
    bookingState.serviceId = e.target.value;
    updateSummary();
  });
}

function selectServiceAndScroll(id) {
  bookingState.serviceId = id;
  document.getElementById("serviceSelect").value = id;
  updateSummary();
  document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
}

function updateSummary() {
  const service = ALL_SERVICES.find((s) => s.id === bookingState.serviceId) || ALL_SERVICES[0];
  const discounted = Math.round(service.price * 0.85);
  document.getElementById("summaryPrice").textContent = `${discounted} грн`;
  document.getElementById("summaryOldPrice").textContent = `${service.price} грн`;
  document.getElementById("summaryDuration").textContent = `~${service.duration} хв`;
}

// 4. Перемикачі чипсів (майстер, день, час)
function setupChipGroup(containerId, attrName, stateKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      container.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      bookingState[stateKey] = chip.getAttribute(attrName);
    });
  });
}

// 5. Обробка форми запису
function setupBookingForm() {
  const form = document.getElementById("bookingForm");
  const successBox = document.getElementById("bookingSuccess");
  const previewBox = document.getElementById("tgAlertPreview");
  const tgBtn = document.getElementById("openTgDirectBtn");
  const resetBtn = document.getElementById("resetBookingBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const clientName = document.getElementById("clientName").value.trim() || "Анна";
    const clientPhone = document.getElementById("clientPhone").value.trim() || "+380 67 000 00 00";
    const service = ALL_SERVICES.find((s) => s.id === bookingState.serviceId) || ALL_SERVICES[0];
    const finalPrice = Math.round(service.price * 0.85);

    const tgMessageText =
      `🔔 НОВИЙ ЗАПИС | ${bookingState.brandName}\n\n` +
      `👩 Клієнт: ${clientName}\n` +
      `📞 Контакт: ${clientPhone}\n` +
      `💅 Послуга: ${service.name}\n` +
      `👩‍🎨 Майстер: ${bookingState.master}\n` +
      `📅 Коли: ${bookingState.day} о ${bookingState.time}\n` +
      `💳 Сума (-15%): ${finalPrice} грн`;

    previewBox.textContent = tgMessageText;

    const encodedMsg = encodeURIComponent(tgMessageText);
    if (bookingState.tgUsername) {
      tgBtn.href = `https://t.me/${bookingState.tgUsername}?text=${encodedMsg}`;
    } else {
      tgBtn.href = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedMsg}`;
    }

    form.hidden = true;
    successBox.hidden = false;
  });

  resetBtn.addEventListener("click", () => {
    successBox.hidden = true;
    form.hidden = false;
  });
}

// Ініціалізація
document.addEventListener("DOMContentLoaded", () => {
  applyUrlPersonalization();
  renderServices("nails");
  populateServiceSelect();
  updateSummary();

  // Таби категорій послуг
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      renderServices(tab.getAttribute("data-category"));
    });
  });

  setupChipGroup("masterChips", "data-master", "master");
  setupChipGroup("dayChips", "data-day", "day");
  setupChipGroup("timeChips", "data-time", "time");
  setupBookingForm();

  // Вибір майстра з карток команди
  document.querySelectorAll(".select-master-link").forEach((link) => {
    link.addEventListener("click", () => {
      const m = link.getAttribute("data-master");
      bookingState.master = m;
      const masterContainer = document.getElementById("masterChips");
      masterContainer.querySelectorAll(".chip").forEach((c) => {
        c.classList.toggle("is-selected", c.getAttribute("data-master") === m);
      });
    });
  });
});

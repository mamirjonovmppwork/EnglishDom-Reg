"use strict";

/* ============================================================
   1. Sozlamalar
   botToken config.js faylidan keladi (index.html da app.js dan OLDIN ulanadi)
   ============================================================ */
const CHAT_IDS = ["8797194118", "6649934046"]; // Xabar boradigan barcha chat ID'lar

/* ============================================================
   2. Tarjimalar lug'ati
   ============================================================ */
const translations = {
  uz: {
    title: "Matematika va ingliz tili <span>o'rganishni</span> xohlaysizmi?",
    desc: "Ismingiz va telefon raqamingizni yozib qoldiring, biz sizga qo'ng'iroq qilamiz va birorta ham savolingiz javobsiz qolmasligiga harakat qilamiz",
    subjectsLabel: "Qaysi fanni o'qimoqchisiz?",
    subjectMath: "Matematika",
    subjectEnglish: "Ingliz tili",
    subjectOther: "Boshqa",
    namePlaceholder: "Ismingiz",
    phonePlaceholder: "90 123 45 67",
    sendBtn: "Ro'yxatdan o'tish",
    sending: "Yuborilmoqda...",
    success: "Ma'lumotlar yuborildi! Tez orada siz bilan bog'lanamiz.",
    error: "Xatolik! Iltimos qaytadan urinib ko'ring.",
    emptyFields: "Iltimos, barcha maydonlarni to'ldiring!",
  },
  ru: {
    title: "Хотите изучать <span>математику</span> и английский язык?",
    desc: "Оставьте своё имя и номер телефона, мы вам позвоним и постараемся ответить на все ваши вопросы",
    subjectsLabel: "Какой предмет вы хотите изучать?",
    subjectMath: "Математика",
    subjectEnglish: "Английский язык",
    subjectOther: "Другое",
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "90 123 45 67",
    sendBtn: "Зарегистрироваться",
    sending: "Отправка...",
    success: "Данные отправлены! Мы скоро с вами свяжемся.",
    error: "Ошибка! Пожалуйста, попробуйте ещё раз.",
    emptyFields: "Пожалуйста, заполните все поля!",
  },
};

let currentLang = "uz";

/* ============================================================
   3. DOM elementlari
   ============================================================ */
const heroTitle = document.getElementById("hero-title");
const heroDesc = document.getElementById("hero-desc");
const labelSubjects = document.getElementById("label-subjects");
const labelMath = document.getElementById("label-math");
const labelEnglish = document.getElementById("label-english");
const labelOther = document.getElementById("label-other");
const inputName = document.getElementById("input-name");
const inputPhone = document.getElementById("input-phone");
const btnSend = document.getElementById("btn-send");
const leadForm = document.getElementById("lead-form");
const langButtons = document.querySelectorAll(".lang-mini .lang-btn");

/* ============================================================
   4. Tilni almashtirish
   ============================================================ */
function changeLang(lang) {
  const t = translations[lang];
  if (!t) return;

  currentLang = lang;

  heroTitle.innerHTML = t.title;
  heroDesc.textContent = t.desc;
  labelSubjects.textContent = t.subjectsLabel;
  labelMath.textContent = t.subjectMath;
  labelEnglish.textContent = t.subjectEnglish;
  labelOther.textContent = t.subjectOther;
  inputName.placeholder = t.namePlaceholder;
  inputPhone.placeholder = t.phonePlaceholder;
  btnSend.textContent = t.sendBtn;

  langButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => changeLang(btn.dataset.lang));
});

/* ============================================================
   5. Telegramga xabar yuborish (bitta chat_id uchun)
   ============================================================ */
function sendToTelegram(chatId, text) {
  return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    }),
  })
    .then((res) => {
      if (res.ok) return { chatId, ok: true };
      return res
        .json()
        .catch(() => ({}))
        .then((data) => {
          console.error(`Telegram xatosi (chat_id: ${chatId}):`, data.description || `HTTP ${res.status}`);
          return { chatId, ok: false };
        });
    })
    .catch((err) => {
      console.error(`Tarmoq xatosi (chat_id: ${chatId}):`, err);
      return { chatId, ok: false };
    });
}

/* ============================================================
   6. Forma yuborish
   ============================================================ */
leadForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const ism = inputName.value.trim();
  const tel = inputPhone.value.trim();
  const selected = Array.from(document.querySelectorAll('input[name="subject"]:checked')).map((cb) => cb.value);

  if (!ism || tel.length !== 9 || selected.length === 0) {
    alert(translations[currentLang].emptyFields);
    return;
  }

  btnSend.disabled = true;
  btnSend.textContent = translations[currentLang].sending;

  const xabar = `
🔵 **YANGI ARIZA**
━━━━━━━━━━━━━━
📚 **Fanlar:** ${selected.join(", ")}
👤 **Ismi:** ${ism}
📞 **Telefon:** +998 ${tel}
🌐 **Til:** ${currentLang.toUpperCase()}
━━━━━━━━━━━━━━`;

  Promise.all(CHAT_IDS.map((id) => sendToTelegram(id, xabar)))
    .then((results) => {
      const hasSuccess = results.some((r) => r.ok);

      if (hasSuccess) {
        // Meta Pixel: forma muvaffaqiyatli yuborilganda "Lead" hodisasini yuboradi
        if (typeof fbq === "function") {
          fbq("track", "Lead");
        }
        alert(translations[currentLang].success);
        leadForm.reset();
      } else {
        alert(translations[currentLang].error);
      }
    })
    .finally(() => {
      btnSend.disabled = false;
      btnSend.textContent = translations[currentLang].sendBtn;
    });
});

/* ============================================================
   7. Telefon raqami - faqat raqamlarga ruxsat
   ============================================================ */
inputPhone.addEventListener("input", function () {
  this.value = this.value.replace(/\D/g, "").slice(0, 9);
});

/* ============================================================
   8. Swiper slayder
   ============================================================ */
// eslint-disable-next-line no-undef
new Swiper(".mySwiper", {
  loop: true,
  speed: 800,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

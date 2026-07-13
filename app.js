// 1. Sozlamalar
// botToken endi config.js faylidan keladi (index.html da app.js dan OLDIN ulangan bo'lishi shart)
const chatIds = ["8101060085", "6649934046"]; // Eski va yangi chat ID'lar - hammasiga xabar boradi

// 2. Tarjimalar lug'ati
const translations = {
    uz: {
        title: "Kelajak ko'nikmalarini <span>BIZ BILAN</span> o'rganing!",
        desc: "Sizga qiziq bo'lgan fanni tanlang va mutaxassislarimizdan bepul maslahat oling.",
        namePlaceholder: "Ismingiz",
        phonePlaceholder: "Telefon raqamingiz",
        sendBtn: "Ro'yxatdan o'tish",
        success: "Ma'lumotlar yuborildi! Tez orada siz bilan bog'lanamiz.",
        error: "Xatolik! Iltimos qaytadan urinib ko'ring.",
        emptyFields: "Iltimos, barcha maydonlarni to'ldiring!"
    },
    ru: {
        title: "Изучайте навыки будущего <span>ВМЕСТЕ С НАМИ</span>!",
        desc: "Выберите интересующий вас предмет и получите бесплатную консультацию от наших экспертов.",
        namePlaceholder: "Ваше имя",
        phonePlaceholder: "Номер телефона",
        sendBtn: "Зарегистрироваться",
        success: "Данные отправлены! Мы скоро с вами свяжемся.",
        error: "Ошибка! Пожалуйста, попробуйте еще раз.",
        emptyFields: "Пожалуйста, заполните все поля!"
    }
};

let currentLang = 'uz';

// 3. Tilni almashtirish funksiyasi
function changeLang(lang) {
    currentLang = lang;

    // Matnlarni yangilash
    document.getElementById('hero-title').innerHTML = translations[lang].title;
    document.getElementById('hero-desc').innerText = translations[lang].desc;
    document.getElementById('input-name').placeholder = translations[lang].namePlaceholder;
    document.getElementById('input-phone').placeholder = translations[lang].phonePlaceholder;
    document.getElementById('btn-send').innerText = translations[lang].sendBtn;

    // Tugma dizaynini (active klassi) yangilash
    const buttons = document.querySelectorAll('.lang-mini .lang-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === lang) {
            btn.classList.add('active');
        }
    });
}

// 4. Bitta chat_id'ga xabar yuborish va natijasini qaytarish (muvaffaqiyatli/muvaffaqiyatsiz)
function sendToTelegram(chatId, text) {
    return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: "Markdown"
        })
    })
        .then(res => {
            if (res.ok) {
                return { chatId, ok: true };
            }
            return res.json()
                .catch(() => ({}))
                .then(data => {
                    console.error(`Telegram xatosi (chat_id: ${chatId}):`, data.description || `HTTP ${res.status}`);
                    return { chatId, ok: false };
                });
        })
        .catch(err => {
            console.error(`Tarmoq xatosi (chat_id: ${chatId}):`, err);
            return { chatId, ok: false };
        });
}

// 5. Forma yuborish tugmasi
document.getElementById('btn-send').addEventListener('click', function () {
    const ism = document.getElementById('input-name').value.trim();
    const tel = document.getElementById('input-phone').value.trim();

    // Tanlanganlarni yig'ish
    const selected = [];
    document.querySelectorAll('input[name="subject"]:checked').forEach(cb => {
        selected.push(cb.value);
    });

    if (!ism || !tel || selected.length === 0) {
        alert(translations[currentLang].emptyFields);
        return;
    }

    const btn = this;
    btn.disabled = true;
    btn.innerText = "...";

    const xabar = `
🔵 **YANGI ARIZA**
━━━━━━━━━━━━━━
📚 **Fanlar:** ${selected.join(', ')}
👤 **Ismi:** ${ism}
📞 **Telefon:** +998 ${tel}
🌐 **Til:** ${currentLang.toUpperCase()}
━━━━━━━━━━━━━━`;

    // Barcha chat_id'larga parallel ravishda xabar yuboriladi
    Promise.all(chatIds.map(id => sendToTelegram(id, xabar)))
        .then(results => {
            const hasSuccess = results.some(r => r.ok);

            if (hasSuccess) {
                // Meta Pixel: forma muvaffaqiyatli yuborilganda "Lead" hodisasini yuboradi
                // Bu Instagram/Facebook reklama tizimiga qaysi odamlar aynan forma to'ldirganini bildiradi
                if (typeof fbq === 'function') {
                    fbq('track', 'Lead');
                }
                alert(translations[currentLang].success);
                document.getElementById('input-name').value = "";
                document.getElementById('input-phone').value = "";
            } else {
                alert(translations[currentLang].error);
            }
        })
        .finally(() => {
            // Tugmani qayta tiklash
            btn.disabled = false;
            btn.innerText = translations[currentLang].sendBtn;
        });
});

// 6. Telefon raqami uchun faqat raqamli cheklov (Regex bilan)
const phoneInput = document.getElementById('input-phone');

phoneInput.addEventListener('input', function (e) {
    // Raqam bo'lmagan barcha belgilarni (harf, belgi, probel) o'chirib tashlaydi
    this.value = this.value.replace(/[^0-9]/g, '');

    // Maksimal 9 ta raqamdan oshib ketmasligini ta'minlaydi
    if (this.value.length > 9) {
        this.value = this.value.slice(0, 9);
    }
});

// 7. Swiper slayder
var swiper = new Swiper(".mySwiper", {
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
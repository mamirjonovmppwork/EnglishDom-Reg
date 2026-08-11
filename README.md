# English Dom - Ro'yxatdan o'tish sahifasi

Matematika va ingliz tili kurslariga ro'yxatdan o'tish uchun bir sahifali (landing page) sayt.
Forma to'ldirilganda ma'lumotlar Telegram botga yuboriladi.

## Fayllar

- `index.html` — sahifa tuzilishi
- `style.css` — dizayn
- `app.js` — forma logikasi, til almashtirish (UZ/RU), Telegramga yuborish
- `config.js` — **maxfiy**, botToken shu yerda saqlanadi, gitga yuklanmaydi
- `img/` — rasmlar (optimallashtirilgan, 2:3 nisbatda)
- `vendor/swiper/` — Swiper kutubxonasi lokal holda (tashqi CDN'ga bog'liq emas, tezroq va barqaror ishlaydi)

## Ishga tushirish (lokal)

1. `config.js` faylini oching va `botToken` qiymatiga o'zingizning Telegram bot tokeningizni yozing.
2. `index.html` faylini brauzerda oching yoki istalgan statik hosting'ga joylang.

## Vercel'ga joylash (tavsiya etiladi)

`config.js` ataylab `.gitignore`da — u gitga yuklanmaydi, shuning uchun Vercel build paytida uni **avtomatik yaratadi**. Buning uchun:

1. Vercel loyihasi sozlamalariga kiring: **Project → Settings → Environment Variables**
2. Yangi o'zgaruvchi qo'shing: `BOT_TOKEN` = (haqiqiy Telegram bot tokeningiz), barcha muhitlar uchun (Production/Preview/Development)
3. `vercel.json` fayli loyihada allaqachon bor — u deploy paytida `BOT_TOKEN` asosida `config.js`ni avtomatik yaratadi
4. Deploy qiling (yoki GitHub'ga push qiling, Vercel avtomatik qayta deploy qiladi)

Shu tartibda token hech qachon GitHub repo'ga tushmaydi (repo public bo'lgani uchun bu muhim), lekin sayt to'g'ri ishlaydi.

## Xavfsizlik bo'yicha eslatma

`botToken` brauzerda ishlaydigan kodda saqlanadi, ya'ni har qanday tashrifchi uni ko'ra oladi.
Bu ko'rinishdagi loyihalar uchun odatiy holat, lekin tavsiya etiladi:

- Botga faqat kerakli minimal huquqlarni bering.
- Agar token oshkor bo'lib qolsa (masalan, boshqa birov bilan ulashilgan bo'lsa), uni
  [@BotFather](https://t.me/BotFather) orqali darhol qayta generatsiya qiling (`/revoke`).

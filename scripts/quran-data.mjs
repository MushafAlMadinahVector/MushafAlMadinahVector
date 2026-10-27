/**
 * Authoritative page-to-Surah and Juz mapping for the 604-page
 * Mushaf Al-Madinah (Hafs narration, King Fahd Glorious Quran Printing Complex).
 */

export const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

export const SURAHS = [
  { id: 1, nameEn: "Al-Fatihah", nameAr: "الفاتحة", startPage: 1 },
  { id: 2, nameEn: "Al-Baqarah", nameAr: "البقرة", startPage: 2 },
  { id: 3, nameEn: "Ali 'Imran", nameAr: "آل عمران", startPage: 50 },
  { id: 4, nameEn: "An-Nisa'", nameAr: "النساء", startPage: 77 },
  { id: 5, nameEn: "Al-Ma'idah", nameAr: "المائدة", startPage: 106 },
  { id: 6, nameEn: "Al-An'am", nameAr: "الأنعام", startPage: 128 },
  { id: 7, nameEn: "Al-A'raf", nameAr: "الأعراف", startPage: 151 },
  { id: 8, nameEn: "Al-Anfal", nameAr: "الأنفال", startPage: 177 },
  { id: 9, nameEn: "At-Tawbah", nameAr: "التوبة", startPage: 187 },
  { id: 10, nameEn: "Yunus", nameAr: "يونس", startPage: 208 },
  { id: 11, nameEn: "Hud", nameAr: "هود", startPage: 221 },
  { id: 12, nameEn: "Yusuf", nameAr: "يوسف", startPage: 235 },
  { id: 13, nameEn: "Ar-Ra'd", nameAr: "الرعد", startPage: 249 },
  { id: 14, nameEn: "Ibrahim", nameAr: "إبراهيم", startPage: 255 },
  { id: 15, nameEn: "Al-Hijr", nameAr: "الحجر", startPage: 262 },
  { id: 16, nameEn: "An-Nahl", nameAr: "النحل", startPage: 267 },
  { id: 17, nameEn: "Al-Isra'", nameAr: "الإسراء", startPage: 282 },
  { id: 18, nameEn: "Al-Kahf", nameAr: "الكهف", startPage: 293 },
  { id: 19, nameEn: "Maryam", nameAr: "مريم", startPage: 305 },
  { id: 20, nameEn: "Ta-Ha", nameAr: "طه", startPage: 312 },
  { id: 21, nameEn: "Al-Anbiya'", nameAr: "الأنبياء", startPage: 322 },
  { id: 22, nameEn: "Al-Hajj", nameAr: "الحج", startPage: 332 },
  { id: 23, nameEn: "Al-Mu'minun", nameAr: "المؤمنون", startPage: 342 },
  { id: 24, nameEn: "An-Nur", nameAr: "النور", startPage: 350 },
  { id: 25, nameEn: "Al-Furqan", nameAr: "الفرقان", startPage: 359 },
  { id: 26, nameEn: "Ash-Shu'ara'", nameAr: "الشعراء", startPage: 367 },
  { id: 27, nameEn: "An-Naml", nameAr: "النمل", startPage: 377 },
  { id: 28, nameEn: "Al-Qasas", nameAr: "القصص", startPage: 385 },
  { id: 29, nameEn: "Al-'Ankabut", nameAr: "العنكبوت", startPage: 396 },
  { id: 30, nameEn: "Ar-Rum", nameAr: "الروم", startPage: 404 },
  { id: 31, nameEn: "Luqman", nameAr: "لقمان", startPage: 411 },
  { id: 32, nameEn: "As-Sajdah", nameAr: "السجدة", startPage: 415 },
  { id: 33, nameEn: "Al-Ahzab", nameAr: "الأحزاب", startPage: 418 },
  { id: 34, nameEn: "Saba'", nameAr: "سبأ", startPage: 428 },
  { id: 35, nameEn: "Fatir", nameAr: "فاطر", startPage: 434 },
  { id: 36, nameEn: "Ya-Sin", nameAr: "يس", startPage: 440 },
  { id: 37, nameEn: "As-Saffat", nameAr: "الصافات", startPage: 446 },
  { id: 38, nameEn: "Sad", nameAr: "ص", startPage: 453 },
  { id: 39, nameEn: "Az-Zumar", nameAr: "الزمر", startPage: 458 },
  { id: 40, nameEn: "Ghafir", nameAr: "غافر", startPage: 467 },
  { id: 41, nameEn: "Fussilat", nameAr: "فصلت", startPage: 477 },
  { id: 42, nameEn: "Ash-Shura", nameAr: "الشورى", startPage: 483 },
  { id: 43, nameEn: "Az-Zukhruf", nameAr: "الزخرف", startPage: 489 },
  { id: 44, nameEn: "Ad-Dukhan", nameAr: "الدخان", startPage: 496 },
  { id: 45, nameEn: "Al-Jathiyah", nameAr: "الجاثية", startPage: 499 },
  { id: 46, nameEn: "Al-Ahqaf", nameAr: "الأحقاف", startPage: 502 },
  { id: 47, nameEn: "Muhammad", nameAr: "محمد", startPage: 507 },
  { id: 48, nameEn: "Al-Fath", nameAr: "الفتح", startPage: 511 },
  { id: 49, nameEn: "Al-Hujurat", nameAr: "الحجرات", startPage: 515 },
  { id: 50, nameEn: "Qaf", nameAr: "ق", startPage: 518 },
  { id: 51, nameEn: "Adh-Dhariyat", nameAr: "الذاريات", startPage: 520 },
  { id: 52, nameEn: "At-Tur", nameAr: "الطور", startPage: 523 },
  { id: 53, nameEn: "An-Najm", nameAr: "النجم", startPage: 526 },
  { id: 54, nameEn: "Al-Qamar", nameAr: "القمر", startPage: 528 },
  { id: 55, nameEn: "Ar-Rahman", nameAr: "الرحمن", startPage: 531 },
  { id: 56, nameEn: "Al-Waqi'ah", nameAr: "الواقعة", startPage: 534 },
  { id: 57, nameEn: "Al-Hadid", nameAr: "الحديد", startPage: 537 },
  { id: 58, nameEn: "Al-Mujadilah", nameAr: "المجادلة", startPage: 542 },
  { id: 59, nameEn: "Al-Hashr", nameAr: "الحشر", startPage: 545 },
  { id: 60, nameEn: "Al-Mumtahanah", nameAr: "الممتحنة", startPage: 549 },
  { id: 61, nameEn: "As-Saff", nameAr: "الصف", startPage: 551 },
  { id: 62, nameEn: "Al-Jumu'ah", nameAr: "الجمعة", startPage: 553 },
  { id: 63, nameEn: "Al-Munafiqun", nameAr: "المنافقون", startPage: 554 },
  { id: 64, nameEn: "At-Taghabun", nameAr: "التغابن", startPage: 556 },
  { id: 65, nameEn: "At-Talaq", nameAr: "الطلاق", startPage: 558 },
  { id: 66, nameEn: "At-Tahrim", nameAr: "التحريم", startPage: 560 },
  { id: 67, nameEn: "Al-Mulk", nameAr: "الملك", startPage: 562 },
  { id: 68, nameEn: "Al-Qalam", nameAr: "القلم", startPage: 564 },
  { id: 69, nameEn: "Al-Haqqah", nameAr: "الحاقة", startPage: 566 },
  { id: 70, nameEn: "Al-Ma'arij", nameAr: "المعارج", startPage: 568 },
  { id: 71, nameEn: "Nuh", nameAr: "نوح", startPage: 570 },
  { id: 72, nameEn: "Al-Jinn", nameAr: "الجن", startPage: 572 },
  { id: 73, nameEn: "Al-Muzzammil", nameAr: "المزمل", startPage: 574 },
  { id: 74, nameEn: "Al-Muddaththir", nameAr: "المدثر", startPage: 575 },
  { id: 75, nameEn: "Al-Qiyamah", nameAr: "القيامة", startPage: 577 },
  { id: 76, nameEn: "Al-Insan", nameAr: "الإنسان", startPage: 578 },
  { id: 77, nameEn: "Al-Mursalat", nameAr: "المرسلات", startPage: 580 },
  { id: 78, nameEn: "An-Naba'", nameAr: "النبأ", startPage: 582 },
  { id: 79, nameEn: "An-Nazi'at", nameAr: "النازعات", startPage: 583 },
  { id: 80, nameEn: "'Abasa", nameAr: "عبس", startPage: 585 },
  { id: 81, nameEn: "At-Takwir", nameAr: "التكوير", startPage: 586 },
  { id: 82, nameEn: "Al-Infitar", nameAr: "الانفطار", startPage: 587 },
  { id: 83, nameEn: "Al-Mutaffifin", nameAr: "المطففين", startPage: 587 },
  { id: 84, nameEn: "Al-Inshiqaq", nameAr: "الانشقاق", startPage: 589 },
  { id: 85, nameEn: "Al-Buruj", nameAr: "البروج", startPage: 590 },
  { id: 86, nameEn: "At-Tariq", nameAr: "الطارق", startPage: 591 },
  { id: 87, nameEn: "Al-A'la", nameAr: "الأعلى", startPage: 591 },
  { id: 88, nameEn: "Al-Ghashiyah", nameAr: "الغاشية", startPage: 592 },
  { id: 89, nameEn: "Al-Fajr", nameAr: "الفجر", startPage: 593 },
  { id: 90, nameEn: "Al-Balad", nameAr: "البلد", startPage: 594 },
  { id: 91, nameEn: "Ash-Shams", nameAr: "الشمس", startPage: 595 },
  { id: 92, nameEn: "Al-Layl", nameAr: "الليل", startPage: 595 },
  { id: 93, nameEn: "Ad-Duha", nameAr: "الضحى", startPage: 596 },
  { id: 94, nameEn: "Ash-Sharh", nameAr: "الشرح", startPage: 596 },
  { id: 95, nameEn: "At-Tin", nameAr: "التين", startPage: 597 },
  { id: 96, nameEn: "Al-'Alaq", nameAr: "العلق", startPage: 597 },
  { id: 97, nameEn: "Al-Qadr", nameAr: "القدر", startPage: 598 },
  { id: 98, nameEn: "Al-Bayyinah", nameAr: "البينة", startPage: 598 },
  { id: 99, nameEn: "Az-Zalzalah", nameAr: "الزلزلة", startPage: 599 },
  { id: 100, nameEn: "Al-'Adiyat", nameAr: "العاديات", startPage: 599 },
  { id: 101, nameEn: "Al-Qari'ah", nameAr: "القارعة", startPage: 600 },
  { id: 102, nameEn: "At-Takathur", nameAr: "التكاثر", startPage: 600 },
  { id: 103, nameEn: "Al-'Asr", nameAr: "العصر", startPage: 601 },
  { id: 104, nameEn: "Al-Humazah", nameAr: "الهمزة", startPage: 601 },
  { id: 105, nameEn: "Al-Fil", nameAr: "الفيل", startPage: 601 },
  { id: 106, nameEn: "Quraysh", nameAr: "قريش", startPage: 602 },
  { id: 107, nameEn: "Al-Ma'un", nameAr: "الماعون", startPage: 602 },
  { id: 108, nameEn: "Al-Kawthar", nameAr: "الكوثر", startPage: 602 },
  { id: 109, nameEn: "Al-Kafirun", nameAr: "الكافرون", startPage: 603 },
  { id: 110, nameEn: "An-Nasr", nameAr: "النصر", startPage: 603 },
  { id: 111, nameEn: "Al-Masad", nameAr: "المسد", startPage: 603 },
  { id: 112, nameEn: "Al-Ikhlas", nameAr: "الإخلاص", startPage: 604 },
  { id: 113, nameEn: "Al-Falaq", nameAr: "الفلق", startPage: 604 },
  { id: 114, nameEn: "An-Nas", nameAr: "الناس", startPage: 604 }
];

export function getJuzForPage(pageNumber) {
  for (let i = JUZ_START_PAGES.length - 1; i >= 0; i--) {
    if (pageNumber >= JUZ_START_PAGES[i]) {
      return i + 1;
    }
  }
  return 1;
}

export function getSurahsForPage(pageNumber) {
  // Return the main/prominent Surah on this page
  let found = SURAHS[0];
  for (let i = 0; i < SURAHS.length; i++) {
    if (SURAHS[i].startPage <= pageNumber) {
      found = SURAHS[i];
    } else {
      break;
    }
  }
  return found;
}

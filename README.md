# MushafAlMadinahVector

---

<div dir="rtl" align="right">

## العربية

### مصحف المدينة النبوية — النسخة المتجهية (Vector)

> **إشعار:** هذا المستودع يُعيد نشر الملفات المتجهية الرسمية لمصحف المدينة النبوية كما هي، دون أي تعديل على المحتوى. الملفات صادرة عن مجمع الملك فهد لطباعة المصحف الشريف، وإعادة نشرها هنا مُتاحة وفقًا لسياسة حقوق الاستخدام المعلنة من المجمع، والتي تُجيز الاستخدام والتوزيع مجانًا في المجالات الرقمية والبرمجية وغيرها. جميع الحقوق الفكرية محفوظة لمجمع الملك فهد لطباعة المصحف الشريف.

---

#### نبذة عن المشروع

يوفر هذا المستودع ملفات النسخة الرقمية المتجهية (Vector) من **مصحف المدينة النبوية** برواية حفص عن عاصم، والصادر رسميًا عن **مجمع الملك فهد لطباعة المصحف الشريف** بالمدينة المنورة، المملكة العربية السعودية.

الملفات الأصلية متوفرة بصيغة **Adobe Illustrator (AI)**، وهي ملفات متجهية عالية الدقة يمكن استخدامها في التطبيقات، والمواقع الإلكترونية، والمشاريع الرقمية، وكذلك في أعمال التصميم والطباعة.

---

#### مميزات الملفات المتجهية

تعتمد ملفات المتجهات على معادلات رياضية بدلًا من البكسلات، مما يمنحها الخصائص التالية:

- وضوح كامل عند التكبير بدون فقدان الجودة
- حفظ دقيق للرسم العثماني بجميع الحركات وعلامات الوقف
- إمكانية تغيير الألوان والحجم برمجيًا
- خلفية شفافة
- حجم ملفات أقل مقارنة بالصور النقطية عالية الدقة
- مناسبة للطباعة بجميع الدقات (300dpi، 600dpi أو أعلى)

---

#### تنسيق أسماء الملفات

جميع الصفحات محفوظة بالتنسيق التالي:

</div>

```
001___Hafs39__DM.ai
002___Hafs39__DM.ai
003___Hafs39__DM.ai
...
```

<div dir="rtl" align="right">

- الرقم الأول يمثل رقم الصفحة
- `Hafs39` يرمز إلى نسخة حفص (الإصدار 39)
- `DM` اختصار داخلي يشير إلى النسخة الرقمية

---

#### الاستخدام

##### في تطبيقات الويب

يمكن تحويل الملفات إلى SVG أو PNG ثم إدراجها في صفحات الويب:

</div>

```html
<img src="pages/001.svg" alt="صفحة من القرآن الكريم" />
```

<div dir="rtl" align="right">

##### في تطبيقات الجوال

يمكن تحويل الملفات إلى SVG أو PNG وعرضها باستخدام مكتبات iOS أو Android.

##### في برامج التصميم

تُفتح مباشرة في:

- Adobe Illustrator
- Inkscape
- Affinity Designer
- وأي برنامج يدعم صيغة AI

##### للطباعة

يمكن الطباعة بأي دقة دون فقدان الجودة بفضل الطبيعة المتجهية للملفات.

---

#### تحويل الملفات

##### باستخدام Inkscape (مجاني)

</div>

```bash
# تحويل ملف واحد
inkscape 001___Hafs39__DM.ai --export-filename=001.svg

# تحويل جميع الملفات
for f in *.ai; do inkscape "$f" --export-filename="${f%.ai}.svg"; done
```

<div dir="rtl" align="right">

##### باستخدام Adobe Illustrator

`File → Save As → SVG`

---

#### المصدر والترخيص

**المصدر الرسمي:**
[مجمع الملك فهد لطباعة المصحف الشريف](https://dm.qurancomplex.gov.sa/)

> ⚠️ **ملاحظة:** طباعة المصاحف لأغراض تجارية داخل المملكة أو استيرادها للبيع يخضع لأنظمة خاصة.

> ⚠️ **تنبيه:** المجمع غير مسؤول عن الأخطاء التقنية الناتجة عن الاستخدام البرمجي للملفات.

---

#### الاعتمادات

**الخطاط:** عثمان طه حفظه الله
**الناشر:** مجمع الملك فهد لطباعة المصحف الشريف — المدينة المنورة

---

> نسأل الله أن ينفع المسلمين بهذا العمل المبارك

</div>

---

## English

### Mushaf Al-Madinah An-Nabawiyyah — Vector Edition

> **Notice:** This repository republishes the official vector files of Mushaf Al-Madinah An-Nabawiyyah as-is, without any modification to the content. The files are produced by the King Fahd Glorious Quran Printing Complex. Redistribution here is permitted under the Complex's published usage rights policy, which allows free use and distribution for digital, software, and other purposes. All intellectual property rights belong to the King Fahd Glorious Quran Printing Complex.

---

#### About

This repository provides the digital vector (AI format) edition of **Mushaf Al-Madinah An-Nabawiyyah** (Hafs narration), officially published by the **King Fahd Glorious Quran Printing Complex** in Al-Madinah, Saudi Arabia.

The files are original vector files suitable for digital applications, web usage, design work, and high-quality printing.

---

#### Vector Advantages

- Unlimited scaling without quality loss
- Precise preservation of the Uthmanic script and diacritics
- Editable colors and sizes
- Transparent background
- Smaller file sizes compared to raster images
- Print-ready at any resolution

---

#### File Naming Format

All pages follow this naming pattern:

```
001___Hafs39__DM.ai
002___Hafs39__DM.ai
003___Hafs39__DM.ai
...
```

- First number = page number
- `Hafs39` = Hafs edition (version 39)
- `DM` = internal digital version label

---

#### Usage

##### Web

Convert to SVG or PNG and embed:

```html
<img src="pages/001.svg" alt="Quran Page" />
```

##### Mobile Apps

Convert to SVG/PNG and render using platform-specific libraries (iOS / Android).

##### Design Software

Open directly in:

- Adobe Illustrator
- Inkscape
- Affinity Designer

##### Printing

Print at any resolution (300dpi, 600dpi, or higher) without quality loss.

---

#### Conversion

##### Using Inkscape

```bash
inkscape 001___Hafs39__DM.ai --export-filename=001.svg
```

Batch:

```bash
for f in *.ai; do inkscape "$f" --export-filename="${f%.ai}.svg"; done
```

---

#### Source & License

**Official Source:**
[King Fahd Glorious Quran Printing Complex](https://dm.qurancomplex.gov.sa/)

> ⚠️ **Note:** Commercial printing and sale inside the Kingdom are subject to specific regulations.

> ⚠️ **Disclaimer:** The Complex is not responsible for technical or programming issues arising from usage.

---

#### Credits

**Calligraphy:** Uthman Taha (may Allah preserve him)
**Publisher:** King Fahd Glorious Quran Printing Complex — Al-Madinah Al-Munawwarah

---

> May Allah benefit the Muslims through this work

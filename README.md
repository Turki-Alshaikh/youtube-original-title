<div align="center">

# 📺 YouTube Original Title (Chrome Extension)
### إضافة كروم لعرض عناوين يوتيوب الأصلية

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://developer.chrome.com/docs/extensions/)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)]()
[![Developer](https://img.shields.io/badge/Developer-Turki_Alshaikh-000000?style=flat&logo=github)](https://github.com/Turki-Alshaikh)

[**Read in English**](#english) | [**إقرأ باللغة العربية**](#arabic)

</div>

---

<h2 id="english">🇬🇧 English Documentation</h2>

A lightweight and efficient Google Chrome extension that forces YouTube to display the **original title** of a video, bypassing YouTube's automatic title translation feature. Say goodbye to confusing translated titles and see the content exactly as the creator intended!

### ✨ Features
*   **No More Auto-Translate:** Always displays the creator's true, original video title by fetching data via the official oEmbed API.
*   **Global Coverage:** Works flawlessly on the Home page, Subscriptions feed, Search results, and the Watch page.
*   **High Performance:** Utilizes `IntersectionObserver` to only fetch titles for videos currently visible on your screen, saving memory and avoiding API rate limits.
*   **Smart Caching:** Built-in caching mechanism prevents redundant network requests for the same video.
*   **Modern Standards:** Fully compliant with Chrome's latest **Manifest V3** security and performance guidelines.

### 🚀 Installation (Developer Mode)
1. Clone this repository or download the ZIP file and extract it.
   ```bash
   git clone [https://github.com/Turki-Alshaikh/youtube-original-title.git](https://github.com/Turki-Alshaikh/youtube-original-title.git)



2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click the **Load unpacked** button in the top left corner.
5. Select the folder containing the extension files.
6. Open or refresh [YouTube](https://www.youtube.com) and enjoy original titles!

### 🛠️ How it Works

The extension uses a `MutationObserver` to detect when YouTube loads new video thumbnails. Once a video card enters the viewport (tracked via `IntersectionObserver`), the extension extracts the Video ID and queries YouTube's official **oEmbed API** with `credentials: 'omit'` to fetch the localized-free, original title, seamlessly injecting it back into the DOM.

---

إضافة خفيفة وسريعة لمتصفح جوجل كروم تقوم بإجبار موقع يوتيوب على عرض **العنوان الأصلي** للمقطع، متجاوزةً ميزة الترجمة التلقائية للعناوين. ودّع العناوين المترجمة بشكل ركيك وشاهد المحتوى كما كتبه صانع المقطع بالضبط!

### ✨ المميزات

* **إيقاف الترجمة التلقائية:** عرض العنوان الأصلي دائماً من خلال جلب البيانات من واجهة يوتيوب البرمجية (oEmbed API).
* **تغطية شاملة:** تعمل الإضافة في الصفحة الرئيسية، صفحة الاشتراكات، نتائج البحث، وصفحة مشاهدة المقطع.
* **أداء عالي:** تستخدم تقنية `IntersectionObserver` لجلب عناوين المقاطع الظاهرة على شاشتك فقط أثناء التمرير، مما يوفر استهلاك الذاكرة ويمنع حظر يوتيوب للإضافة.
* **نظام تخزين ذكي (Caching):** يمنع تكرار الطلبات البرمجية لنفس المقطع لتسريع التصفح.
* **معايير حديثة:** متوافقة تماماً مع أحدث معايير الأمان والأداء من جوجل كروم **Manifest V3**.

### 🚀 طريقة التثبيت (وضع المطور)

1. قم بتحميل المشروع (Clone) أو نزّل ملف الـ ZIP وفك الضغط عنه.
```bash
git clone [https://github.com/Turki-Alshaikh/youtube-original-title.git](https://github.com/Turki-Alshaikh/youtube-original-title.git)

```


2. افتح متصفح جوجل كروم وانتقل إلى الرابط `chrome://extensions/`.
3. فعّل خيار **وضع مطور البرامج (Developer mode)** من الزاوية العلوية.
4. انقر على زر **تحميل إضافة فُكَّ ضغطها (Load unpacked)**.
5. حدد المجلد الذي يحتوي على ملفات الإضافة.
6. قم بتحديث صفحة يوتيوب واستمتع بالعناوين الأصلية!

---

## 👨‍💻 Author / المطور

**Turki Alshaikh (تركي آل الشيخ)**

* 💼 **LinkedIn:** [Turki Alshaikh](https://linkedin.com/in/Turki--Alshaikh)

## 🤝 Contributing / المساهمة

Contributions, issues, and feature requests are welcome!
الجميع مرحب به للمساهمة في تطوير الإضافة، سواءً باقتراح ميزات جديدة أو إصلاح الأخطاء.

## 📜 License / الرخصة

Distributed under the MIT License.
هذا المشروع مفتوح المصدر ومتاح تحت رخصة MIT.

---
!

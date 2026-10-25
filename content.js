// ذاكرة مؤقتة لحفظ العناوين وتجنب تكرار الطلب لنفس المقطع
const titleCache = new Map();

// جلب العنوان الأصلي للمقطع متجاهلاً لغة الحساب
async function fetchOriginalTitle(videoId) {
    if (titleCache.has(videoId)) return titleCache.get(videoId);
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
            credentials: 'omit'
        });
        if (!response.ok) return null;
        const data = await response.json();
        titleCache.set(videoId, data.title);
        return data.title;
    } catch (e) {
        return null;
    }
}

// تحديث النص في واجهة يوتيوب
async function updateElementTitle(element, videoId) {
    const originalTitle = await fetchOriginalTitle(videoId);
    if (originalTitle) {
        // تحديث النص المعروض
        if (element.tagName.toLowerCase() === 'span' || element.tagName.toLowerCase() === 'yt-formatted-string') {
            element.textContent = originalTitle;
        } else {
            element.innerText = originalTitle;
        }

        // تحديث النص الذي يظهر عند تمرير الفأرة (Tooltip)
        const parentH3 = element.closest('h3');
        if (parentH3) parentH3.title = originalTitle;
        
        const parentA = element.closest('a');
        if (parentA) parentA.title = originalTitle;
        
        // إذا كنا بداخل صفحة المشاهدة، قم بتحديث عنوان تبويب المتصفح
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('v') === videoId && document.title.includes('YouTube')) {
            document.title = `${originalTitle} - YouTube`;
        }
    }
}

// أداة تراقب المقاطع التي تظهر في الشاشة فقط (لتسريع الأداء وتجنب الحظر)
const visibilityObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const videoId = element.dataset.videoId;
            if (videoId) {
                updateElementTitle(element, videoId);
                observer.unobserve(element); // إيقاف المراقبة بعد التحديث
            }
        }
    });
}, { rootMargin: "200px" });

// البحث عن كل عناوين المقاطع في الصفحة
function scanForVideoTitles() {
    // استهداف تصميم الصفحة الرئيسية الجديد والقديم، وصفحة المشاهدة
    const selectors = [
        'a.ytLockupMetadataViewModelTitle span', // التصميم الجديد (الموجود في الكود الذي أرسلته)
        'a#video-title yt-formatted-string',     // التصميم القديم
        'a#video-title',                         // التصميم الكلاسيكي
        'h1.ytd-watch-metadata yt-formatted-string' // صفحة المشاهدة
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach(el => {
        if (el.dataset.titleTracked) return; // تخطي العناصر التي تم تعديلها مسبقاً

        let videoId = null;

        if (el.closest('h1.ytd-watch-metadata')) {
            // استخراج المعرف إذا كنا في صفحة المشاهدة
            videoId = new URLSearchParams(window.location.search).get('v');
        } else {
            // استخراج المعرف من الرابط في الصفحة الرئيسية
            const linkElement = el.closest('a');
            if (linkElement && linkElement.href.includes('/watch?v=')) {
                try {
                    videoId = new URL(linkElement.href).searchParams.get('v');
                } catch(e) {}
            }
        }

        if (videoId) {
            el.dataset.titleTracked = "true";
            el.dataset.videoId = videoId;
            visibilityObserver.observe(el); // مراقبة العنصر لتحديثه بمجرد ظهوره للمستخدم
        }
    });
}

// مراقبة الموقع بحثاً عن المقاطع الجديدة أثناء التمرير للأسفل (Scrolling)
const domObserver = new MutationObserver(() => {
    scanForVideoTitles();
});
domObserver.observe(document.body, { childList: true, subtree: true });

// التشغيل الأولي
scanForVideoTitles();
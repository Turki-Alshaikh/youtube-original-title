// ذاكرة مؤقتة لحفظ العناوين وتجنب تكرار الطلب لنفس المقطع
const titleCache = new Map();
let currentWatchVideoId = null;

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

// تحديث النص في واجهة يوتيوب (للبطاقات المصغرة)
async function updateElementTitle(element, videoId) {
    const originalTitle = await fetchOriginalTitle(videoId);
    if (originalTitle) {
        if (element.tagName.toLowerCase() === 'span' || element.tagName.toLowerCase() === 'yt-formatted-string') {
            element.textContent = originalTitle;
        } else {
            element.innerText = originalTitle;
        }

        const parentH3 = element.closest('h3');
        if (parentH3) parentH3.title = originalTitle;
        
        const parentA = element.closest('a');
        if (parentA) parentA.title = originalTitle;
    }
}

// أداة تراقب المقاطع التي تظهر في الشاشة (للقوائم والصفحة الرئيسية)
const visibilityObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const videoId = element.dataset.videoId;
            if (videoId) {
                updateElementTitle(element, videoId);
                observer.unobserve(element);
            }
        }
    });
}, { rootMargin: "200px" });

// البحث عن عناوين المقاطع كبطاقات (Thumbnails)
function scanForVideoCards() {
    const selectors = [
        'a.ytLockupMetadataViewModelTitle span', 
        'a#video-title yt-formatted-string',     
        'a#video-title'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach(el => {
        // تخطي عناصر صفحة المشاهدة الرئيسية هنا، لأننا نعالجها بشكل منفصل
        if (el.closest('h1.ytd-watch-metadata')) return; 
        if (el.dataset.titleTracked) return;

        let videoId = null;
        const linkElement = el.closest('a');
        if (linkElement && linkElement.href.includes('/watch?v=')) {
            try {
                videoId = new URL(linkElement.href).searchParams.get('v');
            } catch(e) {}
        }

        if (videoId) {
            el.dataset.titleTracked = "true";
            el.dataset.videoId = videoId;
            visibilityObserver.observe(el);
        }
    });
}

// تحديث عنوان المقطع الرئيسي في صفحة المشاهدة وعنوان التبويب
async function updateWatchPageTitle() {
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('v');

    if (!videoId) return;
    currentWatchVideoId = videoId;

    const originalTitle = await fetchOriginalTitle(videoId);
    if (!originalTitle) return;

    // تحديث العنوان في الصفحة (نجرب عدة مرات لأن يوتيوب قد يتأخر في بناء العنصر)
    const updateTitleElement = () => {
        const titleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
        if (titleElement && titleElement.textContent !== originalTitle) {
            titleElement.textContent = originalTitle;
            return true;
        }
        return false;
    };

    // إذا لم ينجح التحديث فوراً، نجرب بعد قليل
    if (!updateTitleElement()) {
        const retryInterval = setInterval(() => {
            if (updateTitleElement() || new URLSearchParams(window.location.search).get('v') !== currentWatchVideoId) {
                clearInterval(retryInterval);
            }
        }, 300);
    }

    // تحديث عنوان التبويب
    if (document.title.includes('YouTube') && !document.title.startsWith(originalTitle)) {
        document.title = `${originalTitle} - YouTube`;
    }
}

// مراقبة الموقع بحثاً عن المقاطع الجديدة أثناء التمرير للأسفل
const domObserver = new MutationObserver(() => {
    scanForVideoCards();
});
domObserver.observe(document.body, { childList: true, subtree: true });

// --- الأهم: الاستماع لأحداث يوتيوب عند الانتقال لمقطع جديد --- //
document.addEventListener('yt-navigate-finish', () => {
    // عند فتح مقطع جديد، قم بتحديث العنوان الرئيسي
    updateWatchPageTitle();
    // وإعادة فحص البطاقات الجانبية
    scanForVideoCards();
});

// التشغيل الأولي
scanForVideoCards();
updateWatchPageTitle();

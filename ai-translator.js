const GEMINI_API_KEY = 'AIzaSyCi1euTKx54HzVb1CVl7RNriN-xnCeXQqo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

class AITranslator {
    static async translate(text, targetLang) {
        try {
            const prompt = `Translate the following text to ${targetLang}:\n${text}`;
            
            const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: 'user',
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        topK: 1,
                        topP: 1,
                        maxOutputTokens: 2048,
                    }
                })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Translation error:', error);
            return null;
        }
    }

    static async translatePage(targetLang) {
        document.body.classList.add('translating');
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'translation-loading';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الترجمة...';
        document.body.appendChild(loadingIndicator);

        try {
            // تحديد العناصر بشكل أكثر دقة
            const elementsToTranslate = [
                ...document.querySelectorAll('[data-translate="true"]'), // العناصر المحددة للترجمة
                ...document.querySelectorAll('h1, h2, h3, p, span, button, a, label, div:not(.translation-loading)') // العناصر الإضافية
            ];
            
            for (const element of elementsToTranslate) {
                // تجاهل العناصر التي تحتوي على عناصر فرعية إلا إذا كانت محددة للترجمة
                if (element.children.length > 0 && !element.hasAttribute('data-translate')) continue;
                
                // تجاهل العناصر التي لا تحتوي على نص
                const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
                if (!originalText) continue;

                // حفظ النص الأصلي إذا لم يتم حفظه مسبقاً
                if (!element.getAttribute('data-original-text')) {
                    element.setAttribute('data-original-text', originalText);
                    element.setAttribute('data-translatable', 'true');
                }

                try {
                    // ترجمة النص مع التعامل مع الأخطاء لكل عنصر بشكل منفصل
                    const translatedText = await this.translate(originalText, targetLang);
                    if (translatedText) {
                        if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
                            // التعامل مع عناصر الإدخال بشكل خاص
                            if (element.getAttribute('placeholder')) {
                                element.setAttribute('placeholder', translatedText);
                            } else {
                                element.value = translatedText;
                            }
                        } else {
                            element.textContent = translatedText;
                        }
                        // إضافة تأثير بصري للعناصر المترجمة
                        element.classList.add('translated');
                        setTimeout(() => element.classList.remove('translated'), 1000);
                    }
                } catch (elementError) {
                    console.error(`Error translating element:`, elementError);
                    continue; // الاستمرار مع العنصر التالي في حالة حدوث خطأ
                }
            }

            localStorage.setItem('selectedLanguage', targetLang);
            
        } catch (error) {
            console.error('Translation error:', error);
            alert('حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.');
        } finally {
            document.body.classList.remove('translating');
            loadingIndicator.remove();
        }
    }

    static restoreOriginalText() {
        const translatedElements = document.querySelectorAll('[data-translatable="true"], [data-translate="true"]');
        translatedElements.forEach(element => {
            const originalText = element.getAttribute('data-original-text');
            if (originalText) {
                if (element.tagName.toLowerCase() === 'input' || element.tagName.toLowerCase() === 'textarea') {
                    if (element.getAttribute('placeholder')) {
                        element.setAttribute('placeholder', originalText);
                    } else {
                        element.value = originalText;
                    }
                } else {
                    element.textContent = originalText;
                }
            }
        });
        localStorage.removeItem('selectedLanguage');
    }

    // إضافة وظيفة لتطبيق الترجمة المحفوظة عند تحميل الصفحة
    static applyStoredTranslation() {
        const storedLanguage = localStorage.getItem('selectedLanguage');
        if (storedLanguage) {
            this.translatePage(storedLanguage);
            // تحديث قائمة اختيار اللغة
            const languageSelect = document.getElementById('language-select');
            if (languageSelect) {
                languageSelect.value = storedLanguage;
            }
        }
    }
}

// إضافة زر الترجمة للصفحة
function addTranslationButton() {
    const button = document.createElement('div');
    button.className = 'translation-button';
    button.innerHTML = '<i class="fas fa-language"></i>';
    button.title = 'ترجمة الصفحة';
    
    const languageMenu = document.createElement('div');
    languageMenu.className = 'language-menu';
    languageMenu.innerHTML = `
        <div class="language-option" data-lang="English">English</div>
        <div class="language-option" data-lang="French">Français</div>
        <div class="language-option" data-lang="Spanish">Español</div>
        <div class="language-option" data-lang="German">Deutsch</div>
        <div class="language-option" data-lang="Arabic">العربية</div>
    `;

    button.appendChild(languageMenu);
    document.body.appendChild(button);

    // معالجة النقر على خيارات اللغة
    languageMenu.addEventListener('click', async (e) => {
        if (e.target.classList.contains('language-option')) {
            const targetLang = e.target.getAttribute('data-lang');
            button.classList.add('loading');
            await AITranslator.translatePage(targetLang);
            button.classList.remove('loading');
        }
    });

    // إظهار/إخفاء قائمة اللغات
    button.addEventListener('click', (e) => {
        if (e.target.closest('.language-menu')) return;
        languageMenu.classList.toggle('show');
    });

    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.translation-button')) {
            languageMenu.classList.remove('show');
        }
    });
}

// تطبيق الترجمة المحفوظة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    addTranslationButton();
    AITranslator.applyStoredTranslation();
});

// تصدير الكلاس للاستخدام في الملفات الأخرى
window.AITranslator = AITranslator;

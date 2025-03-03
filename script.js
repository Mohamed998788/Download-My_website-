// التعرف التلقائي على أبعاد الشاشة
const width = window.innerWidth;
const height = window.innerHeight;

// حساب الحساسية الأساسية (نطاق من 0 إلى 200)
const baseSensitivity = Math.round((width / height) * 100);

// عوامل تصحيح لكل نوع من الحساسيات
let sensitivities = {
    general: Math.min(baseSensitivity + 80, 200),
    redDot: Math.min(baseSensitivity + 70, 200),
    scope2x: Math.min(baseSensitivity + 60, 200),
    scope4x: Math.min(baseSensitivity + 50, 200),
    sniper: Math.min(baseSensitivity + 40, 200),
    freeLook: Math.min(baseSensitivity + 90, 200),
    fireButtonSize: generateFireButtonSize()
};

 // توليد حجم زر الضرب بناءً على اختيار المستخدم
 function generateFireButtonSize() {
    const sizeOption = document.querySelector('input[name="fire-button-size"]:checked').value;
    if (sizeOption === "small") {
        return Math.floor(Math.random() * (30 - 10 + 1)) + 10; // من 10 إلى 30
    } else if (sizeOption === "medium") {
        return Math.floor(Math.random() * (70 - 40 + 1)) + 40; // من 40 إلى 70
    } else if (sizeOption === "large") {
        return Math.floor(Math.random() * (100 - 80 + 1)) + 80; // من 80 إلى 100
    }
}

// توليد حساسية عشوائية بناءً على السرعة المختارة
function generateRandomSensitivity() {
    const speed = document.querySelector('input[name="speed"]:checked').value;

    // تحديد النطاق العشوائي بناءً على السرعة
    let rangeMin, rangeMax;
    if (speed === "fast") {
        rangeMin = 150;
        rangeMax = 200;
    } else if (speed === "medium") {
        rangeMin = 100;
        rangeMax = 180;
    } else if (speed === "slow") {
        rangeMin = 50;
        rangeMax = 150;
    }

    // توليد حساسيات عشوائية ضمن النطاق المحدد
    sensitivities.general = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    sensitivities.redDot = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    sensitivities.scope2x = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    sensitivities.scope4x = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    sensitivities.sniper = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    sensitivities.freeLook = Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
    sensitivities.fireButtonSize = generateFireButtonSize(); // تحديث حجم زر الضرب

    displaySensitivities();
}

// عرض الحساسيات التلقائية
function calculateSensitivity() {
    const speed = document.querySelector('input[name="speed"]:checked').value;

    // تعديل الحساسيات بناءً على السرعة المختارة
    if (speed === "fast") {
        sensitivities.general = Math.min(baseSensitivity + 150, 200); // زيادة الحساسية
        sensitivities.redDot = Math.min(baseSensitivity + 140, 200);
        sensitivities.scope2x = Math.min(baseSensitivity + 130, 200);
        sensitivities.scope4x = Math.min(baseSensitivity + 120, 200);
        sensitivities.sniper = Math.min(baseSensitivity + 110, 200);
        sensitivities.freeLook = Math.min(baseSensitivity + 160, 200);
    } else if (speed === "medium") {
        sensitivities.general = Math.min(baseSensitivity + 120, 200);
        sensitivities.redDot = Math.min(baseSensitivity + 110, 200);
        sensitivities.scope2x = Math.min(baseSensitivity + 100, 200);
        sensitivities.scope4x = Math.min(baseSensitivity + 90, 200);
        sensitivities.sniper = Math.min(baseSensitivity + 80, 200);
        sensitivities.freeLook = Math.min(baseSensitivity + 130, 200);
    } else if (speed === "slow") {
        sensitivities.general = Math.min(baseSensitivity + 90, 200);
        sensitivities.redDot = Math.min(baseSensitivity + 80, 200);
        sensitivities.scope2x = Math.min(baseSensitivity + 70, 200);
        sensitivities.scope4x = Math.min(baseSensitivity + 60, 200);
        sensitivities.sniper = Math.min(baseSensitivity + 50, 200);
        sensitivities.freeLook = Math.min(baseSensitivity + 100, 200);
    }

    sensitivities.fireButtonSize = generateFireButtonSize(); // تحديث حجم زر الضرب
    displaySensitivities();

    // تحويل الزر إلى "توليد حساسية أخرى" بعد الضغط لأول مرة
    const generateSensitivityButton = document.getElementById('generate-sensitivity-button');
    generateSensitivityButton.textContent = "توليد حساسية أخرى";
    generateSensitivityButton.onclick = generateRandomSensitivity;
}

// عرض الحساسيات في الجدول
function displaySensitivities() {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <div>حساسية عامة: ${sensitivities.general}</div>
        <div>حساسية النقطة الحمراء: ${sensitivities.redDot}</div>
        <div>حساسية سكوب 2x: ${sensitivities.scope2x}</div>
        <div>حساسية سكوب 4x: ${sensitivities.scope4x}</div>
        <div>حساسية القناصة: ${sensitivities.sniper}</div>
        <div>حساسية النظر الحر: ${sensitivities.freeLook}</div>
        <div>حجم زر الضرب: ${sensitivities.fireButtonSize}</div>
        <div class="action-buttons">
            <button onclick="shareSensitivity()"><i class="fas fa-share"></i> مشاركة</button>
            <button onclick="saveSettings()"><i class="fas fa-save"></i> حفظ</button>
        </div>
    `;
}

// مشاركة الحساسية كنص
function shareSensitivity() {
    const sensitivityText = `
        حساسية عامة: ${sensitivities.general}
        حساسية النقطة الحمراء: ${sensitivities.redDot}
        حساسية سكوب 2x: ${sensitivities.scope2x}
        حساسية سكوب 4x: ${sensitivities.scope4x}
        حساسية القناصة: ${sensitivities.sniper}
        حساسية النظر الحر: ${sensitivities.freeLook}
        حجم زر الضرب: ${sensitivities.fireButtonSize}
    `;

    if (navigator.share) {
        navigator.share({
            title: 'حساسيات Free Fire',
            text: sensitivityText,
        }).then(() => {
            console.log('تمت المشاركة بنجاح!');
        }).catch((error) => {
            console.error('حدث خطأ أثناء المشاركة:', error);
        });
    } else {
        // إذا لم يكن `navigator.share` مدعومًا، نستخدم `navigator.clipboard.writeText` لنسخ النص
        navigator.clipboard.writeText(sensitivityText).then(() => {
            alert("تم نسخ الحساسية إلى الحافظة!");
        }).catch(() => {
            alert("حدث خطأ أثناء نسخ الحساسية!");
        });
    }
}

// توليد إعدادات الجرافيك
function generateGraphicsSettings() {
    const ram = navigator.deviceMemory || 4; // الرام (بالجيجابايت)
    const processorCores = navigator.hardwareConcurrency || 4; // عدد أنوية المعالج
    const storage = navigator.storage.estimate().then(estimate => {
        return (estimate.quota / (1024 * 1024 * 1024)).toFixed(2); // المساحة (بالجيجابايت)
    });

    let graphicsLevel;
    if (ram >= 8 && processorCores >= 4) {
        graphicsLevel = "فائقة";
    } else if (ram >= 4 && processorCores >= 2) {
        graphicsLevel = "عالية";
    } else if (ram >= 2 && processorCores >= 1) {
        graphicsLevel = "متوسطة";
    } else {
        graphicsLevel = "منخفضة";
    }

    let fpsLevel;
    if (ram < 2 || processorCores < 2) {
        fpsLevel = "منخفضة";
    } else if (ram >= 2 && ram < 4 && processorCores >= 2) {
        fpsLevel = "محسنة";
    } else if (ram >= 4 && processorCores >= 4) {
        fpsLevel = "مرتفعة";
    }

    storage.then(storageSize => {
        const graphicsResult = document.getElementById('graphics-result');
        graphicsResult.innerHTML = `
            <div>الرام: ${ram} جيجابايت</div>
            <div>أنوية المعالج: ${processorCores}</div>
            <div>المساحة: ${storageSize} جيجابايت</div>
            <div>إعدادات الجرافيك: ${graphicsLevel}</div>
            <div>إعدادات الإطارات (FPS): ${fpsLevel}</div>
        `;
    }).catch(() => {
        alert("حدث خطأ أثناء توليد إعدادات الجرافيك!");
    });
}

// حفظ الإعدادات (الحساسية، حجم زر الضرب، إعدادات الجرافيك)
let savedSettings = JSON.parse(localStorage.getItem('savedSettings')) || [];
function saveSettings() {
    const graphicsSettings = document.getElementById('graphics-result').innerText;

    const settings = {
        sensitivities: { ...sensitivities },
        graphicsSettings: graphicsSettings,
        date: new Date().toLocaleString()
    };
    savedSettings.push(settings);
    localStorage.setItem('savedSettings', JSON.stringify(savedSettings));
    updateSavedSettings();
    alert("تم حفظ الإعدادات بنجاح!");
}

// حذف الإعدادات
function deleteSettings(index) {
    const listItem = document.querySelector(`#saved-sensitivities-list li:nth-child(${index + 1})`);
    listItem.classList.add('fade-out');
    setTimeout(() => {
        savedSettings.splice(index, 1);
        localStorage.setItem('savedSettings', JSON.stringify(savedSettings));
        updateSavedSettings();
    }, 500); // الانتظار حتى تنتهي الرسوم المتحركة
}

// تحديث الإعدادات المحفوظة
function updateSavedSettings() {
    const savedSensitivitiesList = document.getElementById('saved-sensitivities-list');
    savedSensitivitiesList.innerHTML = savedSettings.map((settings, index) => `
        <li>
            <strong>الإعدادات ${index + 1}:</strong>
            <div>حساسية عامة: ${settings.sensitivities.general}</div>
            <div>حساسية النقطة الحمراء: ${settings.sensitivities.redDot}</div>
            <div>حساسية سكوب 2x: ${settings.sensitivities.scope2x}</div>
            <div>حساسية سكوب 4x: ${settings.sensitivities.scope4x}</div>
            <div>حساسية القناصة: ${settings.sensitivities.sniper}</div>
            <div>حساسية النظر الحر: ${settings.sensitivities.freeLook}</div>
            <div>حجم زر الضرب: ${settings.sensitivities.fireButtonSize}</div>
            <div>إعدادات الجرافيك: ${settings.graphicsSettings}</div>
            <div>التاريخ: ${settings.date}</div>
            <button onclick="deleteSettings(${index})">حذف</button>
        </li>
    `).join('');
}

// إظهار الصفحة المحددة
function showPage(pageId) {
    document.querySelectorAll('.container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';

    // تحديث الأيقونة النشطة في شريط التنقل
    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.navbar a[href="#${pageId}"]`).classList.add('active');
}

// تفعيل الوضع الليلي
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// تطبيق لون الثيم تلقائيًا
function applyThemeColor() {
    const color = document.getElementById('theme-color').value;
    document.body.style.background = color;
    localStorage.setItem('themeColor', color);
}

// إعادة تعيين لون الثيم إلى اللون الافتراضي
function resetThemeColor() {
    const defaultColor = '#1e3c72';
    document.body.style.background = defaultColor;
    document.getElementById('theme-color').value = defaultColor;
    localStorage.setItem('themeColor', defaultColor);
}

// تغيير حجم الخط
document.getElementById('font-size').addEventListener('input', function() {
    const fontSize = this.value + 'px';
    document.body.style.fontSize = fontSize;
    document.getElementById('font-size-value').textContent = fontSize;
    localStorage.setItem('fontSize', fontSize);
});

// تغيير اللغة
const languageSelect = document.getElementById('language-select');
languageSelect.addEventListener('change', function() {
    const language = this.value;
    localStorage.setItem('selectedLanguage', language);
    updateTexts(language);
});

// تحديث النصوص بناءً على اللغة المختارة
function updateTexts(language) {
    const translations = {
        ar: {
            homeTitle: "RED SETTINGS - Free Fire",
            speedLabel: "سرعة الحساسية",
            fireButtonSizeLabel: "حجم زر الضرب",
            generateSensitivity: "توليد الحساسيات التلقائية",
            generateRandomSensitivity: "توليد حساسية أخرى",
            saveSettings: "حفظ الإعدادات",
            settingsTitle: "الإعدادات",
            fontSizeLabel: "تغيير حجم الخط",
            languageLabel: "تغيير اللغة",
            themeLabel: "تغيير الثيم",
            savedSensitivitiesTitle: "الإعدادات المحفوظة",
            contactTitle: "تواصل معنا",
            supportLabel: "الدعم الفني",
            socialMediaLabel: "وسائل التواصل الاجتماعي"
        },
        en: {
            homeTitle: "RED SETTINGS - Free Fire",
            speedLabel: "Sensitivity Speed",
            fireButtonSizeLabel: "Fire Button Size",
            generateSensitivity: "Generate Automatic Sensitivity",
            generateRandomSensitivity: "Generate Another Sensitivity",
            saveSettings: "Save Settings",
            settingsTitle: "Settings",
            fontSizeLabel: "Change Font Size",
            languageLabel: "Change Language",
            themeLabel: "Change Theme",
            savedSensitivitiesTitle: "Saved Settings",
            contactTitle: "Contact Us",
            supportLabel: "Technical Support",
            socialMediaLabel: "Social Media"
        },
        es: {
            homeTitle: "RED SETTINGS - Free Fire",
            speedLabel: "Velocidad de Sensibilidad",
            fireButtonSizeLabel: "Tamaño del Botón de Disparo",
            generateSensitivity: "Generar Sensibilidad Automática",
            generateRandomSensitivity: "Generar Otra Sensibilidad",
            saveSettings: "Guardar Configuración",
            settingsTitle: "Configuración",
            fontSizeLabel: "Cambiar Tamaño de Fuente",
            languageLabel: "Cambiar Idioma",
            themeLabel: "Cambiar Tema",
            savedSensitivitiesTitle: "Configuraciones Guardadas",
            contactTitle: "Contáctenos",
            supportLabel: "Soporte Técnico",
            socialMediaLabel: "Redes Sociales"
        },
        it: {
            homeTitle: "RED SETTINGS - Free Fire",
            speedLabel: "Velocità di Sensibilità",
            fireButtonSizeLabel: "Dimensione del Pulsante di Fuoco",
            generateSensitivity: "Genera Sensibilità Automatica",
            generateRandomSensitivity: "Genera un'Altra Sensibilità",
            saveSettings: "Salva Impostazioni",
            settingsTitle: "Impostazioni",
            fontSizeLabel: "Cambia Dimensione del Carattere",
            languageLabel: "Cambia Lingua",
            themeLabel: "Cambia Tema",
            savedSensitivitiesTitle: "Impostazioni Salvate",
            contactTitle: "Contattaci",
            supportLabel: "Supporto Tecnico",
            socialMediaLabel: "Social Media"
        },
        pt: {
            homeTitle: "RED SETTINGS - Free Fire",
            speedLabel: "Velocidade de Sensibilidade",
            fireButtonSizeLabel: "Tamanho do Botão de Tiro",
            generateSensitivity: "Gerar Sensibilidade Automática",
            generateRandomSensitivity: "Gerar Outra Sensibilidade",
            saveSettings: "Salvar Configurações",
            settingsTitle: "Configurações",
            fontSizeLabel: "Alterar Tamanho da Fonte",
            languageLabel: "Alterar Idioma",
            themeLabel: "Alterar Tema",
            savedSensitivitiesTitle: "Configurações Salvas",
            contactTitle: "Contate-nos",
            supportLabel: "Suporte Técnico",
            socialMediaLabel: "Redes Sociais"
        }
    };

    const texts = translations[language];
    document.querySelector('h1').textContent = texts.homeTitle;
    document.querySelector('#home h2:nth-of-type(1)').textContent = texts.speedLabel;
    document.querySelector('#home h2:nth-of-type(2)').textContent = texts.fireButtonSizeLabel;
    document.querySelector('#home button:nth-of-type(1)').textContent = texts.generateSensitivity;
    document.querySelector('#home button:nth-of-type(2)').textContent = texts.generateRandomSensitivity;
    document.querySelector('#settings h1').textContent = texts.settingsTitle;
    document.querySelector('#settings h2:nth-of-type(1)').textContent = texts.fontSizeLabel;
    document.querySelector('#settings h2:nth-of-type(2)').textContent = texts.languageLabel;
    document.querySelector('#settings h2:nth-of-type(3)').textContent = texts.themeLabel;
    document.querySelector('#saved-sensitivities h1').textContent = texts.savedSensitivitiesTitle;
    document.querySelector('#contact h1').textContent = texts.contactTitle;
    document.querySelector('#contact h2:nth-of-type(1)').textContent = texts.supportLabel;
    document.querySelector('#contact h2:nth-of-type(2)').textContent = texts.socialMediaLabel;

    // تحديث النصوص الديناميكية مثل الجدول الخاص بالحساسية
    const resultDiv = document.getElementById('result');
    if (resultDiv.innerHTML) {
        resultDiv.innerHTML = `
            <div>${texts.generalSensitivity}: ${sensitivities.general}</div>
            <div>${texts.redDotSensitivity}: ${sensitivities.redDot}</div>
            <div>${texts.scope2xSensitivity}: ${sensitivities.scope2x}</div>
            <div>${texts.scope4xSensitivity}: ${sensitivities.scope4x}</div>
            <div>${texts.sniperSensitivity}: ${sensitivities.sniper}</div>
            <div>${texts.freeLookSensitivity}: ${sensitivities.freeLook}</div>
            <div>${texts.fireButtonSize}: ${sensitivities.fireButtonSize}</div>
            <div class="action-buttons">
                <button onclick="shareSensitivity()"><i class="fas fa-share"></i> ${texts.share}</button>
                <button onclick="saveSettings()"><i class="fas fa-save"></i> ${texts.saveSettings}</button>
            </div>
        `;
    }
}

// تحميل الإعدادات المحفوظة عند التحميل
function loadSettings() {
    // تحميل حجم الخط
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.body.style.fontSize = savedFontSize;
        document.getElementById('font-size').value = parseInt(savedFontSize);
        document.getElementById('font-size-value').textContent = savedFontSize;
    }

    // تحميل الوضع الليلي
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    // تحميل لون الثيم
    const savedThemeColor = localStorage.getItem('themeColor');
    if (savedThemeColor) {
        document.body.style.background = savedThemeColor;
        document.getElementById('theme-color').value = savedThemeColor;
    }
}

// تحميل اللغة المختارة عند التحميل
const selectedLanguage = localStorage.getItem('selectedLanguage') || 'ar';
document.getElementById('language-select').value = selectedLanguage;
updateTexts(selectedLanguage);

// إظهار الصفحة الرئيسية عند التحميل
showPage('home');

// تحديث الإعدادات المحفوظة عند التحميل
updateSavedSettings();

// تحميل الإعدادات عند التحميل
loadSettings();

// تطبيق لون الثيم تلقائيًا عند تغيير اللون
document.getElementById('theme-color').addEventListener('input', function() {
    applyThemeColor();
});

// تبديل الأسئلة الشائعة
function toggleFAQ(item) {
    item.classList.toggle('active');
}

// إعادة تعيين زر توليد الحساسيات عند تغيير الوضع أو حجم زر الضرب
document.querySelectorAll('input[name="speed"], input[name="fire-button-size"]').forEach(input => {
    input.addEventListener('change', () => {
        const generateSensitivityButton = document.getElementById('generate-sensitivity-button');
        generateSensitivityButton.textContent = "توليد الحساسيات التلقائية";
        generateSensitivityButton.onclick = calculateSensitivity;
    });
});

// تبديل شريط التنقل الإضافي
function toggleExtraNavbar() {
    const extraNavbar = document.getElementById('extraNavbar');
    extraNavbar.style.display = extraNavbar.style.display === 'block' ? 'none' : 'block';
}

// إغلاق شريط التنقل الإضافي عند النقر خارجها
window.addEventListener('click', function(event) {
    const extraNavbar = document.getElementById('extraNavbar');
    if (event.target !== document.querySelector('.navbar a[href="#more"]') && !extraNavbar.contains(event.target)) {
        extraNavbar.style.display = 'none';
    }
});

// إظهار صفحة تحميل التطبيق
function showAppDownloadPopup() {
    const appDownloadPopup = document.getElementById('appDownloadPopup');
    appDownloadPopup.style.display = 'block';
}

// إغلاق صفحة تحميل التطبيق
function closeAppDownloadPopup() {
    const appDownloadPopup = document.getElementById('appDownloadPopup');
    appDownloadPopup.style.display = 'none';
}

// إظهار رسالة "هذه الصفحة مازالت تحت التطوير"
function showUnderDevelopmentMessage() {
    alert("هذه الصفحة مازالت تحت التطوير!");
}

// إظهار صفحة الدردشة
function showChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'block';
}

// إغلاق صفحة الدردشة
function closeChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'none';
}

// إظهار رسالة "هذه الصفحة مازالت تحت التطوير"
function showUnderDevelopmentMessage() {
    alert("هذه الصفحة مازالت تحت التطوير!");
}

// إظهار صفحة الدردشة
function showChat() {
    showUnderDevelopmentMessage();
}

// إغلاق صفحة الدردشة
function closeChat() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'none';
}

// إرسال رسالة في الدردشة
function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');

    if (chatInput.value.trim() !== "") {
        const userMessage = document.createElement('div');
        userMessage.className = 'message user';
        userMessage.textContent = chatInput.value;
        chatBox.appendChild(userMessage);

        // إضافة رد الذكاء الاصطناعي
        const botMessage = document.createElement('div');
        botMessage.className = 'message bot';
        botMessage.textContent = "شكرًا على رسالتك! كيف يمكنني مساعدتك؟";
        chatBox.appendChild(botMessage);

        // مسح حقل الإدخال
        chatInput.value = '';

        // التمرير إلى الأسفل لعرض الرسالة الجديدة
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
// Initialize when document loads
document.addEventListener('DOMContentLoaded', function() {
    // تحميل اللغة المختارة عند التحميل
    const selectedLanguage = localStorage.getItem('selectedLanguage') || 'ar';
    document.getElementById('language-select').value = selectedLanguage;
    updateTexts(selectedLanguage);

    // إظهار الصفحة الرئيسية عند التحميل
    showPage('home');

    // تحديث الإعدادات المحفوظة عند التحميل
    updateSavedSettings();

    // تحميل الإعدادات عند التحميل
    loadSettings();
});

// إضافة تأثيرات حركية للإعدادات
document.querySelectorAll('.settings-section').forEach(section => {
    section.addEventListener('mouseenter', () => {
        section.style.transform = 'translateY(-5px)';
    });
    
    section.addEventListener('mouseleave', () => {
        section.style.transform = 'translateY(0)';
    });
});

// تحسين تجربة تغيير حجم الخط
document.getElementById('font-size').addEventListener('input', function() {
    const size = this.value;
    const display = document.getElementById('font-size-value');
    display.textContent = `${size}px`;
    display.style.fontSize = `${size}px`;
    document.body.style.fontSize = `${size}px`;
    
    // تأثير نبض عند تغيير الحجم
    display.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
        display.style.animation = '';
    }, 300);
});

// تحسين تجربة تغيير اللون
document.getElementById('theme-color').addEventListener('input', function() {
    const color = this.value;
    document.body.style.background = `linear-gradient(135deg, ${color}, ${adjustColor(color, 20)})`;
    localStorage.setItem('themeColor', color);
});

// دالة لتعديل درجة لون معين
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => 
        ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2)
    );
}

// دالة إضافة إعدادات اللاعب
async function addPlayerSettings() {
    if (!currentUser) {
        alert("يرجى تسجيل الدخول أولاً");
        showPage('auth');
        return;
    }
    
    const playerName = document.getElementById('player-name').value;
    const deviceName = document.getElementById('device-name').value;
    const generalSens = document.getElementById('general-sens').value;
    const redDotSens = document.getElementById('red-dot-sens').value;
    const scope2xSens = document.getElementById('2x-scope-sens').value;
    const scope4xSens = document.getElementById('4x-scope-sens').value;
    const sniperSens = document.getElementById('sniper-sens').value;
    const freeLookSens = document.getElementById('free-look-sens').value;

    if (!playerName || !deviceName || !generalSens || !redDotSens || 
        !scope2xSens || !scope4xSens || !sniperSens || !freeLookSens) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    try {
        await addDoc(collection(db, "playerSettings"), {
            userId: currentUser.id,
            playerName: playerName,
            deviceName: deviceName,
            settings: {
                general: Number(generalSens),
                redDot: Number(redDotSens),
                scope2x: Number(scope2xSens),
                scope4x: Number(scope4xSens),
                sniper: Number(sniperSens),
                freeLook: Number(freeLookSens)
            },
            comments: [],
            timestamp: new Date().toISOString()
        });

        alert('تم نشر الإعدادات بنجاح');
        clearForm();
        showAllSettings();
    } catch (error) {
        console.error("Error adding settings: ", error);
        alert('حدث خطأ أثناء نشر الإعدادات');
    }
}

// دالة تحميل إعدادات اللاعبين
async function loadPlayerSettings() {
    const settingsContainer = document.getElementById('settings-container');
    settingsContainer.innerHTML = '<div class="loading">جاري التحميل...</div>';

    try {
        const q = query(collection(db, "playerSettings"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        let settingsHTML = '';
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            settingsHTML += createSettingCard(doc.id, data);
        });

        settingsContainer.innerHTML = settingsHTML || '<div class="no-settings">لا توجد إعدادات منشورة</div>';
    } catch (error) {
        console.error("Error loading settings: ", error);
        settingsContainer.innerHTML = '<div class="error">حدث خطأ أثناء تحميل الإعدادات</div>';
    }
}

// دالة مسح النموذج
function clearForm() {
    document.getElementById('player-name').value = '';
    document.getElementById('device-name').value = '';
    document.getElementById('general-sens').value = '';
    document.getElementById('red-dot-sens').value = '';
    document.getElementById('2x-scope-sens').value = '';
    document.getElementById('4x-scope-sens').value = '';
    document.getElementById('sniper-sens').value = '';
    document.getElementById('free-look-sens').value = '';
}

// تحميل إعدادات اللاعبين عند فتح الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerSettings();
});

// المتغيرات العامة
let currentUserId = Date.now().toString(); // يمكن استبداله بنظام تسجيل الدخول لاحقاً

// دالة إظهار نموذج إضافة الإعدادات
function showAddSettingsForm() {
    document.getElementById('add-settings-form').style.display = 'block';
    document.getElementById('all-settings-list').style.display = 'none';
    document.getElementById('my-settings-list').style.display = 'none';
    
    // تحديث الأزرار النشطة
    updateActiveTab('add');
}

// دالة إظهار جميع الإعدادات
function showAllSettings() {
    document.getElementById('add-settings-form').style.display = 'none';
    document.getElementById('all-settings-list').style.display = 'block';
    document.getElementById('my-settings-list').style.display = 'none';
    
    loadPlayerSettings();
    updateActiveTab('all');
}

// دالة إظهار إعداداتي
function showMySettings() {
    document.getElementById('add-settings-form').style.display = 'none';
    document.getElementById('all-settings-list').style.display = 'none';
    document.getElementById('my-settings-list').style.display = 'block';
    
    loadMySettings();
    updateActiveTab('my');
}

// تحديث الزر النشط
function updateActiveTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    const tabMap = { 'all': 0, 'my': 1, 'add': 2 };
    document.querySelectorAll('.tab-btn')[tabMap[tab]].classList.add('active');
}

// دالة إضافة إعدادات اللاعب
async function addPlayerSettings() {
    if (!currentUser) {
        alert("يرجى تسجيل الدخول أولاً");
        showPage('auth');
        return;
    }
    
    const playerName = document.getElementById('player-name').value;
    const deviceName = document.getElementById('device-name').value;
    const generalSens = document.getElementById('general-sens').value;
    const redDotSens = document.getElementById('red-dot-sens').value;
    const scope2xSens = document.getElementById('2x-scope-sens').value;
    const scope4xSens = document.getElementById('4x-scope-sens').value;
    const sniperSens = document.getElementById('sniper-sens').value;
    const freeLookSens = document.getElementById('free-look-sens').value;

    if (!playerName || !deviceName || !generalSens || !redDotSens || 
        !scope2xSens || !scope4xSens || !sniperSens || !freeLookSens) {
        alert('يرجى ملء جميع الحقول');
        return;
    }

    try {
        await addDoc(collection(db, "playerSettings"), {
            userId: currentUser.id,
            playerName: playerName,
            deviceName: deviceName,
            settings: {
                general: Number(generalSens),
                redDot: Number(redDotSens),
                scope2x: Number(scope2xSens),
                scope4x: Number(scope4xSens),
                sniper: Number(sniperSens),
                freeLook: Number(freeLookSens)
            },
            comments: [],
            timestamp: new Date().toISOString()
        });

        alert('تم نشر الإعدادات بنجاح');
        clearForm();
        showAllSettings();
    } catch (error) {
        console.error("Error adding settings: ", error);
        alert('حدث خطأ أثناء نشر الإعدادات');
    }
}

// دالة إضافة تعليق
async function addComment(settingId) {
    const commentText = document.getElementById(`comment-${settingId}`).value;
    if (!commentText.trim()) return;

    try {
        const settingRef = doc(db, "playerSettings", settingId);
        const settingDoc = await getDoc(settingRef);
        
        if (settingDoc.exists()) {
            const comments = settingDoc.data().comments || [];
            comments.push({
                userId: currentUser.id,
                text: commentText,
                timestamp: new Date().toISOString()
            });
            
            await updateDoc(settingRef, { comments: comments });
            
            document.getElementById(`comment-${settingId}`).value = '';
            loadPlayerSettings();
        }
    } catch (error) {
        console.error("Error adding comment: ", error);
        alert('حدث خطأ أثناء إضافة التعليق');
    }
}

// دالة حذف الإعدادات
async function deleteSettings(settingId) {
    if (!confirm('هل أنت متأكد من حذف هذه الإعدادات؟')) return;

    try {
        await deleteDoc(doc(db, "playerSettings", settingId));
        loadPlayerSettings();
        loadMySettings();
    } catch (error) {
        console.error("Error deleting settings: ", error);
        alert('حدث خطأ أثناء حذف الإعدادات');
    }
}

// دالة تحميل إعداداتي
async function loadMySettings() {
    if (!currentUser) {
        alert("يرجى تسجيل الدخول أولاً");
        showPage('auth');
        return;
    }

    const mySettingsContainer = document.getElementById('my-settings-container');
    mySettingsContainer.innerHTML = '<div class="loading">جاري التحميل...</div>';

    try {
        const q = query(
            collection(db, "playerSettings"), 
            where("userId", "==", currentUser.id),
            orderBy("timestamp", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        let settingsHTML = '';
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            settingsHTML += createSettingCard(doc.id, data, true);
        });

        mySettingsContainer.innerHTML = settingsHTML || '<div class="no-settings">لم تقم بنشر أي إعدادات بعد</div>';
    } catch (error) {
        console.error("Error loading settings: ", error);
        mySettingsContainer.innerHTML = '<div class="error">حدث خطأ أثناء تحميل الإعدادات</div>';
    }
}

// دالة إنشاء بطاقة الإعدادات
function createSettingCard(id, data, isOwner = false) {
    const comments = data.comments || [];
    const isOwnerClass = isOwner ? 'owner-settings' : '';
    
    return `
        <div class="player-settings-card ${isOwnerClass}" id="setting-${id}">
            <div class="player-info">
                <h3>${data.playerName}</h3>
                <p>الجهاز: ${data.deviceName}</p>
                ${isOwner ? `
                    <div class="settings-actions">
                        <button onclick="editSettings('${id}')">تعديل</button>
                        <button onclick="deleteSettings('${id}')">حذف</button>
                    </div>
                ` : ''}
            </div>
            <div class="sensitivity-info">
                <p>حساسية العام: ${data.settings.general}</p>
                <p>حساسية النقطة الحمراء: ${data.settings.redDot}</p>
                <p>حساسية منظار 2: ${data.settings.scope2x}</p>
                <p>حساسية منظار 4: ${data.settings.scope4x}</p>
                <p>حساسية القناصة: ${data.settings.sniper}</p>
                <p>حساسية النظرة الحرة: ${data.settings.freeLook}</p>
            </div>
            <div class="comments-section">
                <h4>التعليقات (${comments.length})</h4>
                <div class="comments-list">
                    ${comments.map(comment => `
                        <div class="comment">
                            <p>${comment.text}</p>
                            <small>${new Date(comment.timestamp).toLocaleString('ar-EG')}</small>
                        </div>
                    `).join('')}
                </div>
                <div class="add-comment">
                    <input type="text" id="comment-${id}" placeholder="أضف تعليقاً...">
                    <button onclick="addComment('${id}')">إرسال</button>
                </div>
            </div>
            <div class="timestamp">
                ${new Date(data.timestamp).toLocaleString('ar-EG')}
            </div>
        </div>
    `;
}

// المتغيرات العامة
let currentUser = null;

// دوال تسجيل الدخول
function showLoginForm() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.auth-tab-btn')[0].classList.add('active');
    document.querySelectorAll('.auth-tab-btn')[1].classList.remove('active');
}

function showRegisterForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    document.querySelectorAll('.auth-tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.auth-tab-btn')[1].classList.add('active');
}

async function loginUser() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    try {
        // التحقق من وجود المستخدم في Firestore
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("اسم المستخدم غير موجود");
            return;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        if (userData.password !== password) {
            alert("كلمة المرور غير صحيحة");
            return;
        }

        // تسجيل الدخول بنجاح
        currentUser = {
            id: userDoc.id,
            username: userData.username,
            phone: userData.phone
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // إخفاء صفحة تسجيل الدخول وإظهار الصفحة الرئيسية
        document.getElementById('auth').style.display = 'none';
        showPage('home');
        
    } catch (error) {
        console.error("Error logging in: ", error);
        alert("حدث خطأ أثناء تسجيل الدخول");
    }
}

async function registerUser() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const phone = document.getElementById('register-phone').value;

    try {
        // التحقق من عدم وجود المستخدم مسبقاً
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("اسم المستخدم موجود بالفعل");
            return;
        }

        // إنشاء المستخدم في Firestore
        const userDoc = await addDoc(collection(db, "users"), {
            username: username,
            password: password,
            phone: phone,
            createdAt: new Date().toISOString()
        });

        // تسجيل الدخول تلقائياً
        currentUser = {
            id: userDoc.id,
            username: username,
            phone: phone
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // إخفاء صفحة تسجيل الدخول وإظهار الصفحة الرئيسية
        document.getElementById('auth').style.display = 'none';
        showPage('home');

    } catch (error) {
        console.error("Error registering user: ", error);
        alert("حدث خطأ أثناء إنشاء الحساب");
    }
}

// تحقق من تسجيل الدخول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('auth').style.display = 'none';
        showPage('home');
    }
});

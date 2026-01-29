// ============================================
// Legacy Script - للتوافق مع الإصدارات القديمة
// ============================================
// هذا الملف للتوافق فقط - استخدم sensitivity-engine.js للمشاريع الجديدة

console.warn('⚠️ تحذير: script.js قديم - استخدم sensitivity-engine.js بدلاً منه');

// إعادة توجيه إلى المحرك الجديد إذا كان متاحاً
if (typeof window.sensitivityEngine !== 'undefined') {
    console.log('✅ تم اكتشاف المحرك الجديد - سيتم استخدامه تلقائياً');
    
    // دالة توافق للكود القديم
    window.generateRandomSensitivity = function() {
        const speed = document.querySelector('input[name="speed"]:checked')?.value || 'medium';
        const fireSize = document.querySelector('input[name="fire-button-size"]:checked')?.value || 'medium';
        
        const result = window.sensitivityEngine.generateSensitivity(speed, fireSize);
        displaySensitivities(result.sensitivities);
    };
    
    window.calculateSensitivity = function() {
        window.generateRandomSensitivity();
    };
    
    function displaySensitivities(sensitivities) {
        const resultDiv = document.getElementById('result');
        if (!resultDiv) return;
        
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
    
    window.shareSensitivity = function() {
        if (!window.sensitivityEngine) return;
        
        const result = window.sensitivityEngine.generateSensitivity('medium', 'medium');
        const text = window.sensitivityEngine.shareSensitivity(result.sensitivities);
        
        if (navigator.share) {
            navigator.share({
                title: 'حساسيات Free Fire',
                text: text,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert("تم نسخ الحساسية إلى الحافظة!");
            }).catch(() => {
                alert("حدث خطأ أثناء نسخ الحساسية!");
            });
        }
    };
    
    window.generateGraphicsSettings = function() {
        if (!window.sensitivityEngine) return;
        
        const graphics = window.sensitivityEngine.getGraphicsRecommendations();
        const resultDiv = document.getElementById('graphics-result');
        if (!resultDiv) return;
        
        resultDiv.innerHTML = `
            <div><span>مستوى الجرافيك:</span> <span>${graphics.graphicsLevel}</span></div>
            <div><span>معدل الإطارات:</span> <span>${graphics.fpsTarget}</span></div>
            <div><span>جودة الظلال:</span> <span>${graphics.shadowQuality}</span></div>
            <div><span>Anti-Aliasing:</span> <span>${graphics.antiAliasing}</span></div>
            <div><span>جودة الملمس:</span> <span>${graphics.textureQuality}</span></div>
            <div><span>مسافة الرؤية:</span> <span>${graphics.viewDistance}</span></div>
        `;
    };
    
} else {
    console.error('❌ المحرك الجديد غير متاح - يرجى تضمين sensitivity-engine.js');
    console.log('💡 أضف هذا السطر في HTML:');
    console.log('<script type="module" src="src/utils/sensitivity-engine.js"></script>');
}

// رسالة للمطورين
console.log(`
╔════════════════════════════════════════════════════════════╗
║                   RED SETTINGS v3.0                        ║
╠════════════════════════════════════════════════════════════╣
║  📌 هذا الملف (script.js) قديم وللتوافق فقط              ║
║                                                            ║
║  ✅ للمشاريع الجديدة، استخدم:                            ║
║     • src/utils/sensitivity-engine.js                      ║
║     • src/utils/emulator-profiles.js                       ║
║     • src/utils/sensitivity-validator.js                   ║
║                                                            ║
║  📚 راجع README.md للتوثيق الكامل                         ║
║  🧪 افتح test-engine.html للاختبار                        ║
╚════════════════════════════════════════════════════════════╝
`);

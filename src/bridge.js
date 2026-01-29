// ============================================
// Bridge - ربط المحرك الجديد مع index.html
// ============================================

import { sensitivityEngine } from './utils/sensitivity-engine.js';
import { getGraphicsEngine } from './utils/graphics-engine.js';

// جعل المحركات متاحة عالمياً
window.sensitivityEngine = sensitivityEngine;
window.graphicsEngine = getGraphicsEngine();

// ============================================
// Free Fire
// ============================================
window.generateFreeFireSensitivity = function() {
    try {
        // الحصول على القيم من radio buttons
        const speedRadio = document.querySelector('input[name="ff-speed"]:checked');
        const fireSizeRadio = document.querySelector('input[name="ff-fire"]:checked');
        
        const speed = speedRadio ? speedRadio.value : 'medium';
        const fireSize = fireSizeRadio ? fireSizeRadio.value : 'medium';
        
        console.log('🎮 Free Fire - Speed:', speed, 'Fire Size:', fireSize);
        
        // توليد الحساسية
        const result = sensitivityEngine.generateSensitivity(speed, fireSize);
        
        // عرض النتائج
        displayFreeFireResults(result.sensitivities, speed);
        
        console.log('✅ تم توليد الحساسية بنجاح:', result);
    } catch (error) {
        console.error('❌ خطأ في توليد الحساسية:', error);
        alert('حدث خطأ في توليد الحساسية. يرجى المحاولة مرة أخرى.');
    }
};

function displayFreeFireResults(sensitivities, playStyle) {
    const resultsContainer = document.getElementById('ff-sensitivity-results');
    if (!resultsContainer) {
        console.error('❌ عنصر النتائج غير موجود');
        return;
    }

    const colors = {
        general: '#007AFF',
        redDot: '#FF3B30',
        scope2x: '#34C759',
        scope4x: '#FF9500',
        sniper: '#AF52DE',
        freeLook: '#5AC8FA',
        fireButtonSize: '#FF2D55'
    };

    const labels = {
        general: 'حساسية عامة',
        redDot: 'النقطة الحمراء',
        scope2x: 'سكوب 2x',
        scope4x: 'سكوب 4x',
        sniper: 'القناصة',
        freeLook: 'النظر الحر',
        fireButtonSize: 'زر الضرب'
    };

    const icons = {
        general: 'fa-crosshairs',
        redDot: 'fa-dot-circle',
        scope2x: 'fa-search-plus',
        scope4x: 'fa-search',
        sniper: 'fa-bullseye',
        freeLook: 'fa-eye',
        fireButtonSize: 'fa-hand-pointer'
    };

    let html = `
        <div class="ios-card" style="animation: fadeIn 0.5s ease; margin-top: 20px;">
            <h3 style="margin-bottom: 15px; color: #28a745;">
                <i class="fas fa-check-circle"></i> نتائج Free Fire
            </h3>
    `;

    html += '<div style="display: grid; gap: 12px;">';

    // عرض الحساسيات الرئيسية (بدون جيروسكوب)
    for (const [key, value] of Object.entries(sensitivities)) {
        if (key === 'deviceInfo') continue;
        
        if (labels[key]) {
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; border-left: 3px solid ${colors[key]};">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 32px; height: 32px; background: ${colors[key]}20; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: ${colors[key]};">
                            <i class="fas ${icons[key]}"></i>
                        </div>
                        <span style="font-weight: 500;">${labels[key]}</span>
                    </div>
                    <div style="font-size: 18px; font-weight: bold; color: ${colors[key]};">
                        ${value}
                    </div>
                </div>
            `;
        }
    }

    // أزرار الإجراءات
    html += `
            </div>
            <div style="display: flex; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <button class="ios-button" onclick="shareFreeFireSensitivity()" style="flex: 1; background: linear-gradient(45deg, #007AFF, #0051D5);">
                    <i class="fas fa-share"></i> مشاركة
                </button>
                <button class="ios-button" onclick="saveFreeFireSensitivity()" style="flex: 1; background: linear-gradient(45deg, #28a745, #1e7e34);">
                    <i class="fas fa-save"></i> حفظ
                </button>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    
    // التمرير إلى النتائج
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// PUBG Mobile
// ============================================
window.generatePUBGSensitivity = function() {
    try {
        // الحصول على القيم من radio buttons
        const speedRadio = document.querySelector('input[name="pubg-speed"]:checked');
        const gyroRadio = document.querySelector('input[name="pubg-gyro"]:checked');
        
        const speed = speedRadio ? speedRadio.value : 'medium';
        const gyro = gyroRadio ? gyroRadio.value : 'scope';
        
        console.log('🎮 PUBG - Speed:', speed, 'Gyro:', gyro);
        
        // توليد الحساسية
        const result = sensitivityEngine.generatePUBGSensitivity(speed, gyro);
        
        // عرض النتائج
        displayPUBGResults(result.sensitivities, gyro);
        
        console.log('✅ تم توليد حساسية PUBG بنجاح:', result);
    } catch (error) {
        console.error('❌ خطأ في توليد حساسية PUBG:', error);
        alert('حدث خطأ في توليد الحساسية. يرجى المحاولة مرة أخرى.');
    }
};

function displayPUBGResults(sensitivities, gyroMode) {
    const resultsContainer = document.getElementById('pubg-sensitivity-results');
    if (!resultsContainer) return;

    const labels = {
        camera_tpp: 'الكاميرا (TPP)',
        camera_fpp: 'الكاميرا (FPP)',
        ads: 'ADS (تصويب)',
        scope_redDot: 'نقطة استهداف/هولو',
        scope_2x: 'سكوب 2x',
        scope_3x: 'سكوب 3x',
        scope_4x: 'سكوب 4x',
        scope_6x: 'سكوب 6x',
        scope_8x: 'سكوب 8x',
        free_look: 'حساسية النظرة الحرة',
        sprint: 'حساسية الركض',
        gyro_camera: 'جيرو - الكاميرا',
        gyro_ads: 'جيرو - ADS',
        gyro_scope_3x: 'جيرو - سكوب 3x',
        gyro_scope_4x: 'جيرو - سكوب 4x',
        gyro_scope_6x: 'جيرو - سكوب 6x',
        gyro_scope_8x: 'جيرو - سكوب 8x'
    };

    function fmt(v, key) {
        if (key.startsWith('gyro_') || key === 'ads' || key.startsWith('camera') || 
            key.startsWith('scope') || key === 'free_look' || key === 'sprint') {
            return v + '%';
        }
        return v;
    }

    let html = `
        <div class="ios-card" style="animation: fadeIn 0.5s ease; margin-top: 20px;">
            <h3 style="margin-bottom: 15px; color: #28a745;">
                <i class="fas fa-check-circle"></i> نتائج PUBG Mobile
            </h3>
    `;

    html += '<div style="display: grid; gap: 10px;">';

    // عرض الحساسيات الرئيسية
    for (const [key, value] of Object.entries(sensitivities)) {
        if (key === '_gyroMode') continue;
        
        if (labels[key]) {
            let suffix = '';
            if (gyroMode === 'off' && key.startsWith('gyro_')) {
                suffix = ' <small style="color:#888;">(توصية - الجيروسكوب معطّل)</small>';
            }

            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <span style="font-weight: 500;">${labels[key]}</span>
                    <div style="font-size: 18px; font-weight: bold; color: #007AFF;">
                        ${fmt(value, key)}${suffix}
                    </div>
                </div>
            `;
        }
    }

    html += `
            </div>
            <div style="display: flex; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <button class="ios-button" onclick="copyPUBGSensitivity()" style="flex: 1; background: linear-gradient(45deg, #007AFF, #0051D5);">
                    <i class="fas fa-copy"></i> نسخ الحساسية
                </button>
                <button class="ios-button" onclick="sharePUBGSensitivity()" style="flex: 1; background: linear-gradient(45deg, #28a745, #1e7e34);">
                    <i class="fas fa-share"></i> مشاركة
                </button>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.copyPUBGSensitivity = function() {
    const speedRadio = document.querySelector('input[name="pubg-speed"]:checked');
    const gyroRadio = document.querySelector('input[name="pubg-gyro"]:checked');
    const speed = speedRadio ? speedRadio.value : 'medium';
    const gyro = gyroRadio ? gyroRadio.value : 'scope';
    
    const result = sensitivityEngine.generatePUBGSensitivity(speed, gyro);
    const sens = result.sensitivities;
    
    const labels = {
        camera_tpp: 'Camera (TPP)',
        camera_fpp: 'Camera (FPP)',
        ads: 'ADS',
        scope_redDot: 'Red Dot/Holo',
        scope_2x: '2x Scope',
        scope_3x: '3x Scope',
        scope_4x: '4x Scope',
        scope_6x: '6x Scope',
        scope_8x: '8x Scope',
        free_look: 'Free Look',
        sprint: 'Sprint',
        gyro_camera: 'Gyro - Camera',
        gyro_ads: 'Gyro - ADS',
        gyro_scope_3x: 'Gyro - 3x',
        gyro_scope_4x: 'Gyro - 4x',
        gyro_scope_6x: 'Gyro - 6x',
        gyro_scope_8x: 'Gyro - 8x'
    };
    
    let text = '🎮 PUBG Mobile Sensitivity Settings\n\n';
    for (const [key, value] of Object.entries(sens)) {
        if (key === '_gyroMode') continue;
        if (labels[key]) {
            text += `${labels[key]}: ${value}%`;
            if (gyro === 'off' && key.startsWith('gyro_')) {
                text += ' (recommended - gyro off)';
            }
            text += '\n';
        }
    }
    text += '\nGenerated by RED SETTINGS v3.0';
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ قيم PUBG إلى الحافظة ✅');
    }).catch(() => {
        prompt('انسخ القيم يدوياً', text);
    });
};

// ============================================
// Call of Duty Mobile
// ============================================
window.generateCODSensitivity = function() {
    try {
        // الحصول على القيم من radio buttons
        const rotationRadio = document.querySelector('input[name="cod-rotation"]:checked');
        const styleRadio = document.querySelector('input[name="cod-style"]:checked');
        const gyroRadio = document.querySelector('input[name="cod-gyro"]:checked');
        const vehicleSlider = document.getElementById('cod-vehicle-slider');
        
        const rotation = rotationRadio ? rotationRadio.value : 'distance';
        const style = styleRadio ? styleRadio.value : 'standard';
        const gyro = gyroRadio ? gyroRadio.value : 'on';
        const vehicleValue = vehicleSlider ? Number(vehicleSlider.value) : null;
        
        console.log('🎮 COD - Rotation:', rotation, 'Style:', style, 'Gyro:', gyro);
        
        // توليد الحساسية
        const result = sensitivityEngine.generateCODSensitivity(rotation, style, gyro, vehicleValue);
        
        // عرض النتائج
        displayCODResults(result.sensitivities, gyro, result);
        
        console.log('✅ تم توليد حساسية COD بنجاح:', result);
    } catch (error) {
        console.error('❌ خطأ في توليد حساسية COD:', error);
        alert('حدث خطأ في توليد الحساسية. يرجى المحاولة مرة أخرى.');
    }
};

function displayCODResults(sensitivities, gyroMode, result = {}) {
    const resultsContainer = document.getElementById('cod-sensitivity-results');
    if (!resultsContainer) return;

    const labels = {
        rotation_mode: 'وضع التدوير',
        camera_standard: 'حساسية الكاميرا (قياسية)',
        camera_ads: 'حساسية ADS',
        camera_sniper: 'حساسية القناص',
        scope_tactical: 'سكوب تكتيكي',
        scope_3x: 'سكوب 3x',
        scope_4x: 'سكوب 4x',
        scope_6x: 'سكوب 6x',
        scope_8x: 'سكوب 8x',
        firing_standard: 'حساسية إطلاق (قياسية)',
        firing_ads: 'حساسية إطلاق (ADS)',
        firing_sniper: 'حساسية إطلاق (قناص)',
        vertical_turn: 'التدوير العمودي',
        gyro_general: 'جيروسكوب عام',
        gyro_ads: 'جيروسكوب أثناء ADS',
        gyro_sniper: 'جيروسكوب للقنص',
        vehicle: 'حساسية المركبات'
    };

    function fmt(v, key) {
        if (key === 'rotation_mode') return v;
        return v + '%';
    }

    let html = `
        <div class="ios-card" style="animation: fadeIn 0.5s ease; margin-top: 20px;">
            <h3 style="margin-bottom: 15px; color: #28a745;">
                <i class="fas fa-check-circle"></i> نتائج Call of Duty Mobile
            </h3>
    `;

    // عرض معلومات المحاكي إذا كان مفعلاً (تم حذف دعم المحاكي)
    const emulatorSettings = result.emulatorSettings;
    if (emulatorSettings && emulatorSettings.enabled) {
        html += `
            <div style="background: rgba(255,152,0,0.15); padding: 12px 15px; border-radius: 10px; margin-bottom: 15px; border-right: 3px solid #ff9800;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <i class="fas fa-desktop" style="color: #ff9800;"></i>
                    <strong style="color: #ff9800;">وضع المحاكي مفعّل</strong>
                </div>
                <div style="font-size: 13px; color: rgba(255,255,255,0.85); line-height: 1.6;">
                    تم تطبيق إعدادات المحاكي - الحساسية مُحسّنة للماوس ولوحة المفاتيح
        `;
        
        if (emulatorSettings.mouseDPI) {
            html += `<br>• DPI الماوس: ${emulatorSettings.mouseDPI}`;
        }
        if (emulatorSettings.emulatorDPI) {
            html += `<br>• DPI المحاكي: ${emulatorSettings.emulatorDPI}`;
        }
        if (emulatorSettings.precisionMode) {
            html += `<br>• وضع الدقة العالية مفعّل`;
        }
        
        html += `
                </div>
            </div>
        `;
    }

    html += '<div style="display: grid; gap: 10px;">';

    for (const [key, value] of Object.entries(sensitivities)) {
        if (labels[key]) {
            let suffix = '';
            if (gyroMode === 'off' && key.startsWith('gyro_')) {
                suffix = ' <small style="color:#888;">(توصية - الجيروسكوب معطّل)</small>';
            }

            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px;">
                    <span style="font-weight: 500;">${labels[key]}</span>
                    <div style="font-size: 18px; font-weight: bold; color: #007AFF;">
                        ${fmt(value, key)}${suffix}
                    </div>
                </div>
            `;
        }
    }

    html += `
            </div>
            <div style="display: flex; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <button class="ios-button" onclick="copyCODSensitivity()" style="flex: 1; background: linear-gradient(45deg, #007AFF, #0051D5);">
                    <i class="fas fa-copy"></i> نسخ الحساسية
                </button>
                <button class="ios-button" onclick="shareCODSensitivity()" style="flex: 1; background: linear-gradient(45deg, #28a745, #1e7e34);">
                    <i class="fas fa-share"></i> مشاركة
                </button>
            </div>
        </div>
    `;

    resultsContainer.innerHTML = html;
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

window.copyCODSensitivity = function() {
    const rotationRadio = document.querySelector('input[name="cod-rotation"]:checked');
    const styleRadio = document.querySelector('input[name="cod-style"]:checked');
    const gyroRadio = document.querySelector('input[name="cod-gyro"]:checked');
    const vehicleSlider = document.getElementById('cod-vehicle-slider');
    
    const rotation = rotationRadio ? rotationRadio.value : 'distance';
    const style = styleRadio ? styleRadio.value : 'standard';
    const gyro = gyroRadio ? gyroRadio.value : 'on';
    const vehicleValue = vehicleSlider ? Number(vehicleSlider.value) : null;
    
    const result = sensitivityEngine.generateCODSensitivity(rotation, style, gyro, vehicleValue);
    const sens = result.sensitivities;
    
    const labels = {
        rotation_mode: 'Rotation Mode',
        camera_standard: 'Camera (Standard)',
        camera_ads: 'Camera ADS',
        camera_sniper: 'Sniper',
        scope_tactical: 'Tactical',
        scope_3x: '3x',
        scope_4x: '4x',
        scope_6x: '6x',
        scope_8x: '8x',
        firing_standard: 'Firing (Standard)',
        firing_ads: 'Firing ADS',
        firing_sniper: 'Firing Sniper',
        vertical_turn: 'Vertical Turn',
        gyro_general: 'Gyro General',
        gyro_ads: 'Gyro ADS',
        gyro_sniper: 'Gyro Sniper',
        vehicle: 'Vehicle'
    };
    
    let text = '🎮 Call of Duty Mobile Sensitivity Settings\n\n';
    for (const [key, value] of Object.entries(sens)) {
        if (labels[key]) {
            text += `${labels[key]}: ${value}`;
            if (key !== 'rotation_mode') text += '%';
            if (gyro === 'off' && key.startsWith('gyro_')) {
                text += ' (recommended - gyro off)';
            }
            text += '\n';
        }
    }
    text += '\nGenerated by RED SETTINGS v3.0';
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('تم نسخ قيم COD إلى الحافظة ✅');
    }).catch(() => {
        prompt('انسخ القيم يدوياً', text);
    });
};

window.shareCODSensitivity = async function() {
    const rotationRadio = document.querySelector('input[name="cod-rotation"]:checked');
    const styleRadio = document.querySelector('input[name="cod-style"]:checked');
    const gyroRadio = document.querySelector('input[name="cod-gyro"]:checked');
    const vehicleSlider = document.getElementById('cod-vehicle-slider');
    
    const rotation = rotationRadio ? rotationRadio.value : 'distance';
    const style = styleRadio ? styleRadio.value : 'standard';
    const gyro = gyroRadio ? gyroRadio.value : 'on';
    const vehicleValue = vehicleSlider ? Number(vehicleSlider.value) : null;
    
    const result = sensitivityEngine.generateCODSensitivity(rotation, style, gyro, vehicleValue);
    const text = `🎮 Call of Duty Mobile Settings\n\nCamera: ${result.sensitivities.camera_standard}%\nADS: ${result.sensitivities.camera_ads}%\nSniper: ${result.sensitivities.camera_sniper}%\n\nRED SETTINGS v3.0`;
    
    if (navigator.share) {
        try {
            await navigator.share({ title: 'إعدادات Call of Duty Mobile', text });
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        await navigator.clipboard.writeText(text);
        showToast('تم النسخ إلى الحافظة!');
    }
};

// ============================================
// مشاركة وحفظ
// ============================================
window.shareFreeFireSensitivity = async function() {
    const result = sensitivityEngine.generateSensitivity('medium', 'medium');
    const text = sensitivityEngine.shareSensitivity(result.sensitivities);
    
    if (navigator.share) {
        try {
            await navigator.share({ title: 'إعدادات Free Fire', text });
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        await navigator.clipboard.writeText(text);
        showToast('تم النسخ إلى الحافظة!');
    }
};

window.saveFreeFireSensitivity = function() {
    const result = sensitivityEngine.generateSensitivity('medium', 'medium');
    sensitivityEngine.saveSettings(result, 'Free Fire - ' + new Date().toLocaleString('ar'));
    showToast('تم الحفظ بنجاح!');
};

window.sharePUBGSensitivity = async function() {
    const speedRadio = document.querySelector('input[name="pubg-speed"]:checked');
    const gyroRadio = document.querySelector('input[name="pubg-gyro"]:checked');
    const speed = speedRadio ? speedRadio.value : 'medium';
    const gyro = gyroRadio ? gyroRadio.value : 'scope';
    
    const result = sensitivityEngine.generatePUBGSensitivity(speed, gyro);
    const text = `🎮 إعدادات PUBG Mobile\n\nالكاميرا TPP: ${result.sensitivities.camera_tpp}%\nالكاميرا FPP: ${result.sensitivities.camera_fpp}%\nADS: ${result.sensitivities.ads}%\nسكوب 3x: ${result.sensitivities.scope_3x}%\nسكوب 4x: ${result.sensitivities.scope_4x}%\n\nRED SETTINGS v3.0`;
    
    if (navigator.share) {
        try {
            await navigator.share({ title: 'إعدادات PUBG Mobile', text });
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        await navigator.clipboard.writeText(text);
        showToast('تم النسخ إلى الحافظة!');
    }
};

// ============================================
// Toast
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    } else {
        alert(message);
    }
}

// ============================================
// رسالة جاهزية
// ============================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║              🎮 RED SETTINGS v3.0 - جاهز!                 ║
╠════════════════════════════════════════════════════════════╣
║  ✅ محرك الحساسية محمّل ويعمل                            ║
║  ✅ محرك الجرافيك محمّل ويعمل                            ║
║  ✅ جميع الدوال متاحة                                     ║
║  ✅ جاهز لتوليد الإعدادات                                ║
╚════════════════════════════════════════════════════════════╝
`);

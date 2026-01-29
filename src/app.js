// RED SETTINGS App - Main JavaScript

// ============================================
// App State
// ============================================
const AppState = {
    currentPage: 'home',
    user: null,
    currentSensitivity: null,
    settings: {
        speed: 'medium',
        fireButtonSize: 'medium'
    }
};

// ============================================
// Utilities
// ============================================
function showToast(message, duration = 3000) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getDeviceInfo() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isTablet = /iPad|tablet/i.test(navigator.userAgent) || (width > 768 && isMobile);
    
    return {
        width,
        height,
        deviceType: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
        aspectRatio: (width / height).toFixed(2),
        pixelRatio: window.devicePixelRatio
    };
}

function testPerformance() {
    const start = performance.now();
    for (let i = 0; i < 1000000; i++) Math.sqrt(i);
    const duration = performance.now() - start;
    
    if (duration < 20) return 'high';
    if (duration < 50) return 'medium';
    return 'low';
}

// ============================================
// Sensitivity Calculator
// ============================================
function generateSensitivityValues(speed, fireButtonSize) {
    const deviceInfo = getDeviceInfo();
    const performance = testPerformance();
    
    const baseValues = {
        fast: { general: 150, redDot: 140, scope2x: 120, scope4x: 100, sniper: 80, freeLook: 160 },
        medium: { general: 110, redDot: 100, scope2x: 85, scope4x: 70, sniper: 55, freeLook: 120 },
        slow: { general: 70, redDot: 65, scope2x: 55, scope4x: 45, sniper: 35, freeLook: 75 }
    };

    const base = baseValues[speed] || baseValues.medium;
    
    const deviceMultiplier = deviceInfo.deviceType === 'mobile' ? 1.1 : 
                            deviceInfo.deviceType === 'tablet' ? 1.05 : 0.95;
    
    const performanceMultiplier = performance === 'high' ? 1.05 : 
                                 performance === 'low' ? 0.95 : 1;

    const randomize = (val) => {
        const result = Math.round(val * deviceMultiplier * performanceMultiplier * (0.95 + Math.random() * 0.1));
        return Math.min(200, Math.max(20, result));
    };

    const fireSizes = { small: [15, 35], medium: [40, 70], large: [75, 100] };
    const [minFire, maxFire] = fireSizes[fireButtonSize] || fireSizes.medium;

    return {
        general: randomize(base.general),
        redDot: randomize(base.redDot),
        scope2x: randomize(base.scope2x),
        scope4x: randomize(base.scope4x),
        sniper: randomize(base.sniper),
        freeLook: randomize(base.freeLook),
        fireButtonSize: Math.floor(Math.random() * (maxFire - minFire + 1)) + minFire
    };
}

// ============================================
// AI Service
// ============================================
const AI_API_KEY = 'AIzaSyCi1euTKx54HzVb1CVl7RNriN-xnCeXQqo';
const AI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

async function sendToAI(message) {
    try {
        const context = 'أنت مساعد ذكي متخصص في ألعاب الفيديو، وخاصة Free Fire و PUBG Mobile.';
        
        const response = await fetch(`${AI_API_URL}?key=${AI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    { role: 'user', parts: [{ text: context }] },
                    { role: 'user', parts: [{ text: message }] }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048
                }
            })
        });

        const data = await response.json();
        
        if (data.error) throw new Error(data.error.message);
        
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('AI Error:', error);
        return 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
    }
}

// ============================================
// UI Functions
// ============================================
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });

    AppState.currentPage = pageId;

    // Load page data
    if (pageId === 'saved') loadSavedSensitivities();
    if (pageId === 'players') loadPlayerSettings();
}

function quickGenerate(speed) {
    document.getElementById('speed-' + speed).checked = true;
    AppState.settings.speed = speed;
    generateSensitivity();
}

function generateSensitivity() {
    const speed = document.querySelector('input[name="speed"]:checked')?.value || 'medium';
    const fireSize = document.querySelector('input[name="fire-size"]:checked')?.value || 'medium';
    
    AppState.settings.speed = speed;
    AppState.settings.fireButtonSize = fireSize;

    const sensitivities = generateSensitivityValues(speed, fireSize);
    AppState.currentSensitivity = sensitivities;

    const resultsContainer = document.getElementById('sensitivity-results');
    
    const colors = {
        general: '#007AFF', redDot: '#FF3B30', scope2x: '#34C759',
        scope4x: '#FF9500', sniper: '#AF52DE', freeLook: '#5AC8FA', fireButtonSize: '#FF2D55'
    };

    const labels = {
        general: 'عامة', redDot: 'نقطة حمراء', scope2x: 'سكوب 2x',
        scope4x: 'سكوب 4x', sniper: 'قناصة', freeLook: 'نظر حر', fireButtonSize: 'زر الضرب'
    };

    const icons = {
        general: 'fa-crosshairs', redDot: 'fa-dot-circle', scope2x: 'fa-search-plus',
        scope4x: 'fa-search', sniper: 'fa-bullseye', freeLook: 'fa-eye', fireButtonSize: 'fa-hand-pointer'
    };

    let gridHTML = '<div class="sensitivity-grid">';
    
    for (const [key, value] of Object.entries(sensitivities)) {
        if (labels[key]) {
            gridHTML += `
                <div class="sensitivity-item">
                    <div class="sensitivity-item-icon" style="background: ${colors[key]}20; color: ${colors[key]};">
                        <i class="fas ${icons[key]}"></i>
                    </div>
                    <div class="sensitivity-item-label">${labels[key]}</div>
                    <div class="sensitivity-item-value" style="color: ${colors[key]};">${value}</div>
                </div>
            `;
        }
    }
    
    gridHTML += '</div>';

    const actionsHTML = `
        <div style="display: flex; gap: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <button class="btn btn-secondary" onclick="shareSensitivity()" style="flex: 1;">
                <i class="fas fa-share"></i> مشاركة
            </button>
            <button class="btn btn-success" onclick="saveSensitivity()" style="flex: 1;">
                <i class="fas fa-save"></i> حفظ
            </button>
        </div>
    `;

    resultsContainer.innerHTML = '<div class="card" style="animation: fadeIn 0.5s ease;">' + gridHTML + actionsHTML + '</div>';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function shareSensitivity() {
    if (!AppState.currentSensitivity) return;

    const s = AppState.currentSensitivity;
    const text = `🎮 إعدادات Free Fire:\n\n• حساسية عامة: ${s.general}\n• النقطة الحمراء: ${s.redDot}\n• سكوب 2x: ${s.scope2x}\n• سكوب 4x: ${s.scope4x}\n• القناصة: ${s.sniper}\n• النظر الحر: ${s.freeLook}\n• زر الضرب: ${s.fireButtonSize}\n\nRED SETTINGS 🎯`;

    if (navigator.share) {
        try {
            await navigator.share({ title: 'إعدادات Free Fire', text });
            showToast('تمت المشاركة!');
        } catch (err) {
            console.log('Share cancelled');
        }
    } else {
        await navigator.clipboard.writeText(text);
        showToast('تم النسخ!');
    }
}

function saveSensitivity() {
    if (!AppState.currentSensitivity) return;

    const saved = JSON.parse(localStorage.getItem('savedSensitivities') || '[]');
    saved.push({
        sensitivities: AppState.currentSensitivity,
        savedAt: new Date().toISOString()
    });
    localStorage.setItem('savedSensitivities', JSON.stringify(saved));
    showToast('تم الحفظ!');
}

function loadSavedSensitivities() {
    const container = document.getElementById('saved-list');
    const saved = JSON.parse(localStorage.getItem('savedSensitivities') || '[]');

    if (saved.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-save"></i>
                <h3>لا توجد إعدادات محفوظة</h3>
                <p>قم بتوليد حساسية وحفظها لتظهر هنا</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    
    const colors = {
        general: '#007AFF', redDot: '#FF3B30', scope2x: '#34C759',
        scope4x: '#FF9500', sniper: '#AF52DE', freeLook: '#5AC8FA', fireButtonSize: '#FF2D55'
    };

    const labels = {
        general: 'عامة', redDot: 'نقطة حمراء', scope2x: 'سكوب 2x',
        scope4x: 'سكوب 4x', sniper: 'قناصة', freeLook: 'نظر حر', fireButtonSize: 'زر الضرب'
    };

    saved.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.marginBottom = '16px';
        
        let gridHTML = '<div class="sensitivity-grid">';
        for (const [key, value] of Object.entries(item.sensitivities)) {
            if (labels[key]) {
                gridHTML += `
                    <div class="sensitivity-item">
                        <div class="sensitivity-item-label">${labels[key]}</div>
                        <div class="sensitivity-item-value" style="color: ${colors[key]};">${value}</div>
                    </div>
                `;
            }
        }
        gridHTML += '</div>';

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-secondary';
        deleteBtn.style.marginTop = '16px';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> حذف';
        deleteBtn.onclick = () => {
            saved.splice(index, 1);
            localStorage.setItem('savedSensitivities', JSON.stringify(saved));
            loadSavedSensitivities();
            showToast('تم الحذف!');
        };

        card.innerHTML = gridHTML;
        card.appendChild(deleteBtn);
        container.appendChild(card);
    });
}

// ============================================
// Chat Functions
// ============================================
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const message = input.value.trim();

    if (!message) return;

    // Add user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.textContent = message;
    messagesContainer.appendChild(userMsg);
    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Show typing indicator
    const typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typing);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Get AI response
    const response = await sendToAI(message);

    // Remove typing indicator
    typing.remove();

    // Add AI response
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot';
    botMsg.textContent = response;
    messagesContainer.appendChild(botMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================
// Player Settings
// ============================================
function loadPlayerSettings() {
    const container = document.getElementById('players-list');
    const players = JSON.parse(localStorage.getItem('playerSettings') || '[]');

    if (players.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-users"></i>
                <h3>لا توجد إعدادات منشورة</h3>
                <p>كن أول من ينشر إعداداته!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    players.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.innerHTML = `
            <div class="player-header">
                <div class="player-avatar">${(player.playerName || '?').charAt(0).toUpperCase()}</div>
                <div class="player-info">
                    <h4>${player.playerName || 'لاعب'}</h4>
                    <span>${player.deviceName || 'جهاز غير معروف'}</span>
                </div>
            </div>
            <div class="player-stats">
                <div class="stat">
                    <div class="stat-value">${player.generalSensitivity || 0}</div>
                    <div class="stat-label">عامة</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${player.redDotSensitivity || 0}</div>
                    <div class="stat-label">نقطة حمراء</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${player.scope2xSensitivity || 0}</div>
                    <div class="stat-label">سكوب 2x</div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function showPublishModal() {
    const modalContainer = document.getElementById('modal-container');
    
    modalContainer.innerHTML = `
        <div class="modal-overlay active" onclick="if(event.target===this) closeModal()">
            <div class="modal">
                <div class="modal-header">
                    <h3>نشر الإعدادات</h3>
                </div>
                <div class="modal-body">
                    <input type="text" id="pub-name" class="input" placeholder="اسم اللاعب">
                    <input type="text" id="pub-device" class="input" placeholder="اسم الجهاز">
                    <input type="number" id="pub-general" class="input" placeholder="الحساسية العامة">
                    <input type="number" id="pub-reddot" class="input" placeholder="حساسية النقطة الحمراء">
                    <input type="number" id="pub-scope2" class="input" placeholder="حساسية سكوب 2x">
                </div>
                <div class="modal-footer">
                    <button class="modal-btn" onclick="closeModal()">إلغاء</button>
                    <button class="modal-btn" onclick="publishSettings()">نشر</button>
                </div>
            </div>
        </div>
    `;
}

function closeModal() {
    document.getElementById('modal-container').innerHTML = '';
}

function publishSettings() {
    const player = {
        playerName: document.getElementById('pub-name').value,
        deviceName: document.getElementById('pub-device').value,
        generalSensitivity: document.getElementById('pub-general').value,
        redDotSensitivity: document.getElementById('pub-reddot').value,
        scope2xSensitivity: document.getElementById('pub-scope2').value,
        publishedAt: new Date().toISOString()
    };
    
    const players = JSON.parse(localStorage.getItem('playerSettings') || '[]');
    players.unshift(player);
    localStorage.setItem('playerSettings', JSON.stringify(players));
    
    closeModal();
    showToast('تم النشر!');
    loadPlayerSettings();
}

// ============================================
// Auth Functions
// ============================================
function showAuthModal() {
    const modalContainer = document.getElementById('modal-container');
    const isLoggedIn = AppState.user !== null;
    
    if (isLoggedIn) {
        modalContainer.innerHTML = `
            <div class="modal-overlay active" onclick="if(event.target===this) closeModal()">
                <div class="modal">
                    <div class="modal-header">
                        <h3>الحساب</h3>
                    </div>
                    <div class="modal-body" style="text-align: center;">
                        <p>مسجل كـ: ${AppState.user.email}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn" onclick="closeModal()">إغلاق</button>
                        <button class="modal-btn destructive" onclick="logout()">تسجيل الخروج</button>
                    </div>
                </div>
            </div>
        `;
    } else {
        modalContainer.innerHTML = `
            <div class="modal-overlay active" onclick="if(event.target===this) closeModal()">
                <div class="modal">
                    <div class="modal-header">
                        <h3>تسجيل الدخول</h3>
                    </div>
                    <div class="modal-body">
                        <input type="email" id="auth-email" class="input" placeholder="البريد الإلكتروني">
                        <input type="password" id="auth-pass" class="input" placeholder="كلمة المرور">
                    </div>
                    <div class="modal-footer">
                        <button class="modal-btn" onclick="closeModal()">إلغاء</button>
                        <button class="modal-btn" onclick="login()">دخول</button>
                    </div>
                </div>
            </div>
        `;
    }
}

function login() {
    const email = document.getElementById('auth-email').value;
    AppState.user = { email: email || 'user@example.com' };
    updateAuthUI();
    closeModal();
    showToast('تم تسجيل الدخول!');
}

function logout() {
    AppState.user = null;
    updateAuthUI();
    closeModal();
    showToast('تم تسجيل الخروج!');
}

function updateAuthUI() {
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    
    if (AppState.user) {
        title.textContent = 'المستخدم';
        subtitle.textContent = AppState.user.email;
    } else {
        title.textContent = 'تسجيل الدخول';
        subtitle.textContent = 'انقر للدخول إلى حسابك';
    }
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 RED SETTINGS App Initialized');
    updateAuthUI();
});

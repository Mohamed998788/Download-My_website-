// التعرف التلقائي على أبعاد وخصائص الشاشة
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;
        const screenDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 96; // بالإنش التقريبي
        
        // حساب DPI الجهاز (تقديري لأن JavaScript لا يستطيع الوصول للـ DPI الحقيقي في جميع الأجهزة)
        const deviceDPI = window.devicePixelRatio * 96 || 96;
        
        // حساب دقة الشاشة الإجمالية
        const totalPixels = width * height;
        const resolutionFactor = Math.log10(totalPixels) / 6; // عامل يتراوح بين 0.5 و1 للشاشات العادية
        
        // حساب الحساسية الأساسية بناءً على العوامل المتعددة (نطاق من 0 إلى 200)
        const baseSensitivity = Math.round(
            (
                // عامل أبعاد الشاشة (16:9 هو الأمثل للعبة)
                (aspectRatio >= 1.7 && aspectRatio <= 1.8 ? 1.05 : 0.95) *
                // عامل الـ DPI (كلما زاد DPI، انخفضت الحساسية قليلاً للتحكم الدقيق)
                (200 / (1 + (deviceDPI / 300))) *
                // عامل الدقة (كلما زادت الدقة، زادت الحساسية قليلاً)
                (80 + (resolutionFactor * 40)) *
                // عامل حجم الشاشة (الشاشات الكبيرة تتطلب حساسية أقل)
                (1 - (screenDiagonal * 0.01))
            )
        );
        
        // عوامل تصحيح لكل نوع من الحساسيات للتحديث الجديد لفري فاير
        let sensitivities = {
            general: Math.min(Math.max(baseSensitivity * 1.1, 50), 200), // حساسية عامة
            redDot: Math.min(Math.max(baseSensitivity * 1.05, 45), 200), // حساسية النقطة الحمراء
            scope2x: Math.min(Math.max(baseSensitivity * 0.85, 40), 200), // حساسية سكوب 2x
            scope4x: Math.min(Math.max(baseSensitivity * 0.65, 35), 200), // حساسية سكوب 4x
            sniper: Math.min(Math.max(baseSensitivity * 0.45, 30), 200), // حساسية القناصة
            freeLook: Math.min(Math.max(baseSensitivity * 1.15, 55), 200), // حساسية النظر الحر
            fireButtonSize: generateFireButtonSize() // حجم زر الضرب
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

        // توليد حساسية عشوائية بناءً على السرعة المختارة والعوامل الفنية للشاشة - محسنة للتحديث الجديد FF 2023
        function generateRandomSensitivity() {
            // توثيق الجلسة لأغراض الأمان وتتبع الاستخدام
            const sessionId = generateSecureSessionId();
            
            const speed = document.querySelector('input[name="speed"]:checked').value;
            
            // الحصول على خصائص الشاشة مع تحسينات لتوافق الأجهزة
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;
            const deviceDPI = window.devicePixelRatio * 96 || 96;
            const screenDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 96; // بالإنش التقريبي
            
            // عوامل جديدة لتحسين الدقة
            const touchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTablet = /iPad|tablet|Nexus 7|Nexus 10/i.test(navigator.userAgent) || (width > 768 && touchScreen);
            
            // استكشاف نوع الجهاز وطريقة اللعب
            const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";
            
            // عامل دقة الشاشة المحسّن للإصدار الجديد 2023
            const resolutionFactor = Math.sqrt(width * height) / 1000;
            
            // عامل للـ DPI - تعديل ليتناسب مع السرعة المختارة والجهاز
            const dpiMultiplier = Math.min(1.4, Math.max(0.85, deviceDPI / 110)) * 
                                 (deviceType === "mobile" ? 1.1 : deviceType === "tablet" ? 1.05 : 0.95);
            
            // عامل حجم الشاشة مع تحسين للأجهزة الجديدة
            const screenSizeMultiplier = calculateScreenSizeMultiplier(screenDiagonal, deviceType);
            
            // عامل مُحسن للمعالج والأداء
            const performanceFactor = getPerformanceFactor();
            
            // تحديد النطاق بناءً على السرعة المختارة بشكل دقيق - قيم محسنة للتحديث الجديد 2023
            let baseMinValue, baseMaxValue;
            
            if (speed === "fast") {
                // سريعة - نطاق مناسب للسرعة العالية، مع تحسينات جديدة للأجهزة الحديثة
                baseMinValue = deviceType === "mobile" ? 170 : 160;
                baseMaxValue = 200;
            } else if (speed === "medium") {
                // متوسطة - نطاق متوسط مُحسن للتوازن بين الدقة والسرعة
                baseMinValue = deviceType === "mobile" ? 130 : 120;
                baseMaxValue = deviceType === "mobile" ? 170 : 160;
            } else if (speed === "slow") {
                // بطيئة - نطاق دقيق للتحكم المتقدم، مع تحسينات للأجهزة ذات الشاشات الكبيرة
                baseMinValue = deviceType === "mobile" ? 75 : deviceType === "tablet" ? 70 : 65;
                baseMaxValue = deviceType === "mobile" ? 120 : 110;
            }
            
            // عامل احترافي جديد - يعتمد على وقت الاستجابة للجهاز
            const proFactor = calculateProGamerFactor(speed, deviceType);
            
            // تطبيق عوامل تصحيح مُحسنة للأجهزة المختلفة بشكل ذكي
            const deviceAdjustmentFactor = (dpiMultiplier * screenSizeMultiplier * performanceFactor - 1.0) * 0.45 + 1.08;
            baseMinValue = Math.round(baseMinValue * deviceAdjustmentFactor * proFactor);
            baseMaxValue = Math.round(baseMaxValue * deviceAdjustmentFactor * proFactor);
            
            // تطبيق الحدود المناسبة للعبة الجديدة (20-200)
            baseMinValue = Math.min(Math.max(baseMinValue, 25), 195);
            baseMaxValue = Math.min(Math.max(baseMaxValue, baseMinValue + 15), 200);
            
            // عامل أبعاد الشاشة محسّن - تحسين خاص للشاشات الطويلة والأجهزة الجديدة
            const aspectRatioMultiplier = getAspectRatioMultiplier(aspectRatio, deviceType);
            
            // توليد القيمة الأساسية للحساسية مع خوارزمية محسّنة لتجنب الالتصاق بالقيم المتطرفة
            const baseValue = generateBalancedValue(baseMinValue, baseMaxValue);
            
            // حساب معاملات التصحيح لكل نوع من الحساسيات - محسّنة للتحديث الجديد 2023
            // هذه التعديلات تستند إلى بيانات من لاعبين محترفين واختبارات متعددة
            let generalMult, redDotMult, scope2xMult, scope4xMult, sniperMult, freeLookMult, gyroscopeMult;
            
            if (speed === "fast") {
                // نسب مُحسّنة للسرعة العالية تناسب الإصدار الجديد
                generalMult = 1.0 + (deviceType === "mobile" ? 0.03 : 0);
                redDotMult = 0.98;
                scope2xMult = 0.95;
                scope4xMult = 0.88;
                sniperMult = 0.75;
                freeLookMult = 1.08 + (touchScreen ? 0.04 : 0);
                gyroscopeMult = 0.85; // حساسية الجيروسكوب
            } else if (speed === "medium") {
                // نسب متوازنة محسّنة
                generalMult = 1.0;
                redDotMult = 0.96;
                scope2xMult = 0.89;
                scope4xMult = 0.79;
                sniperMult = 0.65 + (deviceType === "tablet" ? 0.05 : 0);
                freeLookMult = 1.05;
                gyroscopeMult = 0.75;
            } else { // slow
                // نسب للدقة العالية
                generalMult = 1.0;
                redDotMult = 0.94;
                scope2xMult = 0.84;
                scope4xMult = 0.74;
                sniperMult = 0.55 + (deviceType === "desktop" ? 0.05 : 0);
                freeLookMult = 1.04;
                gyroscopeMult = 0.65;
            }
            
            // عامل عشوائي ذكي - يختلف حسب نوع المنظار لتوفير تجربة أكثر واقعية
            const getSmartRandomFactor = (scopeType) => {
                // عامل عشوائي مخصص حسب نوع المنظار - يوفر استقرارًا أكبر للمناظير البعيدة
                const baseFactor = 0.97 + (Math.random() * 0.06);
                switch(scopeType) {
                    case 'general': return baseFactor;
                    case 'redDot': return baseFactor * 0.99 + 0.01;
                    case 'scope2x': return baseFactor * 0.98 + 0.02;
                    case 'scope4x': return baseFactor * 0.97 + 0.025;
                    case 'sniper': return baseFactor * 0.96 + 0.03;
                    case 'freeLook': return baseFactor * 1.01;
                    default: return baseFactor;
                }
            };
            
            // القيم النهائية المُحسنة لكل حساسية
            sensitivities.general = Math.min(200, Math.max(40, Math.round(baseValue * generalMult * aspectRatioMultiplier * getSmartRandomFactor('general'))));
            sensitivities.redDot = Math.min(200, Math.max(35, Math.round(baseValue * redDotMult * aspectRatioMultiplier * getSmartRandomFactor('redDot'))));
            sensitivities.scope2x = Math.min(200, Math.max(30, Math.round(baseValue * scope2xMult * aspectRatioMultiplier * getSmartRandomFactor('scope2x'))));
            sensitivities.scope4x = Math.min(200, Math.max(25, Math.round(baseValue * scope4xMult * aspectRatioMultiplier * getSmartRandomFactor('scope4x'))));
            sensitivities.sniper = Math.min(200, Math.max(20, Math.round(baseValue * sniperMult * aspectRatioMultiplier * getSmartRandomFactor('sniper'))));
            sensitivities.freeLook = Math.min(200, Math.max(45, Math.round(baseValue * freeLookMult * aspectRatioMultiplier * getSmartRandomFactor('freeLook'))));
            
            // إضافة دعم للجيروسكوب في الأجهزة الحديثة
            sensitivities.gyroscope = Math.min(100, Math.max(20, Math.round(baseValue * gyroscopeMult * 0.5)));
            
            // حجم زر الضرب المُحسن بناءً على حجم الشاشة
            sensitivities.fireButtonSize = generateAdvancedFireButtonSize();
            
            // تخزين معلومات الجلسة بشكل آمن
            storeSessionData(sessionId, { 
                deviceType, 
                resolution: { width, height }, 
                speed, 
                sensitivity: { ...sensitivities }
            });
            
            // تأثير بصري محسّن لعرض الحساسيات
            const resultDiv = document.getElementById('result');
            resultDiv.classList.add('fade-out');
            
            setTimeout(() => {
                displaySensitivities();
                resultDiv.classList.remove('fade-out');
                resultDiv.classList.add('fade-in');
                setTimeout(() => {
                    resultDiv.classList.remove('fade-in');
                }, 500);
            }, 300);
        }
        
        // وظائف مساعدة للحساسية
        
        // توليد معرف جلسة آمن
        function generateSecureSessionId() {
            const array = new Uint32Array(2);
            window.crypto.getRandomValues(array);
            return 'sid-' + array[0].toString(16) + '-' + array[1].toString(16);
        }
        
        // تخزين بيانات الجلسة
        function storeSessionData(sessionId, data) {
            try {
                const secureData = { ...data, timestamp: Date.now() };
                sessionStorage.setItem(sessionId, JSON.stringify(secureData));
            } catch (e) {
                console.error("خطأ في تخزين البيانات");
            }
        }
        
        // حساب عامل حجم الشاشة
        function calculateScreenSizeMultiplier(screenDiagonal, deviceType) {
            if (deviceType === "mobile") {
                // تخصيص للهواتف بأحجام مختلفة
                if (screenDiagonal < 5) return 1.15; // هواتف صغيرة
                if (screenDiagonal > 6.5) return 1.05; // هواتف كبيرة
                return 1.1;
            } else if (deviceType === "tablet") {
                // تخصيص للأجهزة اللوحية
                return 1.0;
            } else {
                // أجهزة سطح المكتب
                return 0.9;
            }
        }
        
        // الحصول على عامل الأداء
        function getPerformanceFactor() {
            try {
                // قياس أداء الجهاز
                const start = performance.now();
                for (let i = 0; i < 1000000; i++) {
                    Math.sqrt(i);
                }
                const end = performance.now();
                const execTime = end - start;
                
                // الأداء الأسرع = عامل أعلى (الجهاز أفضل)
                if (execTime < 15) return 1.1; // أجهزة سريعة جداً
                if (execTime < 30) return 1.05; // أجهزة سريعة
                if (execTime < 60) return 1.0; // أجهزة متوسطة
                if (execTime < 120) return 0.95; // أجهزة بطيئة
                return 0.9; // أجهزة بطيئة جداً
            } catch (e) {
                return 1.0; // القيمة الافتراضية في حالة وجود خطأ
            }
        }
        
        // حساب عامل النسبة الباعية
        function getAspectRatioMultiplier(aspectRatio, deviceType) {
            // الأجهزة الحديثة تفضل نسب مختلفة للشاشة
            if (deviceType === "mobile") {
                // الهواتف الحديثة غالباً ما تكون 19:9 أو 20:9
                if (aspectRatio >= 2.0) return 1.08;
                if (aspectRatio >= 1.9) return 1.06;
                if (aspectRatio >= 1.7) return 1.04;
                return 1.0;
            } else {
                // أجهزة أخرى (لوحية وسطح المكتب)
                if (aspectRatio >= 1.7 && aspectRatio <= 1.8) return 1.05; // نسبة 16:9 مثالية
                if (aspectRatio > 1.8) return 1.03; // شاشات عريضة
                return 0.98; // شاشات مربعة
            }
        }
        
        // توليد قيمة متوازنة - تجنب الالتصاق بالقيم المتطرفة
        function generateBalancedValue(min, max) {
            // استخدام توزيع شبه طبيعي لتفادي القيم المتطرفة
            const range = max - min;
            let r = 0;
            
            // جمع 3 أرقام عشوائية للحصول على توزيع أكثر توازناً
            for (let i = 0; i < 3; i++) {
                r += Math.random();
            }
            r = r / 3; // المتوسط
            
            return Math.floor(min + (r * range));
        }
        
        // عامل مخصص للاعبين المحترفين
        function calculateProGamerFactor(speed, deviceType) {
            if (speed === "fast" && deviceType === "mobile") {
                return 1.02; // زيادة طفيفة للاعبين السريعين على الهواتف
            } else if (speed === "slow" && deviceType === "desktop") {
                return 1.03; // زيادة طفيفة للاعبين الدقيقين على أجهزة سطح المكتب
            }
            return 1.0;
        }
        
        // إنشاء حجم زر ضرب متقدم حسب الجهاز
        function generateAdvancedFireButtonSize() {
            const sizeOption = document.querySelector('input[name="fire-button-size"]:checked').value;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const screenWidth = window.innerWidth;
            
            // تخصيص النطاقات حسب نوع الجهاز وحجم الشاشة
            let minRange, maxRange;
            
            if (sizeOption === "small") {
                minRange = isMobile ? 15 : 10;
                maxRange = isMobile ? 35 : 30;
            } else if (sizeOption === "medium") {
                minRange = isMobile ? 45 : 40;
                maxRange = isMobile ? 75 : 70;
                
                // تعديل إضافي للشاشات العريضة
                if (screenWidth > 1200) {
                    minRange += 5;
                    maxRange += 5;
                }
            } else if (sizeOption === "large") {
                minRange = isMobile ? 85 : 80;
                maxRange = isMobile ? 100 : 100;
                
                // تعديل إضافي للشاشات الصغيرة
                if (screenWidth < 400) {
                    minRange -= 10;
                    maxRange -= 10;
                }
            }
            
            return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
        }

        // عرض الحساسيات التلقائية مع مراعاة خصائص الشاشة والتحديث الجديد للعبة
        function calculateSensitivity() {
            const speed = document.querySelector('input[name="speed"]:checked').value;
            
            // استخراج المعلومات الخاصة بالشاشة
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;
            const screenDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 96; // بالإنش التقريبي
            const deviceDPI = window.devicePixelRatio * 96 || 96;
            const resolution = width * height;
            
            // عوامل التصحيح الجديدة للتحديث
            const resolutionFactor = Math.log10(resolution) / 6; // عامل يتراوح بين 0.5 و1
            const dpiAdjustment = deviceDPI > 200 ? 0.9 : deviceDPI < 120 ? 1.1 : 1.0; // تعديل حسب دقة العرض
            const screenSizeAdjustment = screenDiagonal > 7 ? 0.9 : screenDiagonal < 5 ? 1.15 : 1.0; // تعديل حسب حجم الشاشة
            const aspectRatioAdjustment = (aspectRatio >= 1.7 && aspectRatio <= 1.8) ? 1.05 : 0.95; // أفضل أداء لنسبة 16:9
            
            // قياس حساسية أساسية جديدة مُحسنة لتكون أسرع في التحديث الجديد للعبة
            // زيادة القيمة الأساسية من 80 إلى 100 لجعل الحساسية أعلى
            const adaptiveBaseSensitivity = 100 * aspectRatioAdjustment * dpiAdjustment * screenSizeAdjustment * resolutionFactor;
            
            // تعديل الحساسيات بناءً على السرعة المختارة والعوامل الجديدة للتحديث الجديد لفري فاير
            if (speed === "fast") {
                // معادلات محسنة للتحديث الجديد لفري فاير مع زيادة المعاملات لحساسية أعلى
                sensitivities.general = Math.min(Math.round(adaptiveBaseSensitivity * 2.5), 200);
                sensitivities.redDot = Math.min(Math.round(adaptiveBaseSensitivity * 2.3), 200);
                sensitivities.scope2x = Math.min(Math.round(adaptiveBaseSensitivity * 2.0), 200);
                sensitivities.scope4x = Math.min(Math.round(adaptiveBaseSensitivity * 1.7), 200);
                sensitivities.sniper = Math.min(Math.round(adaptiveBaseSensitivity * 1.2), 200);
                sensitivities.freeLook = Math.min(Math.round(adaptiveBaseSensitivity * 2.7), 200);
            } else if (speed === "medium") {
                // زيادة المعاملات للسرعة المتوسطة لتكون أسرع قليلاً
                sensitivities.general = Math.min(Math.round(adaptiveBaseSensitivity * 2.0), 200);
                sensitivities.redDot = Math.min(Math.round(adaptiveBaseSensitivity * 1.9), 200);
                sensitivities.scope2x = Math.min(Math.round(adaptiveBaseSensitivity * 1.6), 200);
                sensitivities.scope4x = Math.min(Math.round(adaptiveBaseSensitivity * 1.3), 200);
                sensitivities.sniper = Math.min(Math.round(adaptiveBaseSensitivity * 1.0), 200);
                sensitivities.freeLook = Math.min(Math.round(adaptiveBaseSensitivity * 2.1), 200);
            } else if (speed === "slow") {
                // زيادة المعاملات للسرعة البطيئة لتصبح معتدلة بدلاً من بطيئة جداً
                sensitivities.general = Math.min(Math.round(adaptiveBaseSensitivity * 1.5), 200);
                sensitivities.redDot = Math.min(Math.round(adaptiveBaseSensitivity * 1.4), 200);
                sensitivities.scope2x = Math.min(Math.round(adaptiveBaseSensitivity * 1.2), 200);
                sensitivities.scope4x = Math.min(Math.round(adaptiveBaseSensitivity * 1.0), 200);
                sensitivities.sniper = Math.min(Math.round(adaptiveBaseSensitivity * 0.8), 200);
                sensitivities.freeLook = Math.min(Math.round(adaptiveBaseSensitivity * 1.6), 200);
            }
            
            // رفع الحد الأدنى للحساسيات لتكون أسرع
            sensitivities.general = Math.max(70, sensitivities.general);
            sensitivities.redDot = Math.max(65, sensitivities.redDot);
            sensitivities.scope2x = Math.max(55, sensitivities.scope2x);
            sensitivities.scope4x = Math.max(45, sensitivities.scope4x);
            sensitivities.sniper = Math.max(35, sensitivities.sniper);
            sensitivities.freeLook = Math.max(75, sensitivities.freeLook);
            
            sensitivities.fireButtonSize = generateFireButtonSize(); // تحديث حجم زر الضرب
            displaySensitivities();

            // تغيير الزر وإخفاءه ثم إظهار زر "توليد حساسية أخرى"
            const generateSensitivityButton = document.getElementById('generate-sensitivity-button');
            const generateRandomSensitivityButton = document.getElementById('generate-random-sensitivity');
            
            // تغيير نص الزر وتنشيط تأثير بصري
            generateSensitivityButton.classList.add('button-success');
            setTimeout(() => {
                generateSensitivityButton.classList.remove('pulse-effect');
                generateSensitivityButton.classList.remove('button-success');
                
                // إظهار زر توليد حساسية أخرى بتأثير بصري
                generateRandomSensitivityButton.style.display = 'flex';
                generateRandomSensitivityButton.classList.add('animate-fade-in');
            }, 300);
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

        // توليد إعدادات الجرافيك مع مراعاة دقة الشاشة والجيل الجديد للعبة
        function generateGraphicsSettings() {
            // تحديد التاريخ والوقت للبيانات
            const currentDate = new Date().toLocaleDateString('ar-SA');
            
            // الحصول على معلومات المتصفح والجهاز
            const userAgent = navigator.userAgent;
            const platform = navigator.platform || "غير معروف";
            
            // تحديد الجهاز بشكل أفضل
            const isMobile = /Mobile|Android|iPhone|iPad|iPod|Windows Phone/i.test(userAgent);
            const isTablet = /Tablet|iPad|Playbook|Silk|(Android(?!.*Mobile))/i.test(userAgent);
            const isDesktop = !isMobile && !isTablet;
            
            // تحديد نوع الجهاز
            let deviceType = "غير معروف";
            if (isDesktop) deviceType = "جهاز سطح المكتب";
            else if (isTablet) deviceType = "جهاز لوحي";
            else if (isMobile) deviceType = "هاتف ذكي";
            
            // تحديد نظام التشغيل
            let osType = "غير معروف";
            if (/Windows/i.test(platform)) osType = "Windows";
            else if (/Mac/i.test(platform)) osType = "MacOS";
            else if (/Linux/i.test(platform)) osType = "Linux";
            else if (/Android/i.test(userAgent)) osType = "Android";
            else if (/iPhone|iPad|iPod/i.test(userAgent)) osType = "iOS";
            
            // تحسين تقدير الرام - استخدام منهجية أكثر موثوقية بناءً على نوع الجهاز ونوع المتصفح
            let ram = 0;
            
            // أولاً: محاولة استخدام واجهة navigator.deviceMemory إذا كانت متوفرة
            if (navigator.deviceMemory) {
                ram = navigator.deviceMemory;
            } else {
                // ثانياً: تقدير الرام بناءً على نوع الجهاز ومستوى أدائه
                const performanceLevel = testDevicePerformance();
                
                if (isDesktop) {
                    // أجهزة سطح المكتب عادة لديها ذاكرة أكبر
                    if (performanceLevel > 0.8) ram = 16;
                    else if (performanceLevel > 0.6) ram = 12;
                    else if (performanceLevel > 0.4) ram = 8;
                    else if (performanceLevel > 0.2) ram = 6;
                    else ram = 4;
                } else if (isTablet) {
                    // الأجهزة اللوحية عادة متوسطة في الذاكرة
                    if (performanceLevel > 0.7) ram = 8; 
                    else if (performanceLevel > 0.5) ram = 6;
                    else if (performanceLevel > 0.3) ram = 4;
                    else ram = 3;
                } else {
                    // الهواتف الذكية
                    if (/iPhone 15|iPhone 14|Galaxy S23|Galaxy S22|Pixel 8|Pixel 7/i.test(userAgent)) {
                        ram = 8; // الهواتف الرائدة الحديثة
                    } else if (/iPhone 13|iPhone 12|Galaxy S21|S20|Pixel 6/i.test(userAgent)) {
                        ram = 6; // الهواتف الرائدة السابقة
                    } else if (performanceLevel > 0.6) {
                        ram = 8; // هواتف عالية الأداء
                    } else if (performanceLevel > 0.4) {
                        ram = 6; // هواتف متوسطة الأداء
                    } else if (performanceLevel > 0.2) {
                        ram = 4; // هواتف منخفضة الأداء
                    } else {
                        ram = 3; // هواتف بدائية
                    }
                }
            }
            
            // تحسين تقدير عدد أنوية المعالج مع فحوصات إضافية
            let processorCores = navigator.hardwareConcurrency || 0;
            
            // إذا لم يكن هناك معلومات عن عدد الأنوية، نقدرها بناءً على نوع الجهاز والأداء
            if (!processorCores) {
                const performanceLevel = testDevicePerformance();
                
                if (isDesktop) {
                    // أجهزة سطح المكتب عادة تحتوي على عدد أكبر من الأنوية
                    if (performanceLevel > 0.8) processorCores = 12;
                    else if (performanceLevel > 0.6) processorCores = 8;
                    else if (performanceLevel > 0.4) processorCores = 6;
                    else if (performanceLevel > 0.2) processorCores = 4;
                    else processorCores = 2;
                } else if (isTablet) {
                    // الأجهزة اللوحية عادة متوسطة في عدد الأنوية
                    if (performanceLevel > 0.6) processorCores = 8;
                    else if (performanceLevel > 0.4) processorCores = 6;
                    else if (performanceLevel > 0.2) processorCores = 4;
                    else processorCores = 2;
                } else {
                    // الهواتف الذكية
                    if (performanceLevel > 0.8) processorCores = 8;
                    else if (performanceLevel > 0.6) processorCores = 6;
                    else if (performanceLevel > 0.3) processorCores = 4;
                    else processorCores = 2;
                }
            }
            
            // تحسين معلومات الشاشة بشكل أدق
            // استخدام screen.width و screen.height للحصول على الدقة الفعلية للشاشة
            const width = window.screen.width || window.innerWidth;
            const height = window.screen.height || window.innerHeight;
            const resolution = width * height;
            const aspectRatio = (width / height).toFixed(2);
            const deviceDPI = Math.round(window.devicePixelRatio * 96) || 96;
            
            // تقدير مساحة التخزين بشكل أفضل بناءً على نوع الجهاز وأدائه
            let storageEstimate;
            
            if (isDesktop) {
                storageEstimate = 512; // أجهزة الكمبيوتر عادة تملك مساحة تخزين كبيرة
            } else if (isTablet) {
                if (/iPad Pro/i.test(userAgent)) storageEstimate = 256;
                else storageEstimate = 128;
            } else {
                // الهواتف الذكية
                if (/iPhone 15|iPhone 14|Galaxy S23|Pixel 8/i.test(userAgent)) {
                    storageEstimate = 256; // الهواتف الرائدة الحديثة
                } else if (/iPhone 13|iPhone 12|Galaxy S21|Pixel 6/i.test(userAgent)) {
                    storageEstimate = 128; // الهواتف الرائدة السابقة
                } else {
                    storageEstimate = 64; // الهواتف الأخرى
                }
            }
            
            // محاولة استخدام واجهة navigator.storage لتقدير المساحة إذا كانت متوفرة
            const storage = navigator.storage && navigator.storage.estimate ? 
                navigator.storage.estimate().then(estimate => {
                    // الرجوع إلى القيمة المقدرة سابقًا إذا لم يتم الحصول على قيمة معقولة
                    if (estimate.quota && estimate.quota > 1024 * 1024 * 10) { // إذا كانت المساحة المتاحة أكبر من 10 ميجابايت
                        return (estimate.quota / (1024 * 1024 * 1024)).toFixed(0); // المساحة (بالجيجابايت)
                    } else {
                        return storageEstimate;
                    }
                }) : 
                new Promise((resolve) => {
                    resolve(storageEstimate);
                });
            
            // تقدير نوع الهاتف (عالي أو متوسط أو ضعيف)
            let deviceTier = "متوسط";
            
            if (ram >= 8 || processorCores >= 8 || /iPhone 14|iPhone 15|Galaxy S23|S22|Pixel 8|Pixel 7/i.test(userAgent)) {
                deviceTier = "عالي";
            } else if (ram <= 3 || processorCores <= 2 || resolution < 720 * 1280) {
                deviceTier = "ضعيف";
            }
            
            // معايير الجرافيك المحسنة بناءً على المعلومات المتاحة
            let graphicsLevel;
            
            if ((ram >= 8 && processorCores >= 8) || /iPhone 15 Pro|Galaxy S23 Ultra|Pixel 8 Pro/i.test(userAgent)) {
                graphicsLevel = "فائقة+"; // مستوى فائق للأجهزة القوية جدًا
            } else if ((ram >= 6 && processorCores >= 6) || /iPhone 15|iPhone 14|Galaxy S23|Pixel 8/i.test(userAgent)) {
                graphicsLevel = "فائقة"; // مستوى فائق
            } else if ((ram >= 4 && processorCores >= 4) || /iPhone 13|iPhone 12|Galaxy S21|Pixel 6/i.test(userAgent)) {
                graphicsLevel = "عالية"; // مستوى عالي
            } else if (ram >= 3 && processorCores >= 2) {
                graphicsLevel = "متوسطة"; // مستوى متوسط
            } else {
                graphicsLevel = "منخفضة"; // مستوى منخفض
            }

            // معدل الإطارات (FPS) محسن بناءً على المواصفات
            let fpsLevel;
            
            if ((ram >= 8 && processorCores >= 8) || /iPhone 15 Pro|Galaxy S23 Ultra|Pixel 8 Pro/i.test(userAgent)) {
                fpsLevel = "120 FPS"; // دعم 120 إطار للأجهزة القوية جدًا
            } else if ((ram >= 6 && processorCores >= 6) || /iPhone 15|iPhone 14|Galaxy S23|Pixel 8/i.test(userAgent)) {
                fpsLevel = "90 FPS"; // دعم 90 إطار للأجهزة القوية
            } else if ((ram >= 4 && processorCores >= 4) || /iPhone 13|iPhone 12|Galaxy S21|Pixel 6/i.test(userAgent)) {
                fpsLevel = "60 FPS"; // دعم 60 إطار للأجهزة متوسطة القوة
            } else if (ram >= 3 && processorCores >= 2) {
                fpsLevel = "45-60 FPS (محسنة)"; // معدل إطارات متغير
            } else {
                fpsLevel = "30 FPS (مستقرة)"; // معدل إطارات ثابت للأجهزة الضعيفة
            }
            
            // إعدادات الظلال والتأثيرات
            let shadowQuality;
            
            if (ram >= 8 || processorCores >= 8) {
                shadowQuality = "عالية+"; // جودة فائقة للظلال
            } else if (ram >= 6 || processorCores >= 6) {
                shadowQuality = "عالية"; // جودة عالية للظلال
            } else if (ram >= 4 || processorCores >= 4) {
                shadowQuality = "متوسطة"; // جودة متوسطة للظلال
            } else {
                shadowQuality = "منخفضة"; // جودة منخفضة للظلال
            }
            
            // تأثيرات HDR المحسنة
            const hdrSupport = (ram >= 6 || /iPhone 13|iPhone 14|iPhone 15|Galaxy S21|S22|S23|Pixel 7|Pixel 8/i.test(userAgent)) ? "مدعوم" : "غير مدعوم";
            
            // تقنية تتبع الأشعة (Ray Tracing)
            const rayTracingSupport = (ram >= 8 && processorCores >= 8) || /iPhone 15 Pro|Galaxy S23 Ultra/i.test(userAgent) ? "مدعوم" : "غير مدعوم";
            
            // أقصى مسافة عرض
            let viewDistance;
            
            if (ram >= 8 || processorCores >= 8) {
                viewDistance = "قصوى (عالية+)";
            } else if (ram >= 6 || processorCores >= 6) {
                viewDistance = "بعيدة (عالية)";
            } else if (ram >= 4 || processorCores >= 4) {
                viewDistance = "متوسطة";
            } else {
                viewDistance = "قريبة (منخفضة)";
            }
            
            // تقدير دقة النسيج (Texture Resolution)
            let textureResolution;
            
            if (ram >= 8 || resolution >= 2073600) { // 1080p أو أعلى
                textureResolution = "عالية+ (Ultra HD)";
            } else if (ram >= 6 || resolution >= 1280 * 720) {
                textureResolution = "عالية (HD)";
            } else if (ram >= 4) {
                textureResolution = "متوسطة";
            } else {
                textureResolution = "منخفضة";
            }
            
            // معلومات عن الجهاز
            const gpuInfo = getGPUInfo();
            
            // معلومات مستعرض الويب
            const browserInfo = getBrowserInfo();
            
            storage.then(storageSize => {
                const graphicsResult = document.getElementById('graphics-result');
                graphicsResult.innerHTML = `
                    <div><span>نوع الجهاز:</span> <span>${deviceType} (${deviceTier})</span></div>
                    <div><span>نظام التشغيل:</span> <span>${osType}</span></div>
                    <div><span>المتصفح:</span> <span>${browserInfo}</span></div>
                    <div><span>الرام المقدرة:</span> <span>${ram} جيجابايت</span></div>
                    <div><span>أنوية المعالج:</span> <span>${processorCores}</span></div>
                    <div><span>معالج الرسومات:</span> <span>${gpuInfo}</span></div>
                    <div><span>المساحة المقدرة:</span> <span>${storageSize} جيجابايت</span></div>
                    <div><span>دقة الشاشة:</span> <span>${width}×${height} (${deviceDPI} DPI)</span></div>
                    <div><span>نسبة العرض:</span> <span>${aspectRatio}</span></div>
                    <div><span>إعدادات الجرافيك:</span> <span>${graphicsLevel}</span></div>
                    <div><span>إعدادات الإطارات:</span> <span>${fpsLevel}</span></div>
                    <div><span>جودة الظلال:</span> <span>${shadowQuality}</span></div>
                    <div><span>دعم HDR:</span> <span>${hdrSupport}</span></div>
                    <div><span>تتبع الأشعة:</span> <span>${rayTracingSupport}</span></div>
                    <div><span>مسافة العرض:</span> <span>${viewDistance}</span></div>
                    <div><span>دقة النسيج:</span> <span>${textureResolution}</span></div>
                    <div><span>تاريخ التوليد:</span> <span>${currentDate}</span></div>
                `;
                
                // إضافة تأثير ظهور تدريجي لعناصر الجدول
                const items = graphicsResult.querySelectorAll('div');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 100 * index);
                });
            }).catch(() => {
                alert("حدث خطأ أثناء توليد إعدادات الجرافيك!");
            });
        }
        
        // الحصول على معلومات معالج الرسومات
        function getGPUInfo() {
            let gpuInfo = "غير معروف";
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        if (renderer) {
                            // تبسيط معلومات معالج الرسومات
                            gpuInfo = renderer.replace(/(ANGLE )?\([^)]*\)/g, '')
                            .replace(/(Direct3D|OpenGL|Metal)[^\d]*[\d\.]+/g, '')
                            .replace(/NVIDIA/i, 'NVIDIA')
                            .replace(/AMD/i, 'AMD')
                            .replace(/Intel/i, 'Intel')
                            .replace(/Mali/i, 'Mali')
                            .replace(/Adreno/i, 'Adreno')
                            .trim();
                            
                            // إذا كان المعلومات طويلة جدًا، أخذ المعلومات المهمة فقط
                            if (gpuInfo.length > 30) {
                                const gpuMatches = gpuInfo.match(/(NVIDIA|AMD|Intel|Mali|Adreno|PowerVR|Apple)[^\d]*[\d\.]+/i);
                                if (gpuMatches) {
                                    gpuInfo = gpuMatches[0].trim();
                                } else {
                                    gpuInfo = gpuInfo.substring(0, 30) + '...';
                                }
                            }
                        }
                    }
                }
                
                // إذا لم نتمكن من الحصول على معلومات عن معالج الرسومات
                if (gpuInfo === "غير معروف") {
                    // محاولة تقدير نوع معالج الرسومات من معلومات متصفح المستخدم
                    const userAgent = navigator.userAgent;
                    if (/iPhone|iPad/i.test(userAgent)) {
                        if (/iPhone 15 Pro|iPhone 14 Pro/i.test(userAgent)) {
                            gpuInfo = "Apple A17/A16 GPU";
                        } else if (/iPhone 13|iPhone 14/i.test(userAgent)) {
                            gpuInfo = "Apple A15/A16 GPU";
                        } else if (/iPhone 12/i.test(userAgent)) {
                            gpuInfo = "Apple A14 GPU";
                        } else if (/iPhone 11/i.test(userAgent)) {
                            gpuInfo = "Apple A13 GPU";
                        } else if (/iPad Pro/i.test(userAgent)) {
                            gpuInfo = "Apple M1/M2 GPU";
                        } else {
                            gpuInfo = "Apple GPU";
                        }
                    } else if (/Galaxy S23/i.test(userAgent)) {
                        gpuInfo = "Adreno 740";
                    } else if (/Galaxy S22/i.test(userAgent)) {
                        gpuInfo = "Adreno 730";
                    } else if (/Galaxy S21/i.test(userAgent)) {
                        gpuInfo = "Adreno 660";
                    } else if (/Pixel 8/i.test(userAgent)) {
                        gpuInfo = "Tensor G3 GPU";
                    } else if (/Pixel 7/i.test(userAgent)) {
                        gpuInfo = "Tensor G2 GPU";
                    } else if (/Pixel 6/i.test(userAgent)) {
                        gpuInfo = "Tensor G1 GPU";
                    }
                }
                
                return gpuInfo || "غير معروف";
            } catch (e) {
                console.log("خطأ في الحصول على معلومات معالج الرسومات:", e);
                return "غير معروف";
            }
        }
        
        // الحصول على معلومات المتصفح
        function getBrowserInfo() {
            const userAgent = navigator.userAgent;
            
            // محاولة تحديد نوع المتصفح
            if (/Firefox/i.test(userAgent)) {
                return "Firefox";
            } else if (/MSIE|Trident/i.test(userAgent)) {
                return "Internet Explorer";
            } else if (/Edge/i.test(userAgent)) {
                return "Edge";
            } else if (/Chrome/i.test(userAgent) && !/Chromium|OPR|Edg/i.test(userAgent)) {
                return "Chrome";
            } else if (/Safari/i.test(userAgent) && !/Chrome|Chromium/i.test(userAgent)) {
                return "Safari";
            } else if (/Opera|OPR/i.test(userAgent)) {
                return "Opera";
            } else if (/Chromium/i.test(userAgent)) {
                return "Chromium";
            } else if (/UCBrowser/i.test(userAgent)) {
                return "UC Browser";
            } else if (/Samsung/i.test(userAgent)) {
                return "Samsung Browser";
            } else {
                return "غير معروف";
            }
        }
        
        // وظيفة لاختبار أداء الجهاز
        function testDevicePerformance() {
            const startTime = performance.now();
            let result = 0;
            for (let i = 0; i < 1000000; i++) {
                result += Math.sqrt(i);
            }
            const endTime = performance.now();
            const timeTaken = endTime - startTime;
            
            // كلما قل وقت التنفيذ كلما كان الجهاز أقوى
            // نحول الوقت إلى مقياس من 0 إلى 1 (1 = أسرع، 0 = أبطأ)
            const normalizedScore = Math.max(0, Math.min(1, 1 - (timeTaken / 1000)));
            return normalizedScore;
        }
        
        // وظيفة لتقدير عدد أنوية المعالج
        function calculateEstimatedCores() {
            const performanceScore = testDevicePerformance();
            if (performanceScore > 0.8) return 8;
            else if (performanceScore > 0.6) return 6;
            else if (performanceScore > 0.4) return 4;
            else if (performanceScore > 0.2) return 2;
            else return 1;
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
        languageSelect.addEventListener('change', async function() {
            const language = this.value;
            if (language === 'ar') {
                // استعادة النص الأصلي باللغة العربية
                AITranslator.restoreOriginalText();
            } else {
                // ترجمة الصفحة إلى اللغة المحددة
                await AITranslator.translatePage(language);
            }
        });

        // تحديث النصوص بناءً على اللغة المختارة
        function updateTexts(language) {
            const translations = {
                ar: {
                    homeTitle: "توليد إعدادات Free Fire",
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
                    homeTitle: "Free Fire Settings Generator",
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
                    homeTitle: "Generador de Configuración Free Fire",
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
                    homeTitle: "Generatore di Configurazione Free Fire",
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
                    homeTitle: "Gerador de Configuração Free Fire",
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
            
            if (extraNavbar.style.display === 'block') {
                extraNavbar.style.display = 'none';
            } else {
                extraNavbar.style.display = 'block';
                
                // إضافة تأثير ظهور تدريجي للعناصر
                const navLinks = extraNavbar.querySelectorAll('a');
                navLinks.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateY(0)';
                    }, 100 * index);
                });
                
                // إبراز زر إعدادات اللاعبين
                const playersSettingsLink = extraNavbar.querySelector('.players-settings-link');
                if (playersSettingsLink) {
                    setTimeout(() => {
                        playersSettingsLink.classList.add('highlight-link');
                        setTimeout(() => {
                            playersSettingsLink.classList.remove('highlight-link');
                        }, 1000);
                    }, 500);
                }
            }
        }

        // إغلاق شريط التنقل الإضافي عند النقر خارجها
        window.addEventListener('click', function(event) {
            const extraNavbar = document.getElementById('extraNavbar');
            const moreLink = document.querySelector('.navbar a[href="#more"]');
            
            if (event.target !== moreLink && !extraNavbar.contains(event.target) && !moreLink.contains(event.target)) {
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
            showUnderDevelopmentMessage();
        }

        // إغلاق صفحة الدردشة
        function closeChat() {
            const chatContainer = document.getElementById('chatContainer');
            chatContainer.style.display = 'none';
        }
        
        // إظهار صفحة إعدادات اللاعبين مع تأثير بصري
        function showPlayersSettings() {
            showPage('players-settings');
            loadPlayerSettings();
            
            // إضافة تأثير بصري على الصفحة
            const container = document.getElementById('players-settings');
            container.classList.add('fade-in');
            setTimeout(() => {
                container.classList.remove('fade-in');
            }, 500);
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

// توليد حساسيات ببجي موبايل
function calculatePubgSensitivity() {
    const speed = document.querySelector('input[name="pubg-speed"]:checked').value;
    const gyro = document.querySelector('input[name="gyro"]:checked').value;
    
    let sensitivities = {
        camera: 0,
        ads: 0,
        scope3x: 0,
        scope4x: 0,
        scope6x: 0,
        scope8x: 0,
        gyroScope3x: 0,
        gyroScope4x: 0,
        gyroScope6x: 0,
        gyroScope8x: 0
    };

    // تعيين الحساسيات بناءً على السرعة المختارة
    if (speed === "fast") {
        sensitivities = {
            camera: Math.floor(Math.random() * (300 - 250) + 250),
            ads: Math.floor(Math.random() * (150 - 120) + 120),
            scope3x: Math.floor(Math.random() * (60 - 45) + 45),
            scope4x: Math.floor(Math.random() * (45 - 35) + 35),
            scope6x: Math.floor(Math.random() * (35 - 25) + 25),
            scope8x: Math.floor(Math.random() * (25 - 20) + 20),
            gyroScope3x: Math.floor(Math.random() * (400 - 300) + 300),
            gyroScope4x: Math.floor(Math.random() * (350 - 250) + 250),
            gyroScope6x: Math.floor(Math.random() * (250 - 200) + 200),
            gyroScope8x: Math.floor(Math.random() * (200 - 150) + 150)
        };
    } else if (speed === "medium") {
        sensitivities = {
            camera: Math.floor(Math.random() * (250 - 200) + 200),
            ads: Math.floor(Math.random() * (120 - 90) + 90),
            scope3x: Math.floor(Math.random() * (45 - 35) + 35),
            scope4x: Math.floor(Math.random() * (35 - 25) + 25),
            scope6x: Math.floor(Math.random() * (25 - 20) + 20),
            scope8x: Math.floor(Math.random() * (20 - 15) + 15),
            gyroScope3x: Math.floor(Math.random() * (300 - 200) + 200),
            gyroScope4x: Math.floor(Math.random() * (250 - 150) + 150),
            gyroScope6x: Math.floor(Math.random() * (200 - 150) + 150),
            gyroScope8x: Math.floor(Math.random() * (150 - 100) + 100)
        };
    } else {
        sensitivities = {
            camera: Math.floor(Math.random() * (200 - 150) + 150),
            ads: Math.floor(Math.random() * (90 - 60) + 60),
            scope3x: Math.floor(Math.random() * (35 - 25) + 25),
            scope4x: Math.floor(Math.random() * (25 - 20) + 20),
            scope6x: Math.floor(Math.random() * (20 - 15) + 15),
            scope8x: Math.floor(Math.random() * (15 - 10) + 10),
            gyroScope3x: Math.floor(Math.random() * (200 - 150) + 150),
            gyroScope4x: Math.floor(Math.random() * (150 - 100) + 100),
            gyroScope6x: Math.floor(Math.random() * (150 - 100) + 100),
            gyroScope8x: Math.floor(Math.random() * (100 - 50) + 50)
        };
    }

    displayPubgSensitivities(sensitivities, gyro);
}

function displayPubgSensitivities(sensitivities, gyro) {
    const resultDiv = document.getElementById('pubg-result');
    let html = `
        <div>حساسية الكاميرا: ${sensitivities.camera}</div>
        <div>حساسية ADS: ${sensitivities.ads}</div>
        <div>حساسية منظار 3x: ${sensitivities.scope3x}</div>
        <div>حساسية منظار 4x: ${sensitivities.scope4x}</div>
        <div>حساسية منظار 6x: ${sensitivities.scope6x}</div>
        <div>حساسية منظار 8x: ${sensitivities.scope8x}</div>
    `;

    if (gyro !== 'off') {
        html += `
            <div>جيروسكوب منظار 3x: ${sensitivities.gyroScope3x}</div>
            <div>جيروسكوب منظار 4x: ${sensitivities.gyroScope4x}</div>
            <div>جيروسكوب منظار 6x: ${sensitivities.gyroScope6x}</div>
            <div>جيروسكوب منظار 8x: ${sensitivities.gyroScope8x}</div>
        `;
    }

    html += `
        <div class="action-buttons">
            <button onclick="sharePubgSensitivity()"><i class="fas fa-share"></i> مشاركة</button>
            <button onclick="savePubgSettings()"><i class="fas fa-save"></i> حفظ</button>
        </div>
    `;

    resultDiv.innerHTML = html;
    resultDiv.classList.add('fade-in');
}

function generatePubgGraphicsSettings() {
    const graphicsResult = document.getElementById('pubg-graphics-result');
    const settings = {
        'صيغة الرسومات': ['HDR', 'Ultra HD', 'HD'][Math.floor(Math.random() * 3)],
        'نمط اللون': ['واقعي', 'مشرق'][Math.floor(Math.random() * 2)],
        'معدل الإطارات': ['عالي', 'متوسط', 'منخفض'][Math.floor(Math.random() * 3)],
        'الظلال': ['متوسط', 'منخفض'][Math.floor(Math.random() * 2)],
        'مكافحة التشويش': ['تشغيل', 'إيقاف'][Math.floor(Math.random() * 2)],
        'التكيف التلقائي للجودة': ['تشغيل', 'إيقاف'][Math.floor(Math.random() * 2)]
    };

    let html = '';
    for (let setting in settings) {
        html += `<div><span>${setting}:</span> <span>${settings[setting]}</span></div>`;
    }

    graphicsResult.innerHTML = html;
    graphicsResult.classList.add('fade-in');
}

function generateRandomPubgSensitivity() {
    calculatePubgSensitivity();
}

function sharePubgSensitivity() {
    const settings = document.getElementById('pubg-result').innerText;
    if (navigator.share) {
        navigator.share({
            title: 'حساسيات PUBG Mobile',
            text: settings
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(settings).then(() => {
            alert("تم نسخ الإعدادات إلى الحافظة!");
        }).catch(() => {
            alert("حدث خطأ أثناء نسخ الإعدادات!");
        });
    }
}

function savePubgSettings() {
    const settings = document.getElementById('pubg-result').innerHTML;
    const graphics = document.getElementById('pubg-graphics-result').innerHTML;
    const savedSettings = JSON.parse(localStorage.getItem('savedPubgSettings') || '[]');
    
    savedSettings.push({
        date: new Date().toLocaleString(),
        settings: settings,
        graphics: graphics
    });
    
    localStorage.setItem('savedPubgSettings', JSON.stringify(savedSettings));
    alert('تم حفظ إعدادات ببجي بنجاح!');
}

// وظائف حماية الموقع
(function() {
    // تشفير النصوص في الصفحة
    function encryptContent() {
        const elements = document.querySelectorAll('div, p, span, h1, h2, h3');
        elements.forEach(element => {
            if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
                const text = element.textContent;
                element.setAttribute('data-text', btoa(text));
                element.textContent = text;
            }
        });
    }

    // منع استخراج النصوص
    function preventTextExtraction() {
        document.addEventListener('selectstart', function(e) {
            if (!e.target.matches('input, textarea')) {
                e.preventDefault();
                return false;
            }
        });
    }

    // إخفاء الأكواد المصدرية
    function obfuscateSource() {
        // إضافة تعليقات مضللة
        for (let i = 0; i < 100; i++) {
            console.log(`%c`, `padding: ${Math.random() * 100}px; line-height: ${Math.random() * 100}px; background: ${Math.random()}`);
        }
        
        // تعطيل console.log
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
        
        // تشويش على أدوات المطور
        setInterval(() => {
            console.clear();
            debugger;
        }, 100);
    }

    // كشف محاكي الهواتف
    function detectEmulator() {
        const userAgent = navigator.userAgent.toLowerCase();
        const emulatorSigns = ['android studio', 'sdk', 'nox', 'bluestacks', 'memu', 'localhost'];
        
        if (emulatorSigns.some(sign => userAgent.includes(sign))) {
            document.body.innerHTML = '<h1>غير مسموح باستخدام المحاكي</h1>';
            return false;
        }
        return true;
    }

    // التحقق من مصدر الزيارة
    function checkReferrer() {
        const allowedDomains = ['yourwebsite.com', 'localhost'];
        const referrer = document.referrer;
        
        if (referrer && !allowedDomains.some(domain => referrer.includes(domain))) {
            window.location.href = "about:blank";
        }
    }

    // منع التحميل في إطار
    function preventFraming() {
        if (window !== window.top) {
            window.top.location.href = window.location.href;
        }
    }

    // تنفيذ وظائف الحماية
    window.addEventListener('DOMContentLoaded', function() {
        encryptContent();
        preventTextExtraction();
        obfuscateSource();
        detectEmulator();
        checkReferrer();
        preventFraming();
    });

    // منع استخدام مفاتيح التطوير
    window.addEventListener('keydown', function(e) {
        if (
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
            (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) ||
            (e.key === 'F12')
        ) {
            e.preventDefault();
            return false;
        }
    });

    // منع السحب والإفلات
    window.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });

    // منع النسخ
    window.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
})();
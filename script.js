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

        // توليد حساسية عشوائية بناءً على السرعة المختارة والعوامل الفنية للشاشة - محسنة للتحديث الجديد
        function generateRandomSensitivity() {
            const speed = document.querySelector('input[name="speed"]:checked').value;
            
            // الحصول على خصائص الشاشة
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;
            const deviceDPI = window.devicePixelRatio * 96 || 96;
            const screenDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 96; // بالإنش التقريبي
            
            // عامل دقة الشاشة محسن للتحديث الجديد
            const resolutionFactor = Math.sqrt(width * height) / 900;
            
            // عامل للـ DPI - تعديل ليتناسب مع السرعة المختارة
            const dpiMultiplier = Math.min(1.3, Math.max(0.9, deviceDPI / 120));
            
            // عامل حجم الشاشة (الشاشات الكبيرة تحتاج حساسية مختلفة)
            const screenSizeMultiplier = 1.0 + (screenDiagonal > 6 ? 0.05 : -0.05);
            
            // تحديد النطاق بناءً على السرعة المختارة بشكل دقيق
            let baseMinValue, baseMaxValue;
            
            if (speed === "fast") {
                // سريعة - نطاق مناسب للسرعة العالية
                baseMinValue = 150;
                baseMaxValue = 200;
            } else if (speed === "medium") {
                // متوسطة - نطاق متوسط لتناسب معظم اللاعبين
                baseMinValue = 100;
                baseMaxValue = 140;
            } else if (speed === "slow") {
                // بطيئة - نطاق أقل للتحكم الدقيق
                baseMinValue = 50;
                baseMaxValue = 90;
            }
            
            // تطبيق عوامل تصحيح للأجهزة المختلفة بشكل معتدل
            // تقليل تأثير المضاعفات لضمان احترام اختيار المستخدم للسرعة
            const deviceAdjustmentFactor = (dpiMultiplier * screenSizeMultiplier - 1.0) * 0.3 + 1.0;
            baseMinValue = Math.round(baseMinValue * deviceAdjustmentFactor);
            baseMaxValue = Math.round(baseMaxValue * deviceAdjustmentFactor);
            
            // ضمان أن القيم تظل ضمن الحدود المناسبة للعبة (10-200)
            baseMinValue = Math.min(Math.max(baseMinValue, 10), 190);
            baseMaxValue = Math.min(Math.max(baseMaxValue, baseMinValue + 10), 200);
            
            // عامل أبعاد الشاشة محسّن - أفضل للنسبة 16:9
            const aspectRatioMultiplier = aspectRatio >= 1.7 && aspectRatio <= 1.8 ? 1.03 : 0.97;
            
            // توليد القيمة الأساسية للحساسية وفقًا للنطاق المحدد
            const baseValue = Math.floor(Math.random() * (baseMaxValue - baseMinValue + 1)) + baseMinValue;
            
            // حساب معاملات التصحيح لكل نوع من الحساسيات بناءً على السرعة المختارة
            let generalMult, redDotMult, scope2xMult, scope4xMult, sniperMult, freeLookMult;
            
            if (speed === "fast") {
                // سريعة - نسب مناسبة للسرعة العالية
                generalMult = 1.0;    // حساسية عامة عالية
                redDotMult = 0.97;    // حساسية النقطة الحمراء قريبة من العامة
                scope2xMult = 0.94;   // تقليل طفيف للسكوب 2x
                scope4xMult = 0.85;   // تقليل معتدل للسكوب 4x
                sniperMult = 0.7;     // تقليل متوسط للقناصة
                freeLookMult = 1.05;  // زيادة للنظر الحر
            } else if (speed === "medium") {
                // متوسطة - توازن بين السرعة والدقة
                generalMult = 1.0;    // حساسية عامة متوازنة
                redDotMult = 0.95;    // تقليل طفيف للنقطة الحمراء
                scope2xMult = 0.85;   // تقليل متوسط للسكوب 2x
                scope4xMult = 0.75;   // تقليل معتدل للسكوب 4x
                sniperMult = 0.6;     // تقليل كبير للقناصة
                freeLookMult = 1.03;  // زيادة للنظر الحر
            } else { // slow
                // بطيئة - تركيز على الدقة 
                generalMult = 1.0;    // حساسية عامة منخفضة
                redDotMult = 0.93;    // تقليل طفيف للنقطة الحمراء
                scope2xMult = 0.8;    // تقليل متوسط للسكوب 2x
                scope4xMult = 0.7;    // تقليل كبير للسكوب 4x 
                sniperMult = 0.5;     // تقليل كبير للقناصة للدقة العالية
                freeLookMult = 1.02;  // زيادة طفيفة للنظر الحر
            }
            
            // إضافة عنصر عشوائي صغير لتنويع النتائج مع الحفاظ على النطاق المحدد
            const randomFactor = 0.95 + (Math.random() * 0.1); // 0.95-1.05
            
            // حساب الحساسيات مع مراعاة عوامل التصحيح والعوامل الفنية
            sensitivities.general = Math.min(200, Math.max(10, Math.round(baseValue * generalMult * aspectRatioMultiplier * randomFactor)));
            sensitivities.redDot = Math.min(200, Math.max(10, Math.round(baseValue * redDotMult * aspectRatioMultiplier * randomFactor)));
            sensitivities.scope2x = Math.min(200, Math.max(10, Math.round(baseValue * scope2xMult * aspectRatioMultiplier * randomFactor)));
            sensitivities.scope4x = Math.min(200, Math.max(10, Math.round(baseValue * scope4xMult * aspectRatioMultiplier * randomFactor)));
            sensitivities.sniper = Math.min(200, Math.max(10, Math.round(baseValue * sniperMult * aspectRatioMultiplier * randomFactor)));
            sensitivities.freeLook = Math.min(200, Math.max(10, Math.round(baseValue * freeLookMult * aspectRatioMultiplier * randomFactor)));
            sensitivities.fireButtonSize = generateFireButtonSize(); // تحديث حجم زر الضرب
            
            // تأثير بصري لعرض الحساسيات
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
            // استخراج معلومات الجهاز
            const ram = navigator.deviceMemory || 4; // الرام (بالجيجابايت)
            const processorCores = navigator.hardwareConcurrency || 4; // عدد أنوية المعالج
            
            // معلومات الشاشة
            const width = window.innerWidth;
            const height = window.innerHeight;
            const resolution = width * height;
            const aspectRatio = width / height;
            const deviceDPI = window.devicePixelRatio * 96 || 96;
            
            // التخزين
            const storage = navigator.storage.estimate().then(estimate => {
                return (estimate.quota / (1024 * 1024 * 1024)).toFixed(2); // المساحة (بالجيجابايت)
            });

            // تقدير نوع الجهاز (هاتف أم جهاز لوحي)
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const deviceType = width < 768 ? "هاتف" : "جهاز لوحي";
            
            // معايير الجرافيك الجديدة للتحديث الجديد
            let graphicsLevel;
            if (ram >= 8 && processorCores >= 6 && resolution >= 2073600) { // 1080p أو أعلى
                graphicsLevel = "فائقة+"; // مستوى جديد للتحديث الجديد
            } else if (ram >= 6 && processorCores >= 4 && resolution >= 1280 * 720) {
                graphicsLevel = "فائقة";
            } else if (ram >= 4 && processorCores >= 3) {
                graphicsLevel = "عالية";
            } else if (ram >= 2 && processorCores >= 2) {
                graphicsLevel = "متوسطة";
            } else {
                graphicsLevel = "منخفضة";
            }

            // معدل الإطارات (FPS) مع مراعاة دقة الشاشة وعدد البكسلات
            let fpsLevel;
            const pixelCount = width * height;
            
            if (ram >= 6 && processorCores >= 6 && resolution >= 2073600) {
                fpsLevel = "90 FPS"; // دعم الـ 90 إطار للأجهزة القوية
            } else if (ram >= 4 && processorCores >= 4 && pixelCount >= 921600) { // 720p أو أعلى
                fpsLevel = "60 FPS";
            } else if (ram >= 3 && processorCores >= 2) {
                fpsLevel = "45-60 FPS (محسنة)";
            } else {
                fpsLevel = "30 FPS (منخفضة)";
            }
            
            // الظلال والتأثيرات
            let shadowQuality;
            if (ram >= 6 && processorCores >= 4) {
                shadowQuality = "عالية";
            } else if (ram >= 3 && processorCores >= 2) {
                shadowQuality = "متوسطة";
            } else {
                shadowQuality = "منخفضة";
            }
            
            // تأثيرات HDR
            const hdrSupport = (ram >= 4 && processorCores >= 4) ? "مدعوم" : "غير مدعوم";
            
            // الحد الأقصى لدرجة الحرارة المناسبة
            let tempThreshold;
            if (ram >= 6) {
                tempThreshold = "45°C";
            } else if (ram >= 4) {
                tempThreshold = "42°C";
            } else {
                tempThreshold = "40°C";
            }

            storage.then(storageSize => {
                const graphicsResult = document.getElementById('graphics-result');
                graphicsResult.innerHTML = `
                    <div>نوع الجهاز: ${deviceType}</div>
                    <div>الرام: ${ram} جيجابايت</div>
                    <div>أنوية المعالج: ${processorCores}</div>
                    <div>المساحة: ${storageSize} جيجابايت</div>
                    <div>دقة الشاشة: ${width}×${height} (${Math.round(deviceDPI)} DPI)</div>
                    <div>نسبة العرض: ${aspectRatio.toFixed(2)}</div>
                    <div>إعدادات الجرافيك: ${graphicsLevel}</div>
                    <div>إعدادات الإطارات: ${fpsLevel}</div>
                    <div>جودة الظلال: ${shadowQuality}</div>
                    <div>دعم HDR: ${hdrSupport}</div>
                    <div>الحد الأقصى لدرجة الحرارة: ${tempThreshold}</div>
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
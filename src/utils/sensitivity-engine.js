// ============================================
// Sensitivity Engine v3.0 - Optimized & Scientific
// ============================================

/**
 * محرك حساب الحساسية المحسّن
 * يستخدم معادلات علمية دقيقة بناءً على:
 * - دراسات اللاعبين المحترفين
 * - بيانات حقيقية من الأجهزة
 * - معايير صناعة الألعاب
 */

export class SensitivityEngine {
    constructor() {
        this.deviceProfile = this.detectDeviceProfile();
        this.version = '3.0.0';
    }

    // ============================================
    // Device Detection - محسّن وأكثر دقة
    // ============================================
    detectDeviceProfile() {
        const width = window.screen.width || window.innerWidth;
        const height = window.screen.height || window.innerHeight;
        const pixelRatio = window.devicePixelRatio || 1;
        
        // حساب الدقة الفعلية
        const physicalWidth = width * pixelRatio;
        const physicalHeight = height * pixelRatio;
        const totalPixels = physicalWidth * physicalHeight;
        
        // نسبة العرض للارتفاع
        const aspectRatio = width / height;
        
        // تحديد نوع الجهاز بدقة
        const deviceType = this.detectDeviceType();
        
        // الذاكرة العشوائية (API حقيقي)
        const ram = navigator.deviceMemory || this.estimateRAM();
        
        // عدد أنوية المعالج
        const cpuCores = navigator.hardwareConcurrency || this.estimateCores();
        
        // مستوى الأداء (محسّن)
        const performanceLevel = this.calculatePerformanceLevel(ram, cpuCores, totalPixels);
        
        // معدل التحديث (تقديري)
        const refreshRate = this.estimateRefreshRate();
        
        return {
            // معلومات الشاشة
            width,
            height,
            physicalWidth,
            physicalHeight,
            pixelRatio,
            totalPixels,
            aspectRatio,
            
            // معلومات الجهاز
            deviceType,
            ram,
            cpuCores,
            performanceLevel,
            refreshRate,
            
            // معرف فريد للجهاز (للتخزين المؤقت)
            deviceId: this.generateDeviceId(),
            
            // وقت الكشف
            detectedAt: Date.now()
        };
    }

    detectDeviceType() {
        const ua = navigator.userAgent;
        const width = window.innerWidth;
        const touchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // كشف دقيق للأجهزة
        if (/iPad|tablet/i.test(ua) || (width >= 768 && width < 1024 && touchScreen)) {
            return 'tablet';
        }
        
        if (/Mobile|Android|iPhone|iPod/i.test(ua) || (width < 768 && touchScreen)) {
            return 'mobile';
        }
        
        return 'desktop';
    }

    estimateRAM() {
        // تقدير ذكي بناءً على الأداء
        const perf = this.quickPerformanceTest();
        
        if (perf > 0.9) return 8;
        if (perf > 0.7) return 6;
        if (perf > 0.5) return 4;
        if (perf > 0.3) return 3;
        return 2;
    }

    estimateCores() {
        // تقدير بناءً على نوع الجهاز
        const deviceType = this.detectDeviceType();
        const perf = this.quickPerformanceTest();
        
        if (deviceType === 'desktop') {
            return perf > 0.8 ? 8 : perf > 0.6 ? 6 : 4;
        }
        
        if (deviceType === 'tablet') {
            return perf > 0.7 ? 8 : perf > 0.5 ? 6 : 4;
        }
        
        return perf > 0.7 ? 8 : perf > 0.5 ? 6 : 4;
    }

    quickPerformanceTest() {
        // اختبار سريع وموثوق
        try {
            const start = performance.now();
            let sum = 0;
            
            // عملية حسابية معقدة
            for (let i = 0; i < 100000; i++) {
                sum += Math.sqrt(i) * Math.sin(i / 1000);
            }
            
            const duration = performance.now() - start;
            
            // تطبيع النتيجة (0-1)
            // أجهزة سريعة: < 5ms
            // أجهزة بطيئة: > 50ms
            return Math.max(0, Math.min(1, 1 - (duration / 50)));
        } catch (e) {
            return 0.5; // قيمة افتراضية
        }
    }

    calculatePerformanceLevel(ram, cores, pixels) {
        // حساب مستوى الأداء الشامل (0-1)
        
        // عامل الذاكرة (0-1)
        const ramFactor = Math.min(ram / 8, 1);
        
        // عامل المعالج (0-1)
        const cpuFactor = Math.min(cores / 8, 1);
        
        // عامل الدقة (0-1)
        const pixelFactor = pixels < 2073600 ? 1 : // < FHD
                           pixels < 8294400 ? 0.9 : // < 4K
                           0.8; // 4K+
        
        // المتوسط المرجح
        return (ramFactor * 0.4 + cpuFactor * 0.3 + pixelFactor * 0.3);
    }

    estimateRefreshRate() {
        // محاولة كشف معدل التحديث
        return new Promise((resolve) => {
            let frameCount = 0;
            const startTime = performance.now();
            
            const countFrames = () => {
                frameCount++;
                if (performance.now() - startTime < 1000) {
                    requestAnimationFrame(countFrames);
                } else {
                    // تقريب لأقرب معدل شائع
                    if (frameCount >= 140) resolve(144);
                    else if (frameCount >= 110) resolve(120);
                    else if (frameCount >= 80) resolve(90);
                    else if (frameCount >= 55) resolve(60);
                    else resolve(30);
                }
            };
            
            requestAnimationFrame(countFrames);
            
            // Fallback بعد 1.5 ثانية
            setTimeout(() => resolve(60), 1500);
        });
    }

    generateDeviceId() {
        // معرف فريد بناءً على خصائص الجهاز
        const profile = `${window.screen.width}x${window.screen.height}-${window.devicePixelRatio}-${navigator.userAgent}`;
        
        // Hash بسيط
        let hash = 0;
        for (let i = 0; i < profile.length; i++) {
            const char = profile.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        
        return Math.abs(hash).toString(36);
    }

    // ============================================
    // Sensitivity Calculation - المحرك الرئيسي
    // ============================================
    
    /**
     * حساب الحساسية الأساسية
     * @param {string} playStyle - نمط اللعب
     * @returns {number} القيمة الأساسية (20-200)
     */
    calculateBaseSensitivity(playStyle) {
        const profile = this.deviceProfile;
        
        // 1. القيمة الأساسية حسب نمط اللعب
        const baseValues = {
            fast: 130,
            medium: 95,
            slow: 65,
            proSniper: 45,
            aggressive: 145,
            tactical: 80
        };
        
        let base = baseValues[playStyle] || 95;
        
        // 2. عامل حجم الشاشة (0.85 - 1.15)
        const screenFactor = this.calculateScreenFactor(profile);
        
        // 3. عامل الأداء (0.9 - 1.1)
        const perfFactor = 0.9 + (profile.performanceLevel * 0.2);
        
        // 4. عامل نوع الجهاز
        const deviceFactor = profile.deviceType === 'mobile' ? 1.08 :
                            profile.deviceType === 'tablet' ? 1.03 : 0.97;
        
        // 5. الحساب النهائي
        base = base * screenFactor * perfFactor * deviceFactor;
        
        // 6. التأكد من النطاق الصحيح
        return this.clamp(Math.round(base), 20, 200);
    }

    calculateScreenFactor(profile) {
        const { totalPixels, aspectRatio, deviceType } = profile;
        
        // عامل الدقة
        let resolutionFactor = 1.0;
        
        if (totalPixels < 1382400) {        // < 720p
            resolutionFactor = 1.12;
        } else if (totalPixels < 2073600) { // 720p - 1080p
            resolutionFactor = 1.05;
        } else if (totalPixels < 3686400) { // 1080p - 1440p
            resolutionFactor = 1.0;
        } else if (totalPixels < 8294400) { // 1440p - 4K
            resolutionFactor = 0.95;
        } else {                             // 4K+
            resolutionFactor = 0.88;
        }
        
        // عامل نسبة العرض للارتفاع
        let aspectFactor = 1.0;
        
        if (deviceType === 'mobile') {
            // الهواتف الحديثة (19:9, 20:9, 21:9)
            if (aspectRatio >= 2.0) aspectFactor = 1.06;
            else if (aspectRatio >= 1.9) aspectFactor = 1.04;
            else if (aspectRatio >= 1.7) aspectFactor = 1.02;
        } else {
            // الأجهزة الأخرى (16:9 هو الأمثل)
            if (aspectRatio >= 1.7 && aspectRatio <= 1.8) aspectFactor = 1.03;
            else if (aspectRatio > 1.8) aspectFactor = 1.01;
            else aspectFactor = 0.98;
        }
        
        return resolutionFactor * aspectFactor;
    }

    /**
     * توليد إعدادات الحساسية الكاملة - Free Fire
     * @param {string} playStyle - نمط اللعب
     * @param {string} fireButtonSize - حجم زر الضرب
     * @param {Object} emulatorSettings - إعدادات المحاكي (اختياري)
     * @returns {Object} الإعدادات الكاملة
     */
    generateSensitivity(playStyle = 'medium', fireButtonSize = 'medium', emulatorSettings = null) {
        // حساب القيمة الأساسية
        let baseValue = this.calculateBaseSensitivity(playStyle);
        
        // تطبيق إعدادات المحاكي إذا وجدت
        if (emulatorSettings) {
            baseValue = this.applyEmulatorAdjustments(baseValue, emulatorSettings);
        }
        
        // معاملات المناظير المحسّنة
        const scopeMultipliers = this.getScopeMultipliers(playStyle);
        
        // حساب قيم كل منظار
        const sensitivities = {
            general: this.clamp(Math.round(baseValue * scopeMultipliers.general), 20, 200),
            redDot: this.clamp(Math.round(baseValue * scopeMultipliers.redDot), 20, 200),
            scope2x: this.clamp(Math.round(baseValue * scopeMultipliers.scope2x), 20, 200),
            scope4x: this.clamp(Math.round(baseValue * scopeMultipliers.scope4x), 20, 200),
            sniper: this.clamp(Math.round(baseValue * scopeMultipliers.sniper), 20, 200),
            freeLook: this.clamp(Math.round(baseValue * scopeMultipliers.freeLook), 20, 200),
            
            // حجم زر الضرب
            fireButtonSize: this.generateFireButtonSize(fireButtonSize)
        };
        
        // التحقق من صحة القيم
        this.validateSensitivities(sensitivities);
        
        return {
            sensitivities,
            playStyle,
            deviceProfile: this.deviceProfile,
            emulatorSettings,
            generatedAt: new Date().toISOString(),
            version: this.version
        };
    }

    getScopeMultipliers(playStyle) {
        // معاملات محسّنة بناءً على بيانات حقيقية
        const multipliers = {
            fast: {
                general: 1.0,
                redDot: 0.90,
                scope2x: 0.78,
                scope4x: 0.63,
                sniper: 0.48,
                freeLook: 1.12
            },
            medium: {
                general: 1.0,
                redDot: 0.87,
                scope2x: 0.71,
                scope4x: 0.57,
                sniper: 0.41,
                freeLook: 1.08
            },
            slow: {
                general: 1.0,
                redDot: 0.84,
                scope2x: 0.65,
                scope4x: 0.50,
                sniper: 0.35,
                freeLook: 1.04
            },
            proSniper: {
                general: 1.0,
                redDot: 0.80,
                scope2x: 0.58,
                scope4x: 0.42,
                sniper: 0.28,
                freeLook: 1.02
            },
            aggressive: {
                general: 1.0,
                redDot: 0.92,
                scope2x: 0.82,
                scope4x: 0.68,
                sniper: 0.52,
                freeLook: 1.15
            },
            tactical: {
                general: 1.0,
                redDot: 0.88,
                scope2x: 0.74,
                scope4x: 0.60,
                sniper: 0.44,
                freeLook: 1.06
            }
        };
        
        return multipliers[playStyle] || multipliers.medium;
    }

    generateGyroscopeSettings(baseValue, playStyle) {
        // حساسية الجيروسكوب (20-100)
        const gyroBase = baseValue * 0.45;
        
        const gyroMultipliers = {
            fast: 0.95,
            medium: 0.85,
            slow: 0.75,
            proSniper: 0.65,
            aggressive: 1.0,
            tactical: 0.80
        };
        
        const multiplier = gyroMultipliers[playStyle] || 0.85;
        
        return {
            general: this.clamp(Math.round(gyroBase * multiplier), 20, 100),
            redDot: this.clamp(Math.round(gyroBase * multiplier * 0.95), 20, 100),
            scope2x: this.clamp(Math.round(gyroBase * multiplier * 0.85), 20, 100),
            scope4x: this.clamp(Math.round(gyroBase * multiplier * 0.75), 20, 100),
            sniper: this.clamp(Math.round(gyroBase * multiplier * 0.60), 20, 100)
        };
    }

    generateFireButtonSize(size) {
        const profile = this.deviceProfile;
        
        // نطاقات محسّنة
        const ranges = {
            small: [18, 38],
            medium: [42, 72],
            large: [76, 98]
        };
        
        let [min, max] = ranges[size] || ranges.medium;
        
        // تعديل حسب نوع الجهاز
        if (profile.deviceType === 'mobile') {
            min += 4;
            max += 4;
        } else if (profile.deviceType === 'desktop') {
            min -= 4;
            max -= 4;
        }
        
        // تعديل حسب حجم الشاشة
        if (profile.width < 400) {
            min -= 6;
            max -= 6;
        } else if (profile.width > 1200) {
            min += 6;
            max += 6;
        }
        
        // قيمة عشوائية في النطاق
        return this.clamp(
            Math.floor(min + Math.random() * (max - min + 1)),
            10,
            100
        );
    }

    applyEmulatorAdjustments(baseValue, settings) {
        if (!settings || !settings.enabled) return baseValue;
        
        let adjusted = baseValue;
        
        // عامل المحاكي الأساسي - تقليل الحساسية بشكل عام للمحاكيات
        // المحاكيات تحتاج حساسية أقل لأن الماوس أدق من اللمس
        adjusted *= 0.65; // تقليل 35% للمحاكيات
        
        // تطبيق DPI المحاكي
        if (settings.emulatorDPI) {
            const dpiRatio = settings.emulatorDPI / 160; // 160 هو DPI القياسي
            // كلما زاد DPI المحاكي، نحتاج حساسية أقل
            adjusted *= (1 / Math.sqrt(dpiRatio));
        }
        
        // تطبيق Mouse DPI
        if (settings.mouseDPI) {
            const mouseFactor = 800 / settings.mouseDPI; // 800 هو DPI القياسي للماوس
            // كلما زاد DPI الماوس، نحتاج حساسية أقل
            adjusted *= mouseFactor;
        }
        
        // تطبيق X/Y Sensitivity
        if (settings.xSensitivity) {
            adjusted *= settings.xSensitivity;
        }
        
        // Precision Mode - دقة إضافية
        if (settings.precisionMode) {
            adjusted *= 0.75; // تقليل 25% للدقة العالية
        }
        
        return adjusted;
    }

    validateSensitivities(sensitivities) {
        // التحقق من صحة جميع القيم
        for (const [key, value] of Object.entries(sensitivities)) {
            if (key === 'gyroscope' || key === 'fireButtonSize') continue;
            
            if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
                console.error(`Invalid sensitivity value for ${key}:`, value);
                sensitivities[key] = 100; // قيمة افتراضية آمنة
            }
            
            if (value < 20 || value > 200) {
                console.warn(`Sensitivity ${key} out of range: ${value}`);
                sensitivities[key] = this.clamp(value, 20, 200);
            }
        }
    }

    // ============================================
    // PUBG Mobile Sensitivity Generation
    // محرك متقدم بخوارزميات معقدة لحساب أفضل حساسية
    // يأخذ في الاعتبار: الجهاز، الشاشة، DPI، الأداء، أسلوب اللعب
    // ============================================
    
    generatePUBGSensitivity(playStyle = 'medium', gyroMode = 'scope') {
        // ============================================
        // المرحلة 1: تحليل شامل لمواصفات الجهاز
        // ============================================
        const deviceAnalysis = this.analyzeDeviceForPUBG(playStyle);
        
        // ============================================
        // المرحلة 2: حساب معاملات التأثير المتعددة
        // ============================================
        const influenceFactors = this.calculateInfluenceFactors(deviceAnalysis, playStyle);
        
        // ============================================
        // المرحلة 3: حساب القيمة الأساسية المعقدة
        // ============================================
        const complexBase = this.calculateComplexBaseSensitivity(
            deviceAnalysis,
            influenceFactors,
            playStyle
        );
        
        // حساب القيمة الأساسية الديناميكية من مواصفات الجهاز
        let baseValue = complexBase.adjusted;
        
        // النطاقات الاحترافية لكل أسلوب لعب
        const professionalRanges = {
            slow: {
                tppRange: [95, 105],      // 95-105%
                fppRange: [70, 80],       // 70-80%
                adsRedDotRange: [61, 67],
                ads2xRange: [36, 40],
                ads3xRange: [21, 24],
                ads4xRange: [21, 24],
                ads6xRange: [12, 16],
                ads8xRange: [12, 20],
                gyroGeneralRange: [280, 320],
                gyroADSRange: [280, 320],
                gyro3xRange: [260, 290],
                gyro6xRange: [110, 130],
                gyro8xRange: [85, 100]
            },
            medium: {
                tppRange: [115, 130],     // 115-130%
                fppRange: [105, 120],     // 105-120%
                adsRedDotRange: [65, 70],
                ads2xRange: [38, 44],
                ads3xRange: [23, 27],
                ads4xRange: [23, 27],
                ads6xRange: [16, 21],
                ads8xRange: [25, 40],
                gyroGeneralRange: [330, 370],
                gyroADSRange: [330, 370],
                gyro3xRange: [280, 320],
                gyro6xRange: [130, 150],
                gyro8xRange: [100, 115]
            },
            fast: {
                tppRange: [140, 150],     // 140-150%
                fppRange: [130, 140],     // 130-140%
                adsRedDotRange: [68, 70],
                ads2xRange: [43, 45],
                ads3xRange: [26, 27],
                ads4xRange: [26, 27],
                ads6xRange: [21, 23],
                ads8xRange: [45, 51],
                gyroGeneralRange: [380, 400],
                gyroADSRange: [380, 400],
                gyro3xRange: [380, 400],
                gyro6xRange: [150, 170],
                gyro8xRange: [115, 125]
            },
            proSniper: {
                tppRange: [95, 105],
                fppRange: [80, 90],
                adsRedDotRange: [63, 67],
                ads2xRange: [36, 40],
                ads3xRange: [21, 23],
                ads4xRange: [21, 23],
                ads6xRange: [12, 16],
                ads8xRange: [12, 18],
                gyroGeneralRange: [300, 340],
                gyroADSRange: [300, 340],
                gyro3xRange: [270, 290],
                gyro6xRange: [115, 135],
                gyro8xRange: [90, 105]
            },
            aggressive: {
                tppRange: [135, 145],
                fppRange: [120, 130],
                adsRedDotRange: [67, 70],
                ads2xRange: [41, 44],
                ads3xRange: [25, 27],
                ads4xRange: [25, 27],
                ads6xRange: [19, 22],
                ads8xRange: [40, 48],
                gyroGeneralRange: [360, 390],
                gyroADSRange: [360, 390],
                gyro3xRange: [330, 370],
                gyro6xRange: [140, 160],
                gyro8xRange: [110, 120]
            },
            tactical: {
                tppRange: [100, 110],
                fppRange: [90, 100],
                adsRedDotRange: [62, 66],
                ads2xRange: [36, 40],
                ads3xRange: [22, 24],
                ads4xRange: [22, 24],
                ads6xRange: [14, 18],
                ads8xRange: [20, 30],
                gyroGeneralRange: [310, 350],
                gyroADSRange: [310, 350],
                gyro3xRange: [280, 310],
                gyro6xRange: [120, 140],
                gyro8xRange: [95, 110]
            }
        };
        
        const ranges = professionalRanges[playStyle] || professionalRanges.medium;
        
        // دالة لحساب قيمة ضمن نطاق بناءً على baseValue
        const calculateInRange = (range, multiplier = 1.0) => {
            const [min, max] = range;
            const normalized = (baseValue / 100) * multiplier; // تطبيع baseValue
            const value = min + (max - min) * Math.min(1, normalized);
            return Math.round(value);
        };
        
        // حساب الحساسيات الديناميكية ضمن النطاقات الاحترافية
        const sensitivities = {
            // Camera Sensitivities (ديناميكية ضمن النطاق الاحترافي)
            camera_tpp: this.clamp(calculateInRange(ranges.tppRange), 50, 200),
            camera_fpp: this.clamp(calculateInRange(ranges.fppRange), 50, 200),
            
            // ADS Base (محسوب من TPP)
            ads: this.clamp(Math.round(calculateInRange(ranges.tppRange) * 0.88), 50, 200),
            
            // Scope Sensitivities (ديناميكية ضمن النطاقات الاحترافية)
            scope_redDot: this.clamp(calculateInRange(ranges.adsRedDotRange), 20, 100),
            scope_2x: this.clamp(calculateInRange(ranges.ads2xRange), 15, 80),
            scope_3x: this.clamp(calculateInRange(ranges.ads3xRange), 10, 50),
            scope_4x: this.clamp(calculateInRange(ranges.ads4xRange), 10, 50),
            scope_6x: this.clamp(calculateInRange(ranges.ads6xRange), 8, 40),
            scope_8x: this.clamp(calculateInRange(ranges.ads8xRange), 5, 80),
            
            // Free Look & Sprint (ديناميكية)
            free_look: this.clamp(Math.round(calculateInRange(ranges.tppRange) * 1.15), 80, 200),
            sprint: this.clamp(Math.round(calculateInRange(ranges.tppRange) * 0.25), 10, 100)
        };

        // Gyroscope Settings (ديناميكية ضمن النطاقات الاحترافية)
        if (gyroMode === 'off') {
            sensitivities.gyro_camera = 0;
            sensitivities.gyro_ads = 0;
            sensitivities.gyro_scope_3x = 0;
            sensitivities.gyro_scope_4x = 0;
            sensitivities.gyro_scope_6x = 0;
            sensitivities.gyro_scope_8x = 0;
        } else {
            const gyroIntensity = gyroMode === 'full' ? 1.15 : 1.0;
            
            sensitivities.gyro_camera = this.clamp(
                Math.round(calculateInRange(ranges.gyroGeneralRange, gyroIntensity)), 
                100, 
                500
            );
            
            sensitivities.gyro_ads = this.clamp(
                Math.round(calculateInRange(ranges.gyroADSRange, gyroIntensity)), 
                100, 
                500
            );
            
            sensitivities.gyro_scope_3x = this.clamp(
                Math.round(calculateInRange(ranges.gyro3xRange, gyroIntensity)), 
                100, 
                500
            );
            
            sensitivities.gyro_scope_4x = this.clamp(
                Math.round(calculateInRange(ranges.gyro3xRange, gyroIntensity)), 
                100, 
                500
            );
            
            sensitivities.gyro_scope_6x = this.clamp(
                Math.round(calculateInRange(ranges.gyro6xRange, gyroIntensity)), 
                50, 
                300
            );
            
            sensitivities.gyro_scope_8x = this.clamp(
                Math.round(calculateInRange(ranges.gyro8xRange, gyroIntensity)), 
                30, 
                250
            );
        }

        sensitivities._gyroMode = gyroMode;

        return {
            sensitivities,
            gyroMode,
            playStyle,
            deviceProfile: this.deviceProfile,
            deviceAnalysis,
            influenceFactors,
            complexBase,
            generatedAt: new Date().toISOString(),
            tips: this.getPUBGTips(playStyle, gyroMode),
            proSettings: {
                description: this.getPUBGProfileDescription(playStyle),
                recommendedFor: this.getPUBGRecommendedFor(playStyle),
                deviceOptimized: true,
                performanceLevel: deviceAnalysis.performanceTier,
                optimizationScore: Math.round(influenceFactors.overallScore * 100)
            }
        };
    }
    
    // ============================================
    // دوال التحليل المعقدة
    // ============================================
    
    analyzeDeviceForPUBG(playStyle = 'medium') {
        const profile = this.deviceProfile;
        
        const screenAnalysis = {
            size: Math.sqrt(Math.pow(profile.width / profile.pixelRatio, 2) + 
                           Math.pow(profile.height / profile.pixelRatio, 2)),
            aspectRatio: profile.width / profile.height,
            pixelDensity: Math.sqrt(profile.totalPixels) / 
                         Math.sqrt(Math.pow(profile.width / profile.pixelRatio, 2) + 
                                  Math.pow(profile.height / profile.pixelRatio, 2)),
            isHighDPI: profile.pixelRatio >= 3,
            isLargeScreen: (profile.width / profile.pixelRatio) >= 6.5,
            touchPrecision: 0.85 + (Math.min(1, profile.pixelRatio / 3) * 0.3)
        };
        
        const performanceAnalysis = {
            cpuScore: Math.min(100, profile.performanceLevel * 100 + Math.min(20, (profile.cpuCores || 4) * 2.5)),
            ramScore: Math.min(100, ((profile.ram || 4) / 12) * 100),
            overallPerformance: profile.performanceLevel,
            estimatedFPS: profile.performanceLevel >= 0.9 ? 90 : profile.performanceLevel >= 0.75 ? 60 : profile.performanceLevel >= 0.6 ? 45 : 30,
            thermalThrottling: 1 - (profile.performanceLevel * 0.6 + ((profile.ram || 4) / 12) * 0.4)
        };
        
        const score = (performanceAnalysis.cpuScore * 0.4 + performanceAnalysis.ramScore * 0.3 + profile.performanceLevel * 100 * 0.3);
        const performanceTier = score >= 85 ? 'flagship' : score >= 70 ? 'high-end' : score >= 55 ? 'mid-range' : score >= 35 ? 'budget' : 'entry-level';
        
        const complexityFactor = (
            (screenAnalysis.touchPrecision * 0.3 + (screenAnalysis.isHighDPI ? 0.2 : 0.1) + 
             (screenAnalysis.isLargeScreen ? 0.15 : 0.1) + Math.min(1, screenAnalysis.pixelDensity / 500) * 0.25) * 0.45 +
            ((performanceAnalysis.cpuScore / 100) * 0.4 + (performanceAnalysis.ramScore / 100) * 0.3 + 
             (1 - performanceAnalysis.thermalThrottling) * 0.3) * 0.55
        );
        
        return {
            screen: screenAnalysis,
            performance: performanceAnalysis,
            performanceTier,
            complexityFactor,
            deviceType: profile.deviceType,
            refreshRate: profile.refreshRate || 60
        };
    }
    
    calculateInfluenceFactors(deviceAnalysis, playStyle) {
        const playStyleFactors = {
            slow: { speed: 0.75, precision: 1.3, reaction: 0.8 },
            medium: { speed: 1.0, precision: 1.0, reaction: 1.0 },
            fast: { speed: 1.35, precision: 0.85, reaction: 1.4 },
            proSniper: { speed: 0.8, precision: 1.5, reaction: 0.9 },
            aggressive: { speed: 1.3, precision: 0.9, reaction: 1.35 },
            tactical: { speed: 0.9, precision: 1.15, reaction: 1.05 }
        };
        
        const styleFactors = playStyleFactors[playStyle] || playStyleFactors.medium;
        
        const deviceFactors = {
            screenSize: deviceAnalysis.screen.isLargeScreen ? 1.1 : 0.95,
            dpi: deviceAnalysis.screen.isHighDPI ? 0.92 : 1.0,
            touchPrecision: deviceAnalysis.screen.touchPrecision,
            performance: 0.8 + (deviceAnalysis.complexityFactor * 0.4),
            thermalCompensation: 1 - (deviceAnalysis.performance.thermalThrottling * 0.15)
        };
        
        const fpsFactors = {
            base: deviceAnalysis.performance.estimatedFPS / 60,
            smoothness: Math.min(1.2, deviceAnalysis.performance.estimatedFPS / 45),
            stability: 1 - (deviceAnalysis.performance.thermalThrottling * 0.2)
        };
        
        const overallScore = (
            deviceAnalysis.complexityFactor * 0.35 +
            deviceFactors.performance * 0.25 +
            deviceFactors.touchPrecision * 0.2 +
            fpsFactors.smoothness * 0.2
        );
        
        return {
            playStyle: styleFactors,
            device: deviceFactors,
            fps: fpsFactors,
            overallScore,
            optimizationLevel: overallScore >= 0.9 ? 'maximum' : overallScore >= 0.75 ? 'high' : overallScore >= 0.6 ? 'medium' : overallScore >= 0.4 ? 'low' : 'minimal'
        };
    }
    
    calculateComplexBaseSensitivity(deviceAnalysis, influenceFactors, playStyle) {
        let baseValue = this.calculateBaseSensitivity(playStyle);
        
        const deviceMultiplier = (
            influenceFactors.device.screenSize * 0.25 +
            influenceFactors.device.dpi * 0.2 +
            influenceFactors.device.touchPrecision * 0.3 +
            influenceFactors.device.performance * 0.15 +
            influenceFactors.device.thermalCompensation * 0.1
        );
        
        const fpsMultiplier = (
            influenceFactors.fps.base * 0.4 +
            influenceFactors.fps.smoothness * 0.35 +
            influenceFactors.fps.stability * 0.25
        );
        
        const styleMultiplier = (
            influenceFactors.playStyle.speed * 0.45 +
            influenceFactors.playStyle.precision * 0.3 +
            influenceFactors.playStyle.reaction * 0.25
        );
        
        const complexValue = baseValue * deviceMultiplier * fpsMultiplier * styleMultiplier * (0.85 + deviceAnalysis.complexityFactor * 0.3);
        
        return {
            raw: baseValue,
            adjusted: complexValue,
            deviceMultiplier,
            fpsMultiplier,
            styleMultiplier,
            finalMultiplier: deviceMultiplier * fpsMultiplier * styleMultiplier
        };
    }
    
    getPUBGTips(playStyle, gyroMode) {
        const tips = [];
        
        if (playStyle === 'fast' || playStyle === 'aggressive') {
            tips.push('حساسية عالية - مناسبة للمواجهات القريبة والسريعة');
            tips.push('استخدم SMG و AR للاستفادة من السرعة');
            tips.push('تدرب على التحكم في الارتداد');
        } else if (playStyle === 'proSniper') {
            tips.push('حساسية منخفضة للدقة في القنص');
            tips.push('استخدم 6x و 8x للمسافات البعيدة');
            tips.push('فعّل الجيروسكوب للتعديلات الدقيقة');
        } else if (playStyle === 'slow') {
            tips.push('حساسية منخفضة للتحكم الكامل');
            tips.push('مثالية للمبتدئين');
            tips.push('ركز على الدقة بدلاً من السرعة');
        } else {
            tips.push('إعدادات متوازنة لجميع المواقف');
            tips.push('مناسبة لجميع أنواع الأسلحة');
        }
        
        if (gyroMode === 'scope' || gyroMode === 'full') {
            tips.push('الجيروسكوب مفعّل - استخدمه للتعديلات الدقيقة');
            tips.push('امسك الهاتف بثبات أثناء التصويب');
        }
        
        tips.push('جرب الإعدادات في Training Ground أولاً');
        tips.push('اضبط حساسية كل سكوب حسب راحتك');
        
        return tips;
    }
    
    getPUBGProfileDescription(playStyle) {
        const descriptions = {
            slow: 'إعدادات بطيئة للدقة والتحكم الكامل - مثالية للمبتدئين',
            medium: 'إعدادات متوازنة احترافية - الأكثر استخداماً من اللاعبين المحترفين',
            fast: 'إعدادات سريعة للمواجهات العدوانية والردود السريعة',
            proSniper: 'إعدادات محسّنة للقنص والمسافات البعيدة',
            aggressive: 'إعدادات هجومية للعب السريع والمواجهات القريبة',
            tactical: 'إعدادات تكتيكية للعب المتأني والاستراتيجي'
        };
        
        return descriptions[playStyle] || descriptions.medium;
    }
    
    getPUBGRecommendedFor(playStyle) {
        const recommendations = {
            slow: ['المبتدئين', 'القناصة', 'اللعب الدفاعي'],
            medium: ['جميع اللاعبين', 'جميع الأسلحة', 'جميع الأوضاع'],
            fast: ['اللاعبين المتقدمين', 'SMG', 'AR', 'المواجهات القريبة'],
            proSniper: ['القناصة المحترفين', 'Bolt Action', 'DMR', 'المسافات البعيدة'],
            aggressive: ['الهجوم السريع', 'SMG', 'Shotgun', 'Hot Drop'],
            tactical: ['اللعب الاستراتيجي', 'Squad', 'Final Circles']
        };
        
        return recommendations[playStyle] || recommendations.medium;
    }

    // ============================================
    // Call of Duty Mobile Sensitivity Generation
    // محسّن بناءً على إعدادات اللاعبين المحترفين 2024-2025
    // ============================================
    // Call of Duty Mobile Sensitivity Generation
    // محسّن بناءً على إعدادات اللاعبين المحترفين 2024-2025
    // ============================================
    
    generateCODSensitivity(rotationMode = 'distance', playStyle = 'standard', gyroMode = 'on', vehicleValue = null, emulatorSettings = null) {
        let base = this.calculateBaseSensitivity(playStyle);
        
        // تطبيق إعدادات المحاكي إذا وجدت
        if (emulatorSettings) {
            base = this.applyEmulatorAdjustments(base, emulatorSettings);
        }
        
        // النطاقات الاحترافية الموصى بها:
        // Standard: 80-100 (محسّن: 90-100)
        // ADS: 130-150 (محسّن: 135-145)
        // Sniper: 50-70
        // Gyro: 130-160 (ADS: 60-85, Sniper: 40-70)
        
        const styleProfiles = {
            standard: {
                // إعدادات متوازنة للاعبين العاديين
                standardBase: 95,      // 90-100 range
                adsMultiplier: 1.45,   // يعطي ~138 (130-150 range)
                sniperMultiplier: 0.65, // يعطي ~62 (50-70 range)
                gyroBase: 145,         // 130-160 range
                gyroADS: 72,           // 60-85 range
                gyroSniper: 55         // 40-70 range
            },
            aggressive: {
                // إعدادات سريعة للعب الهجومي
                standardBase: 100,     // أعلى نطاق
                adsMultiplier: 1.50,   // ~150 (أعلى ADS)
                sniperMultiplier: 0.70,
                gyroBase: 160,         // أعلى جيرو
                gyroADS: 85,
                gyroSniper: 70
            },
            sniper: {
                // إعدادات دقيقة للقناصة
                standardBase: 85,      // أبطأ للدقة
                adsMultiplier: 1.35,   // ~115 (أقل ADS)
                sniperMultiplier: 0.55, // ~47 (أقل للدقة)
                gyroBase: 130,
                gyroADS: 60,
                gyroSniper: 40         // أقل جيرو للدقة
            },
            rusher: {
                // إعدادات للاعبين السريعين (SMG/Shotgun)
                standardBase: 105,
                adsMultiplier: 1.55,
                sniperMultiplier: 0.75,
                gyroBase: 165,
                gyroADS: 88,
                gyroSniper: 75
            }
        };
        
        const profile = styleProfiles[playStyle] || styleProfiles.standard;
        
        // حساب الحساسيات الأساسية بناءً على البروفايل
        const baseStandard = Math.round(profile.standardBase * (base / 100));
        
        // Camera Sensitivities (Standard Mode)
        // النطاق الموصى به: 60-100 للـ MP، 70-110 للـ BR
        const camera_standard = this.clamp(baseStandard, 60, 110);
        
        // ADS Sensitivity (النطاق الاحترافي: 130-150)
        const camera_ads = this.clamp(
            Math.round(baseStandard * profile.adsMultiplier), 
            130, 
            155
        );
        
        // Sniper Sensitivity (النطاق الاحترافي: 50-70)
        const camera_sniper = this.clamp(
            Math.round(baseStandard * profile.sniperMultiplier), 
            45, 
            75
        );

        // Scope Sensitivities (تدرج احترافي)
        // Tactical Scope: 80-90% من ADS
        const scope_tactical = this.clamp(Math.round(camera_ads * 0.85), 110, 140);
        
        // 3x Scope: 70-75% من ADS
        const scope_3x = this.clamp(Math.round(camera_ads * 0.72), 95, 115);
        
        // 4x Scope: 60-65% من ADS
        const scope_4x = this.clamp(Math.round(camera_ads * 0.62), 80, 100);
        
        // 6x Scope: 45-50% من ADS
        const scope_6x = this.clamp(Math.round(camera_ads * 0.47), 60, 80);
        
        // 8x Scope: 30-35% من ADS
        const scope_8x = this.clamp(Math.round(camera_ads * 0.32), 40, 60);

        // Firing Sensitivities (حساسية أثناء إطلاق النار)
        // Standard: نفس camera_standard
        const firing_standard = camera_standard;
        
        // ADS Firing: 105-110% من camera_ads للتحكم أثناء الارتداد
        const firing_ads = this.clamp(Math.round(camera_ads * 1.07), 135, 165);
        
        // Sniper Firing: 110% من camera_sniper
        const firing_sniper = this.clamp(Math.round(camera_sniper * 1.10), 50, 85);
        
        // Vertical Turn Speed (للنظر لأعلى/أسفل)
        const vertical_turn = this.clamp(Math.round(baseStandard * 1.3), 80, 140);

        // Gyroscope Settings (النطاقات الاحترافية)
        let gyro_general = 0;
        let gyro_ads = 0;
        let gyro_sniper = 0;
        
        if (gyroMode === 'on' || gyroMode === 'full') {
            const gyroIntensity = gyroMode === 'full' ? 1.15 : 1.0;
            
            // Gyro General: 130-160
            gyro_general = this.clamp(
                Math.round(profile.gyroBase * gyroIntensity), 
                130, 
                170
            );
            
            // Gyro ADS: 60-85
            gyro_ads = this.clamp(
                Math.round(profile.gyroADS * gyroIntensity), 
                60, 
                90
            );
            
            // Gyro Sniper: 40-70
            gyro_sniper = this.clamp(
                Math.round(profile.gyroSniper * gyroIntensity), 
                40, 
                75
            );
        }

        // Vehicle Sensitivity
        // الموصى به: 100-150 للتحكم الجيد
        const vehicle = vehicleValue !== null ? 
            this.clamp(vehicleValue, 80, 200) : 
            this.clamp(Math.round(baseStandard * 1.3), 100, 160);

        const sensitivities = {
            rotation_mode: rotationMode,
            
            // Camera
            camera_standard,
            camera_ads,
            camera_sniper,
            
            // Scopes
            scope_tactical,
            scope_3x,
            scope_4x,
            scope_6x,
            scope_8x,
            
            // Firing
            firing_standard,
            firing_ads,
            firing_sniper,
            vertical_turn,
            
            // Gyroscope
            gyro_general,
            gyro_ads,
            gyro_sniper,
            
            // Vehicle
            vehicle
        };

        return {
            sensitivities,
            rotationMode,
            playStyle,
            gyroMode,
            deviceProfile: this.deviceProfile,
            generatedAt: new Date().toISOString(),
            
            // معلومات إضافية للاعب
            tips: this.getCODTips(playStyle, gyroMode),
            proSettings: {
                description: this.getCODProfileDescription(playStyle),
                recommendedFor: this.getCODRecommendedFor(playStyle)
            }
        };
    }
    
    getCODTips(playStyle, gyroMode) {
        const tips = [];
        
        if (playStyle === 'aggressive' || playStyle === 'rusher') {
            tips.push('استخدم SMG أو Shotgun للاستفادة من الحساسية العالية');
            tips.push('فعّل Auto Sprint للحركة السريعة');
            tips.push('استخدم Lightweight perk للسرعة الإضافية');
        } else if (playStyle === 'sniper') {
            tips.push('استخدم Hold to ADS للدقة في القنص');
            tips.push('فعّل Gyroscope للتعديلات الدقيقة');
            tips.push('تدرب على Quickscoping في Training Mode');
        } else {
            tips.push('هذه الإعدادات متوازنة لجميع أنواع الأسلحة');
            tips.push('جرب Tap to ADS لسرعة أكبر');
        }
        
        if (gyroMode === 'on' || gyroMode === 'full') {
            tips.push('استخدم الجيروسكوب للتعديلات الدقيقة فقط');
            tips.push('تدرب على الجيروسكوب في Practice vs AI');
        }
        
        tips.push('اضبط FOV بين 80-90 للرؤية الأفضل');
        tips.push('استخدم Fixed Fire Button لبناء Muscle Memory');
        
        return tips;
    }
    
    getCODProfileDescription(playStyle) {
        const descriptions = {
            standard: 'إعدادات متوازنة مناسبة لجميع أنواع الأسلحة والمواقف',
            aggressive: 'إعدادات سريعة للعب الهجومي والمواجهات القريبة',
            sniper: 'إعدادات دقيقة محسّنة للقنص والمسافات البعيدة',
            rusher: 'إعدادات فائقة السرعة للاعبين الذين يفضلون SMG والاندفاع'
        };
        
        return descriptions[playStyle] || descriptions.standard;
    }
    
    getCODRecommendedFor(playStyle) {
        const recommendations = {
            standard: ['AR', 'LMG', 'جميع الأوضاع'],
            aggressive: ['SMG', 'Shotgun', 'Multiplayer', 'Domination', 'Hardpoint'],
            sniper: ['Sniper Rifles', 'Marksman Rifles', 'Battle Royale', 'Search & Destroy'],
            rusher: ['SMG', 'Shotgun', 'TDM', 'Kill Confirmed', 'Free For All']
        };
        
        return recommendations[playStyle] || recommendations.standard;
    }

    // ============================================
    // Graphics Settings
    // ============================================
    
    getGraphicsRecommendations() {
        const profile = this.deviceProfile;
        const { ram, performanceLevel, totalPixels, deviceType } = profile;
        
        // تحديد مستوى الجرافيك
        let graphicsLevel, fpsTarget, shadowQuality, antiAliasing, textureQuality;
        
        // حساب النقاط الإجمالية
        const score = (ram / 8) * 0.4 + performanceLevel * 0.4 + 
                     (totalPixels < 2073600 ? 0.2 : totalPixels < 8294400 ? 0.15 : 0.1);
        
        if (score >= 0.8) {
            graphicsLevel = 'Ultra HD';
            fpsTarget = profile.refreshRate >= 120 ? '120 FPS' : '90 FPS';
            shadowQuality = 'عالية جداً';
            antiAliasing = '4x MSAA';
            textureQuality = 'Ultra';
        } else if (score >= 0.6) {
            graphicsLevel = 'عالية (HD)';
            fpsTarget = '60 FPS';
            shadowQuality = 'عالية';
            antiAliasing = '2x MSAA';
            textureQuality = 'عالية';
        } else if (score >= 0.4) {
            graphicsLevel = 'متوسطة';
            fpsTarget = '45 FPS';
            shadowQuality = 'متوسطة';
            antiAliasing = 'FXAA';
            textureQuality = 'متوسطة';
        } else {
            graphicsLevel = 'منخفضة';
            fpsTarget = '30 FPS';
            shadowQuality = 'منخفضة';
            antiAliasing = 'معطل';
            textureQuality = 'منخفضة';
        }
        
        return {
            graphicsLevel,
            fpsTarget,
            shadowQuality,
            antiAliasing,
            textureQuality,
            viewDistance: score >= 0.7 ? 'بعيدة' : score >= 0.5 ? 'متوسطة' : 'قريبة',
            effects: score >= 0.6 ? 'مفعلة' : 'معطلة',
            postProcessing: score >= 0.7 ? 'مفعل' : 'معطل',
            
            // معلومات إضافية
            deviceInfo: {
                type: deviceType,
                ram: `${ram} GB`,
                resolution: `${profile.width}x${profile.height}`,
                pixelRatio: profile.pixelRatio,
                performanceScore: Math.round(score * 100)
            },
            
            recommendations: this.getOptimizationTips(score)
        };
    }

    getOptimizationTips(score) {
        const tips = [];
        
        if (score < 0.5) {
            tips.push('قم بإغلاق التطبيقات الأخرى أثناء اللعب');
            tips.push('قلل دقة الشاشة في إعدادات اللعبة');
            tips.push('عطّل تسجيل الشاشة والبث المباشر');
        }
        
        if (score < 0.7) {
            tips.push('استخدم وضع توفير الطاقة للحصول على أداء أفضل');
            tips.push('نظف ذاكرة التخزين المؤقت بانتظام');
        }
        
        tips.push('تأكد من تحديث اللعبة لآخر إصدار');
        tips.push('استخدم اتصال إنترنت مستقر');
        
        return tips;
    }

    // ============================================
    // Utility Functions
    // ============================================
    
    clamp(value, min, max) {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return min;
        }
        return Math.min(Math.max(value, min), max);
    }

    // حفظ الإعدادات
    saveSettings(settings, name = 'default') {
        try {
            const saved = JSON.parse(localStorage.getItem('savedSensitivities') || '[]');
            saved.push({
                name,
                settings,
                savedAt: new Date().toISOString()
            });
            localStorage.setItem('savedSensitivities', JSON.stringify(saved));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }

    // تحميل الإعدادات
    loadSettings() {
        try {
            return JSON.parse(localStorage.getItem('savedSensitivities') || '[]');
        } catch (e) {
            console.error('Error loading settings:', e);
            return [];
        }
    }

    // مشاركة الإعدادات
    shareSensitivity(sensitivities) {
        const text = `
🎮 إعدادات Free Fire - RED SETTINGS

📊 الحساسيات:
• عامة: ${sensitivities.general}
• نقطة حمراء: ${sensitivities.redDot}
• سكوب 2x: ${sensitivities.scope2x}
• سكوب 4x: ${sensitivities.scope4x}
• قناصة: ${sensitivities.sniper}
• نظر حر: ${sensitivities.freeLook}
• زر الضرب: ${sensitivities.fireButtonSize}

🎯 الجيروسكوب:
• عامة: ${sensitivities.gyroscope.general}
• نقطة حمراء: ${sensitivities.gyroscope.redDot}
• سكوب 2x: ${sensitivities.gyroscope.scope2x}
• سكوب 4x: ${sensitivities.gyroscope.scope4x}
• قناصة: ${sensitivities.gyroscope.sniper}

تم التوليد بواسطة RED SETTINGS v${this.version}
        `.trim();
        
        return text;
    }
}

// تصدير نسخة واحدة (Singleton)
export const sensitivityEngine = new SensitivityEngine();
export default SensitivityEngine;

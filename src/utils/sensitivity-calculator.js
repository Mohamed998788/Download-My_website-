// Sensitivity Calculator - Advanced Gaming Sensitivity Generator

export class SensitivityCalculator {
    constructor() {
        this.deviceInfo = this.detectDeviceInfo();
    }

    // Detect device information
    detectDeviceInfo() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspectRatio = width / height;
        const deviceDPI = window.devicePixelRatio * 96 || 96;
        const screenDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 96;
        const totalPixels = width * height;
        const resolutionFactor = Math.log10(totalPixels) / 6;
        
        const touchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTablet = /iPad|tablet|Nexus 7|Nexus 10/i.test(navigator.userAgent) || (width > 768 && touchScreen);
        const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

        return {
            width,
            height,
            aspectRatio,
            deviceDPI,
            screenDiagonal,
            totalPixels,
            resolutionFactor,
            touchScreen,
            deviceType,
            performanceLevel: this.testPerformance()
        };
    }

    // Test device performance
    testPerformance() {
        const start = performance.now();
        for (let i = 0; i < 1000000; i++) {
            Math.sqrt(i);
        }
        const end = performance.now();
        const execTime = end - start;
        
        if (execTime < 15) return 1.1;
        if (execTime < 30) return 1.05;
        if (execTime < 60) return 1.0;
        if (execTime < 120) return 0.95;
        return 0.9;
    }

    // Calculate base sensitivity
    calculateBaseSensitivity(speed) {
        const { aspectRatio, deviceDPI, resolutionFactor, screenDiagonal, deviceType, performanceLevel } = this.deviceInfo;
        
        // Base calculation
        let baseSensitivity = Math.round(
            (
                (aspectRatio >= 1.7 && aspectRatio <= 1.8 ? 1.05 : 0.95) *
                (200 / (1 + (deviceDPI / 300))) *
                (80 + (resolutionFactor * 40)) *
                (1 - (screenDiagonal * 0.01))
            )
        );

        // Apply device type adjustments
        const deviceMultiplier = deviceType === "mobile" ? 1.1 : deviceType === "tablet" ? 1.05 : 0.95;
        baseSensitivity = Math.round(baseSensitivity * deviceMultiplier * performanceLevel);

        // Apply speed preference
        let speedMultiplier;
        switch(speed) {
            case 'fast':
                speedMultiplier = 1.5;
                break;
            case 'medium':
                speedMultiplier = 1.0;
                break;
            case 'slow':
                speedMultiplier = 0.7;
                break;
            default:
                speedMultiplier = 1.0;
        }

        return Math.min(Math.max(Math.round(baseSensitivity * speedMultiplier), 20), 200);
    }

    // Generate complete sensitivity settings
    generateSensitivity(speed = 'medium', fireButtonSize = 'medium') {
        const baseValue = this.calculateBaseSensitivity(speed);
        
        // Multipliers for different scope types
        const multipliers = this.getMultipliers(speed);
        
        // Generate balanced random factor
        const getSmartRandom = (scopeType) => {
            const baseFactor = 0.97 + (Math.random() * 0.06);
            const stabilityFactors = {
                general: 1.0,
                redDot: 0.99,
                scope2x: 0.98,
                scope4x: 0.97,
                sniper: 0.96,
                freeLook: 1.01
            };
            return baseFactor * (stabilityFactors[scopeType] || 1.0);
        };

        const sensitivities = {
            general: this.clamp(Math.round(baseValue * multipliers.general * getSmartRandom('general'))),
            redDot: this.clamp(Math.round(baseValue * multipliers.redDot * getSmartRandom('redDot'))),
            scope2x: this.clamp(Math.round(baseValue * multipliers.scope2x * getSmartRandom('scope2x'))),
            scope4x: this.clamp(Math.round(baseValue * multipliers.scope4x * getSmartRandom('scope4x'))),
            sniper: this.clamp(Math.round(baseValue * multipliers.sniper * getSmartRandom('sniper'))),
            freeLook: this.clamp(Math.round(baseValue * multipliers.freeLook * getSmartRandom('freeLook'))),
            gyroscope: this.clamp(Math.round(baseValue * multipliers.gyroscope * 0.5), 20, 100),
            fireButtonSize: this.generateFireButtonSize(fireButtonSize)
        };

        return {
            sensitivities,
            deviceInfo: this.deviceInfo,
            generatedAt: new Date().toISOString()
        };
    }

    // Get multipliers based on speed
    getMultipliers(speed) {
        const multipliers = {
            fast: {
                general: 1.0,
                redDot: 0.98,
                scope2x: 0.95,
                scope4x: 0.88,
                sniper: 0.75,
                freeLook: 1.08,
                gyroscope: 0.85
            },
            medium: {
                general: 1.0,
                redDot: 0.96,
                scope2x: 0.89,
                scope4x: 0.79,
                sniper: 0.65,
                freeLook: 1.05,
                gyroscope: 0.75
            },
            slow: {
                general: 1.0,
                redDot: 0.94,
                scope2x: 0.84,
                scope4x: 0.74,
                sniper: 0.55,
                freeLook: 1.04,
                gyroscope: 0.65
            }
        };
        
        return multipliers[speed] || multipliers.medium;
    }

    // Generate fire button size
    generateFireButtonSize(sizeOption) {
        const { deviceType, width } = this.deviceInfo;
        
        let minRange, maxRange;
        
        switch(sizeOption) {
            case 'small':
                minRange = deviceType === "mobile" ? 15 : 10;
                maxRange = deviceType === "mobile" ? 35 : 30;
                break;
            case 'large':
                minRange = deviceType === "mobile" ? 85 : 80;
                maxRange = deviceType === "mobile" ? 100 : 100;
                if (width < 400) {
                    minRange -= 10;
                    maxRange -= 10;
                }
                break;
            case 'medium':
            default:
                minRange = deviceType === "mobile" ? 45 : 40;
                maxRange = deviceType === "mobile" ? 75 : 70;
                if (width > 1200) {
                    minRange += 5;
                    maxRange += 5;
                }
                break;
        }
        
        return Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    }

    // Clamp value between min and max
    clamp(value, min = 20, max = 200) {
        return Math.min(Math.max(value, min), max);
    }

    // Generate PUBG sensitivity
    generatePubgSensitivity(speed = 'medium', gyro = 'scope') {
        const ranges = {
            fast: {
                camera: [250, 300],
                ads: [120, 150],
                scope3x: [45, 60],
                scope4x: [35, 45],
                scope6x: [25, 35],
                scope8x: [20, 25],
                gyroScope3x: [300, 400],
                gyroScope4x: [250, 350],
                gyroScope6x: [200, 250],
                gyroScope8x: [150, 200]
            },
            medium: {
                camera: [200, 250],
                ads: [90, 120],
                scope3x: [35, 45],
                scope4x: [25, 35],
                scope6x: [20, 25],
                scope8x: [15, 20],
                gyroScope3x: [200, 300],
                gyroScope4x: [150, 250],
                gyroScope6x: [150, 200],
                gyroScope8x: [100, 150]
            },
            slow: {
                camera: [150, 200],
                ads: [60, 90],
                scope3x: [25, 35],
                scope4x: [20, 25],
                scope6x: [15, 20],
                scope8x: [10, 15],
                gyroScope3x: [150, 200],
                gyroScope4x: [100, 150],
                gyroScope6x: [100, 150],
                gyroScope8x: [80, 120]
            }
        };

        const selectedRanges = ranges[speed] || ranges.medium;
        
        const sensitivities = {};
        for (const [key, [min, max]] of Object.entries(selectedRanges)) {
            sensitivities[key] = Math.floor(Math.random() * (max - min + 1)) + min;
        }

        // Adjust gyro based on preference
        if (gyro === 'off') {
            Object.keys(sensitivities).forEach(key => {
                if (key.startsWith('gyro')) {
                    sensitivities[key] = 0;
                }
            });
        }

        return {
            sensitivities,
            gyroEnabled: gyro !== 'off',
            generatedAt: new Date().toISOString()
        };
    }

    // Get graphics recommendations
    getGraphicsRecommendations() {
        const { deviceType, performanceLevel, totalPixels } = this.deviceInfo;
        
        let graphicsLevel, fpsLevel, shadowQuality;
        
        // Determine device tier
        let deviceTier = "medium";
        if (performanceLevel >= 1.05 && totalPixels > 2073600) {
            deviceTier = "high";
        } else if (performanceLevel <= 0.95 || totalPixels < 921600) {
            deviceTier = "low";
        }

        // Graphics settings based on tier
        switch(deviceTier) {
            case "high":
                graphicsLevel = "Ultra";
                fpsLevel = "90-120 FPS";
                shadowQuality = "High";
                break;
            case "low":
                graphicsLevel = "Low";
                fpsLevel = "30-45 FPS";
                shadowQuality = "Low";
                break;
            default:
                graphicsLevel = "Medium";
                fpsLevel = "60 FPS";
                shadowQuality = "Medium";
        }

        return {
            deviceTier,
            graphicsLevel,
            fpsLevel,
            shadowQuality,
            antiAliasing: deviceTier === "high" ? "Enabled" : "Disabled",
            textureQuality: deviceTier === "high" ? "High" : deviceTier === "low" ? "Low" : "Medium",
            viewDistance: deviceTier === "high" ? "Far" : "Medium"
        };
    }

    // Share sensitivity as text
    static shareSensitivityText(sensitivities) {
        return `
🎮 إعدادات Free Fire المولدة:

📊 الحساسيات:
• حساسية عامة: ${sensitivities.general}
• حساسية النقطة الحمراء: ${sensitivities.redDot}
• حساسية سكوب 2x: ${sensitivities.scope2x}
• حساسية سكوب 4x: ${sensitivities.scope4x}
• حساسية القناصة: ${sensitivities.sniper}
• حساسية النظر الحر: ${sensitivities.freeLook}
• حجم زر الضرب: ${sensitivities.fireButtonSize}

تم التوليد بواسطة RED SETTINGS
        `.trim();
    }
}

// Create singleton instance
export const sensitivityCalculator = new SensitivityCalculator();

export default SensitivityCalculator;

// Advanced Sensitivity Calculator with Device-Specific Optimization

export class AdvancedSensitivityCalculator {
    constructor() {
        this.deviceProfile = this.detectDeviceProfile();
        this.savedRandomFactors = this.loadSavedFactors();
    }

    // Detect comprehensive device profile
    detectDeviceProfile() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const deviceDPI = window.devicePixelRatio * 96 || 96;
        const screenDiagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 96;
        const totalPixels = width * height;
        
        // Detect refresh rate (approximation)
        const refreshRate = this.detectRefreshRate();
        
        // Device type detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isTablet = /iPad|tablet/i.test(navigator.userAgent) || (width > 768 && isMobile);
        const isDesktop = !isMobile && !isTablet;
        
        // High-end device detection
        const isHighEnd = this.isHighEndDevice();
        
        // RAM estimation
        const ram = navigator.deviceMemory || this.estimateRAM();
        
        // CPU cores
        const cpuCores = navigator.hardwareConcurrency || 4;
        
        return {
            width,
            height,
            aspectRatio: width / height,
            deviceDPI,
            screenDiagonal,
            totalPixels,
            refreshRate,
            deviceType: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
            isHighEnd,
            ram,
            cpuCores,
            performanceLevel: this.testPerformance(),
            deviceId: this.generateDeviceId()
        };
    }

    // Detect refresh rate
    detectRefreshRate() {
        return new Promise((resolve) => {
            let frameCount = 0;
            let startTime = performance.now();
            
            const countFrames = () => {
                frameCount++;
                if (performance.now() - startTime < 1000) {
                    requestAnimationFrame(countFrames);
                } else {
                    // Round to common refresh rates
                    const fps = frameCount;
                    if (fps >= 140) resolve(144);
                    else if (fps >= 110) resolve(120);
                    else if (fps >= 80) resolve(90);
                    else if (fps >= 55) resolve(60);
                    else resolve(30);
                }
            };
            
            requestAnimationFrame(countFrames);
        });
    }

    // Check if high-end device
    isHighEndDevice() {
        const userAgent = navigator.userAgent;
        const highEndPatterns = [
            /iPhone 15|iPhone 14 Pro/i,
            /Galaxy S23|Galaxy S22 Ultra/i,
            /Pixel 8|Pixel 7 Pro/i,
            /iPad Pro/i,
            /Snapdragon 8 Gen|Apple A17|Apple A16/i
        ];
        
        return highEndPatterns.some(pattern => pattern.test(userAgent));
    }

    // Estimate RAM
    estimateRAM() {
        const performance = this.testPerformance();
        if (performance > 0.9) return 8;
        if (performance > 0.7) return 6;
        if (performance > 0.5) return 4;
        return 3;
    }

    // Test performance
    testPerformance() {
        const start = performance.now();
        for (let i = 0; i < 2000000; i++) {
            Math.sqrt(i) * Math.sin(i);
        }
        const duration = performance.now() - start;
        
        // Normalize to 0-1 scale
        return Math.max(0, Math.min(1, 1 - (duration / 200)));
    }

    // Generate device ID for consistent randomization
    generateDeviceId() {
        const profile = this.deviceProfile;
        const idString = `${profile.width}x${profile.height}-${profile.deviceDPI}-${profile.ram}`;
        return btoa(idString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    // Load saved random factors
    loadSavedFactors() {
        const saved = localStorage.getItem(`sensitivity-factors-${this.deviceProfile.deviceId}`);
        if (saved) {
            return JSON.parse(saved);
        }
        return null;
    }

    // Save random factors
    saveFactors(factors) {
        localStorage.setItem(`sensitivity-factors-${this.deviceProfile.deviceId}`, JSON.stringify(factors));
    }

    // Get consistent random factor for device
    getConsistentRandomFactor(scopeType) {
        // If we have saved factors, use them
        if (this.savedRandomFactors && this.savedRandomFactors[scopeType]) {
            return this.savedRandomFactors[scopeType];
        }
        
        // Generate new factors
        if (!this.savedRandomFactors) {
            this.savedRandomFactors = {};
        }
        
        // Generate factor based on device profile for consistency
        const baseFactor = 0.95 + (this.deviceProfile.performanceLevel * 0.1);
        const deviceHash = this.deviceProfile.deviceId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        const scopeMultipliers = {
            general: 1.0,
            redDot: 0.98,
            scope2x: 0.96,
            scope4x: 0.94,
            sniper: 0.92,
            freeLook: 1.02,
            gyroscope: 0.85
        };
        
        const factor = baseFactor * (scopeMultipliers[scopeType] || 1.0) * (0.98 + (deviceHash % 5) / 100);
        this.savedRandomFactors[scopeType] = factor;
        this.saveFactors(this.savedRandomFactors);
        
        return factor;
    }

    // Advanced play styles
    getPlayStyleConfig(style) {
        const styles = {
            fast: {
                name: 'سريع',
                icon: 'fa-running',
                description: 'للحركة السريعة والاشتباكات القريبة',
                multipliers: {
                    general: 1.15,
                    redDot: 1.1,
                    scope2x: 1.05,
                    scope4x: 0.95,
                    sniper: 0.75,
                    freeLook: 1.2,
                    gyroscope: 0.9
                }
            },
            medium: {
                name: 'متوسط',
                icon: 'fa-balance-scale',
                description: 'توازن بين السرعة والدقة',
                multipliers: {
                    general: 1.0,
                    redDot: 0.98,
                    scope2x: 0.92,
                    scope4x: 0.82,
                    sniper: 0.65,
                    freeLook: 1.05,
                    gyroscope: 0.75
                }
            },
            slow: {
                name: 'بطيء',
                icon: 'fa-crosshairs',
                description: 'للقنص والتصويب الدقيق',
                multipliers: {
                    general: 0.85,
                    redDot: 0.82,
                    scope2x: 0.75,
                    scope4x: 0.68,
                    sniper: 0.55,
                    freeLook: 0.9,
                    gyroscope: 0.65
                }
            },
            proSniper: {
                name: 'قناص محترف',
                icon: 'fa-bullseye',
                description: 'أقصى دقة للقنص',
                multipliers: {
                    general: 0.75,
                    redDot: 0.7,
                    scope2x: 0.6,
                    scope4x: 0.5,
                    sniper: 0.35,
                    freeLook: 0.8,
                    gyroscope: 0.5
                }
            },
            aggressive: {
                name: 'عدواني',
                icon: 'fa-fire',
                description: 'للهجوم السريع والرش',
                multipliers: {
                    general: 1.25,
                    redDot: 1.2,
                    scope2x: 1.1,
                    scope4x: 0.9,
                    sniper: 0.65,
                    freeLook: 1.3,
                    gyroscope: 0.95
                }
            },
            tactical: {
                name: 'تكتيكي',
                icon: 'fa-chess',
                description: 'للعب التكتيكي والتصويب المتوسط',
                multipliers: {
                    general: 0.95,
                    redDot: 0.92,
                    scope2x: 0.88,
                    scope4x: 0.78,
                    sniper: 0.6,
                    freeLook: 1.0,
                    gyroscope: 0.7
                }
            }
        };
        
        return styles[style] || styles.medium;
    }

    // Calculate base sensitivity with all factors
    calculateBaseSensitivity(playStyle) {
        const profile = this.deviceProfile;
        const styleConfig = this.getPlayStyleConfig(playStyle);
        
        // Base calculation with device factors
        let baseSensitivity = 100;
        
        // DPI adjustment (inverse relationship)
        const dpiFactor = 200 / (1 + (profile.deviceDPI / 300));
        
        // Screen size adjustment
        const sizeFactor = profile.deviceType === 'mobile' ? 1.1 : 
                          profile.deviceType === 'tablet' ? 1.05 : 0.95;
        
        // Aspect ratio adjustment
        const aspectFactor = (profile.aspectRatio >= 1.7 && profile.aspectRatio <= 2.1) ? 1.05 : 0.98;
        
        // Refresh rate adjustment for high refresh screens
        const refreshMultiplier = profile.refreshRate >= 120 ? 1.05 : 
                                  profile.refreshRate >= 90 ? 1.02 : 1.0;
        
        // High-end device bonus
        const highEndMultiplier = profile.isHighEnd ? 1.05 : 1.0;
        
        // Performance adjustment
        const perfMultiplier = 0.9 + (profile.performanceLevel * 0.2);
        
        // Calculate final base
        baseSensitivity = Math.round(
            baseSensitivity * 
            dpiFactor * 
            sizeFactor * 
            aspectFactor * 
            refreshMultiplier * 
            highEndMultiplier * 
            perfMultiplier
        );
        
        return {
            base: baseSensitivity,
            styleConfig,
            factors: {
                dpi: dpiFactor,
                size: sizeFactor,
                aspect: aspectFactor,
                refresh: refreshMultiplier,
                highEnd: highEndMultiplier,
                performance: perfMultiplier
            }
        };
    }

    // Generate complete sensitivity settings
    generateSensitivity(playStyle = 'medium', fireButtonSize = 'medium') {
        const { base, styleConfig } = this.calculateBaseSensitivity(playStyle);
        
        // Generate values for each scope type
        const sensitivities = {};
        const scopeTypes = ['general', 'redDot', 'scope2x', 'scope4x', 'sniper', 'freeLook'];
        
        scopeTypes.forEach(scope => {
            const multiplier = styleConfig.multipliers[scope] || 1.0;
            const randomFactor = this.getConsistentRandomFactor(scope);
            
            let value = Math.round(base * multiplier * randomFactor);
            
            // Clamp values
            value = Math.min(200, Math.max(20, value));
            
            sensitivities[scope] = value;
        });
        
        // Gyroscope with separate per-scope values
        sensitivities.gyroscope = this.generateGyroscopeValues(base, styleConfig);
        
        // Fire button size
        sensitivities.fireButtonSize = this.generateFireButtonSize(fireButtonSize);
        
        return {
            sensitivities,
            deviceProfile: this.deviceProfile,
            playStyle: styleConfig,
            generatedAt: new Date().toISOString()
        };
    }

    // Generate detailed gyroscope values
    generateGyroscopeValues(base, styleConfig) {
        const gyroBase = Math.round(base * styleConfig.multipliers.gyroscope * 0.5);
        
        return {
            general: Math.min(100, Math.max(20, gyroBase)),
            redDot: Math.min(100, Math.max(20, Math.round(gyroBase * 0.95))),
            scope2x: Math.min(100, Math.max(20, Math.round(gyroBase * 0.85))),
            scope4x: Math.min(100, Math.max(20, Math.round(gyroBase * 0.75))),
            sniper: Math.min(100, Math.max(20, Math.round(gyroBase * 0.6)))
        };
    }

    // Generate fire button size
    generateFireButtonSize(size) {
        const profile = this.deviceProfile;
        const ranges = {
            small: [15, 35],
            medium: [40, 70],
            large: [75, 100]
        };
        
        let [min, max] = ranges[size] || ranges.medium;
        
        // Adjust for device type
        if (profile.deviceType === 'mobile') {
            min += 5;
            max += 5;
        }
        
        // Adjust for screen size
        if (profile.width < 400) {
            min -= 5;
            max -= 5;
        } else if (profile.width > 1200) {
            min += 5;
            max += 5;
        }
        
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Get graphics recommendations
    getGraphicsRecommendations() {
        const profile = this.deviceProfile;
        
        let graphicsLevel, fpsLevel, shadowQuality, antiAliasing;
        
        if (profile.isHighEnd && profile.ram >= 6) {
            graphicsLevel = 'فائقة (Ultra HD)';
            fpsLevel = profile.refreshRate >= 120 ? '120 FPS' : '90 FPS';
            shadowQuality = 'عالية';
            antiAliasing = '2x MSAA';
        } else if (profile.ram >= 4 && profile.performanceLevel > 0.6) {
            graphicsLevel = 'عالية (HD)';
            fpsLevel = '60 FPS';
            shadowQuality = 'متوسطة';
            antiAliasing = 'مفعل';
        } else if (profile.ram >= 3) {
            graphicsLevel = 'متوسطة';
            fpsLevel = '45 FPS';
            shadowQuality = 'منخفضة';
            antiAliasing = 'معطل';
        } else {
            graphicsLevel = 'منخفضة';
            fpsLevel = '30 FPS';
            shadowQuality = 'معطلة';
            antiAliasing = 'معطل';
        }
        
        return {
            graphicsLevel,
            fpsLevel,
            shadowQuality,
            antiAliasing,
            viewDistance: profile.isHighEnd ? 'بعيدة' : 'متوسطة',
            textureQuality: profile.ram >= 6 ? 'عالية' : profile.ram >= 4 ? 'متوسطة' : 'منخفضة',
            deviceInfo: {
                resolution: `${profile.width}x${profile.height}`,
                refreshRate: profile.refreshRate,
                ram: profile.ram,
                deviceType: profile.deviceType
            }
        };
    }

    // Reset saved factors (for recalibration)
    resetFactors() {
        this.savedRandomFactors = null;
        localStorage.removeItem(`sensitivity-factors-${this.deviceProfile.deviceId}`);
    }
}

// Export singleton
export const advancedCalculator = new AdvancedSensitivityCalculator();
export default AdvancedSensitivityCalculator;

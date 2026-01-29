// ============================================
// Graphics Engine v3.0 - Real Game Settings
// محرك الجرافيك بالإعدادات الحقيقية للألعاب
// ============================================

/**
 * محرك متقدم لتوليد إعدادات الجرافيك الحقيقية
 * يدعم: Free Fire, PUBG Mobile, Call of Duty Mobile
 * 
 * الإعدادات الحقيقية:
 * - PUBG: Graphics (Smooth-UHD), FPS (20-90), Style, Anti-aliasing
 * - COD: Quality (Low-Very High), FPS (Low-Ultra 120), Effects (On/Off)
 * - Free Fire: Graphics (Smooth-Max), FPS (30-60), Shadow, Filter
 */

export class GraphicsEngine {
    constructor() {
        this.version = '3.0.0';
        this.deviceProfile = null;
        this.performanceMetrics = null;
        this.initialized = false;
        
        // Real game settings definitions
        this.gameSettings = {
            pubg: {
                graphics: ['Smooth', 'Balanced', 'HD', 'HDR', 'Ultra HD', 'UHD'],
                frameRate: {
                    'Low': 20,
                    'Medium': 25,
                    'High': 30,
                    'Ultra': 40,
                    'Extreme': 60,
                    '90 FPS': 90
                },
                styles: ['Classic', 'Colorful', 'Realistic', 'Soft', 'Movie'],
                antiAliasing: ['Close', '2x', '4x']
            },
            cod: {
                quality: ['Low', 'Medium', 'High', 'Very High'],
                frameRate: {
                    'Low': 30,
                    'Medium': 40,
                    'High': 50,
                    'Very High': 60,
                    'Max': 60,
                    'Ultra': 90
                },
                effects: {
                    depthOfField: { name: 'Depth of Field', impact: 'medium' },
                    bloom: { name: 'Bloom', impact: 'low' },
                    realTimeShadows: { name: 'Real-time Shadows', impact: 'high' },
                    ragdoll: { name: 'Ragdoll', impact: 'medium' }
                }
            },
            freeFire: {
                graphics: ['Smooth', 'Standard', 'Ultra', 'Max'],
                frameRate: {
                    'Normal': 30,
                    'High': 60
                },
                shadow: [true, false],
                highRes: [true, false],
                filters: ['Classic', 'Bright', 'Vivid', 'Ocean']
            }
        };
        
        // Initialize engine
        this.initialize();
    }

    // ============================================
    // Initialization
    // ============================================
    
    async initialize() {
        console.log('🎮 Graphics Engine v3.0 - Initializing...');
        
        try {
            this.deviceProfile = await this.detectDeviceProfile();
            this.performanceMetrics = await this.runPerformanceTests();
            this.initialized = true;
            
            console.log('✅ Graphics Engine initialized');
            console.log('📊 Device Tier:', this.deviceProfile.tier);
            console.log('🎯 Performance Score:', this.performanceMetrics.overallScore);
            
        } catch (error) {
            console.error('❌ Graphics Engine initialization failed:', error);
            this.initialized = false;
        }
    }

    // ============================================
    // Device Detection
    // ============================================
    
    async detectDeviceProfile() {
        const profile = {
            screen: this.getScreenInfo(),
            hardware: this.getHardwareInfo(),
            gpu: await this.getGPUInfo(),
            platform: this.getPlatformInfo(),
            battery: await this.getBatteryInfo(),
            network: this.getNetworkInfo(),
            tier: null
        };
        
        profile.tier = this.calculatePerformanceTier(profile);
        
        return profile;
    }

    getScreenInfo() {
        const screen = window.screen;
        const pixelRatio = window.devicePixelRatio || 1;
        
        return {
            width: screen.width,
            height: screen.height,
            pixelRatio: pixelRatio,
            totalPixels: screen.width * screen.height,
            physicalPixels: (screen.width * pixelRatio) * (screen.height * pixelRatio),
            orientation: screen.orientation?.type || 'unknown',
            colorDepth: screen.colorDepth,
            refreshRate: this.estimateRefreshRate()
        };
    }

    estimateRefreshRate() {
        // Try to detect high refresh rate displays
        if (window.screen.availHeight > 2000) return 120; // Likely high-end device
        if (window.devicePixelRatio >= 3) return 90; // High DPI might support 90Hz
        return 60; // Default
    }

    getHardwareInfo() {
        return {
            cpuCores: navigator.hardwareConcurrency || 4,
            ram: navigator.deviceMemory || this.estimateRAM(),
            deviceType: this.detectDeviceType(),
            platform: navigator.platform,
            maxTouchPoints: navigator.maxTouchPoints || 0
        };
    }

    estimateRAM() {
        const deviceType = this.detectDeviceType();
        const perf = this.quickPerformanceTest();
        
        if (deviceType === 'desktop') {
            return perf > 0.8 ? 16 : perf > 0.6 ? 8 : 4;
        } else if (deviceType === 'tablet') {
            return perf > 0.7 ? 8 : perf > 0.5 ? 6 : 4;
        } else {
            return perf > 0.7 ? 8 : perf > 0.5 ? 6 : perf > 0.3 ? 4 : 3;
        }
    }

    detectDeviceType() {
        const ua = navigator.userAgent;
        const width = window.innerWidth;
        const touchScreen = 'ontouchstart' in window;
        
        if (!touchScreen && width >= 1024) return 'desktop';
        if (/iPad|tablet/i.test(ua) || (width >= 768 && width < 1024 && touchScreen)) return 'tablet';
        if (/Mobile|Android|iPhone|iPod/i.test(ua) || (width < 768 && touchScreen)) return 'mobile';
        
        return 'desktop';
    }

    async getGPUInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return { supported: false, tier: 'low', renderer: 'Unknown' };
            }
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
            const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : '';
            
            return {
                supported: true,
                renderer: renderer,
                vendor: vendor,
                tier: this.detectGPUTier(renderer),
                maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
                maxRenderBufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE)
            };
        } catch (error) {
            return { supported: false, tier: 'low', renderer: 'Unknown' };
        }
    }

    detectGPUTier(renderer) {
        const r = renderer.toLowerCase();
        
        // Ultra tier - High-end GPUs
        if (r.includes('nvidia') && (r.includes('rtx') || r.includes('gtx 16') || r.includes('gtx 20'))) return 'ultra';
        if (r.includes('amd') && (r.includes('rx 6') || r.includes('rx 5'))) return 'ultra';
        if (r.includes('apple') && (r.includes('m1') || r.includes('m2') || r.includes('m3'))) return 'ultra';
        if (r.includes('adreno') && parseInt(r.match(/\d+/)?.[0] || 0) >= 650) return 'ultra';
        
        // High tier - Mid-high GPUs
        if (r.includes('nvidia') && r.includes('gtx')) return 'high';
        if (r.includes('amd') && r.includes('rx')) return 'high';
        if (r.includes('adreno') && parseInt(r.match(/\d+/)?.[0] || 0) >= 600) return 'high';
        if (r.includes('mali') && r.includes('g7')) return 'high';
        
        // Medium tier - Mid-range GPUs
        if (r.includes('adreno') && parseInt(r.match(/\d+/)?.[0] || 0) >= 500) return 'medium';
        if (r.includes('mali') && (r.includes('g5') || r.includes('g6'))) return 'medium';
        if (r.includes('intel') && r.includes('iris')) return 'medium';
        if (r.includes('powervr')) return 'medium';
        
        // Low tier - Entry-level GPUs
        if (r.includes('adreno') && parseInt(r.match(/\d+/)?.[0] || 0) >= 400) return 'low';
        if (r.includes('mali')) return 'low';
        
        return 'very-low';
    }

    getPlatformInfo() {
        return {
            os: this.detectOS(),
            browser: this.detectBrowser(),
            userAgent: navigator.userAgent,
            language: navigator.language
        };
    }

    detectOS() {
        const ua = navigator.userAgent;
        
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Mac OS X/i.test(ua)) return 'macOS';
        if (/Android/i.test(ua)) return 'Android';
        if (/iPhone|iPad/i.test(ua)) return 'iOS';
        if (/Linux/i.test(ua)) return 'Linux';
        
        return 'Unknown';
    }

    detectBrowser() {
        const ua = navigator.userAgent;
        
        if (/Edg\//i.test(ua)) return 'Edge';
        if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return 'Chrome';
        if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
        if (/Firefox/i.test(ua)) return 'Firefox';
        
        return 'Unknown';
    }

    async getBatteryInfo() {
        try {
            if (!navigator.getBattery) {
                return { supported: false, charging: null, level: null };
            }
            
            const battery = await navigator.getBattery();
            
            return {
                supported: true,
                charging: battery.charging,
                level: battery.level,
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime
            };
        } catch (error) {
            return { supported: false, charging: null, level: null };
        }
    }

    getNetworkInfo() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        
        if (!connection) {
            return { supported: false, type: 'unknown' };
        }
        
        return {
            supported: true,
            type: connection.effectiveType || 'unknown',
            downlink: connection.downlink || null,
            rtt: connection.rtt || null,
            saveData: connection.saveData || false
        };
    }

    quickPerformanceTest() {
        try {
            const start = performance.now();
            let sum = 0;
            
            for (let i = 0; i < 100000; i++) {
                sum += Math.sqrt(i) * Math.sin(i / 1000);
            }
            
            const duration = performance.now() - start;
            return Math.max(0, Math.min(1, 1 - (duration / 50)));
        } catch (error) {
            return 0.5;
        }
    }

    calculatePerformanceTier(profile) {
        let score = 0;
        
        // RAM Score (0-25)
        score += Math.min(25, (profile.hardware.ram / 16) * 25);
        
        // CPU Score (0-25)
        score += Math.min(25, (profile.hardware.cpuCores / 16) * 25);
        
        // GPU Score (0-30)
        const gpuScores = { ultra: 30, high: 22, medium: 15, low: 8, 'very-low': 5 };
        score += gpuScores[profile.gpu.tier] || 8;
        
        // Screen Score (0-20)
        const pixels = profile.screen.physicalPixels;
        let screenScore = 20;
        if (pixels > 8294400) screenScore = 10; // 4K+
        else if (pixels > 3686400) screenScore = 15; // 1440p
        else if (pixels > 2073600) screenScore = 18; // 1080p
        score += screenScore;
        
        if (score >= 85) return 'ultra';
        if (score >= 70) return 'high';
        if (score >= 50) return 'medium';
        if (score >= 30) return 'low';
        return 'very-low';
    }

    // ============================================
    // Performance Testing
    // ============================================
    
    async runPerformanceTests() {
        console.log('🔬 Running performance tests...');
        
        const tests = {
            cpu: await this.testCPUPerformance(),
            gpu: await this.testGPUPerformance(),
            memory: await this.testMemoryPerformance(),
            rendering: await this.testRenderingPerformance()
        };
        
        const overallScore = (
            tests.cpu.score * 0.3 +
            tests.gpu.score * 0.4 +
            tests.memory.score * 0.15 +
            tests.rendering.score * 0.15
        );
        
        return {
            ...tests,
            overallScore: Math.round(overallScore),
            timestamp: Date.now()
        };
    }

    async testCPUPerformance() {
        const start = performance.now();
        
        // Complex mathematical operations
        let result = 0;
        for (let i = 0; i < 500000; i++) {
            result += Math.sqrt(i) * Math.sin(i / 1000) * Math.cos(i / 500);
            result += Math.pow(i % 100, 2) / (i + 1);
        }
        
        const duration = performance.now() - start;
        const score = Math.max(0, Math.min(100, 100 - (duration / 10)));
        
        return {
            duration: Math.round(duration),
            score: Math.round(score),
            rating: this.getRating(score)
        };
    }

    async testGPUPerformance() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1920;
            canvas.height = 1080;
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) {
                return { duration: 0, score: 0, rating: 'unsupported' };
            }
            
            const start = performance.now();
            
            // Create and render complex scene
            const vertexShader = gl.createShader(gl.VERTEX_SHADER);
            const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            
            gl.shaderSource(vertexShader, `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `);
            
            gl.shaderSource(fragmentShader, `
                precision mediump float;
                void main() {
                    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                }
            `);
            
            gl.compileShader(vertexShader);
            gl.compileShader(fragmentShader);
            
            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            
            // Render multiple frames
            for (let i = 0; i < 100; i++) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
            }
            
            const duration = performance.now() - start;
            const score = Math.max(0, Math.min(100, 100 - (duration / 5)));
            
            return {
                duration: Math.round(duration),
                score: Math.round(score),
                rating: this.getRating(score)
            };
        } catch (error) {
            return { duration: 0, score: 0, rating: 'error' };
        }
    }

    async testMemoryPerformance() {
        const start = performance.now();
        
        try {
            // Allocate and manipulate large arrays
            const arrays = [];
            for (let i = 0; i < 10; i++) {
                const arr = new Array(100000).fill(0).map((_, idx) => idx * Math.random());
                arrays.push(arr.sort((a, b) => a - b));
            }
            
            const duration = performance.now() - start;
            const score = Math.max(0, Math.min(100, 100 - (duration / 20)));
            
            return {
                duration: Math.round(duration),
                score: Math.round(score),
                rating: this.getRating(score)
            };
        } catch (error) {
            return { duration: 0, score: 0, rating: 'error' };
        }
    }

    async testRenderingPerformance() {
        const start = performance.now();
        
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            const ctx = canvas.getContext('2d');
            
            // Draw complex shapes
            for (let i = 0; i < 1000; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * 800,
                    Math.random() * 600,
                    Math.random() * 50,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
                ctx.fill();
            }
            
            const duration = performance.now() - start;
            const score = Math.max(0, Math.min(100, 100 - (duration / 15)));
            
            return {
                duration: Math.round(duration),
                score: Math.round(score),
                rating: this.getRating(score)
            };
        } catch (error) {
            return { duration: 0, score: 0, rating: 'error' };
        }
    }

    getRating(score) {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'very-good';
        if (score >= 60) return 'good';
        if (score >= 40) return 'fair';
        if (score >= 20) return 'poor';
        return 'very-poor';
    }


    // ============================================
    // PUBG Mobile Graphics Generation
    // ============================================
    
    generatePUBGSettings(options = {}) {
        if (!this.initialized) {
            console.warn('⚠️ Graphics Engine not initialized');
            return this.getDefaultPUBGSettings();
        }
        
        const {
            playStyle = 'balanced',
            prioritizeFPS = false,
            priorityQuality = false,
            batteryMode = false,
            competitiveMode = false
        } = options;
        
        console.log('🎮 Generating PUBG Mobile settings...');
        console.log('📊 Device Tier:', this.deviceProfile.tier);
        console.log('🎯 Play Style:', playStyle);
        
        const settings = this.calculatePUBGSettings(
            this.deviceProfile,
            this.performanceMetrics,
            playStyle,
            prioritizeFPS,
            priorityQuality,
            batteryMode,
            competitiveMode
        );
        
        return settings;
    }

    calculatePUBGSettings(profile, metrics, playStyle, prioritizeFPS, priorityQuality, batteryMode, competitiveMode) {
        const tier = profile.tier;
        const isLowBattery = profile.battery.supported && profile.battery.level < 0.2 && !profile.battery.charging;
        
        let settings = {
            graphics: 'Smooth',
            frameRate: 'High',
            frameRateValue: 30,
            style: 'Classic',
            antiAliasing: 'Close',
            autoAdjustGraphics: false
        };
        
        // Base settings by device tier
        if (tier === 'ultra') {
            settings.graphics = priorityQuality ? 'Ultra HD' : 'HDR';
            settings.frameRate = prioritizeFPS ? 'Extreme' : 'Ultra';
            settings.frameRateValue = prioritizeFPS ? 60 : 40;
            settings.style = 'Realistic';
            settings.antiAliasing = '4x';
        } else if (tier === 'high') {
            settings.graphics = priorityQuality ? 'HDR' : 'HD';
            settings.frameRate = prioritizeFPS ? 'Ultra' : 'High';
            settings.frameRateValue = prioritizeFPS ? 40 : 30;
            settings.style = 'Colorful';
            settings.antiAliasing = '2x';
        } else if (tier === 'medium') {
            settings.graphics = 'Balanced';
            settings.frameRate = 'High';
            settings.frameRateValue = 30;
            settings.style = 'Classic';
            settings.antiAliasing = 'Close';
        } else if (tier === 'low') {
            settings.graphics = 'Smooth';
            settings.frameRate = 'Medium';
            settings.frameRateValue = 25;
            settings.style = 'Classic';
            settings.antiAliasing = 'Close';
        } else {
            settings.graphics = 'Smooth';
            settings.frameRate = 'Low';
            settings.frameRateValue = 20;
            settings.style = 'Classic';
            settings.antiAliasing = 'Close';
        }
        
        // Competitive mode adjustments
        if (competitiveMode) {
            settings.graphics = 'Smooth';
            settings.frameRate = tier === 'ultra' || tier === 'high' ? 'Extreme' : 'Ultra';
            settings.frameRateValue = tier === 'ultra' || tier === 'high' ? 60 : 40;
            settings.style = 'Classic';
            settings.antiAliasing = 'Close';
        }
        
        // Battery mode adjustments
        if (batteryMode || isLowBattery) {
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(settings.graphics);
            if (graphicsIndex > 0) {
                settings.graphics = this.gameSettings.pubg.graphics[Math.max(0, graphicsIndex - 2)];
            }
            
            const frameRates = Object.keys(this.gameSettings.pubg.frameRate);
            const currentFPSIndex = frameRates.indexOf(settings.frameRate);
            if (currentFPSIndex > 0) {
                settings.frameRate = frameRates[Math.max(0, currentFPSIndex - 1)];
                settings.frameRateValue = this.gameSettings.pubg.frameRate[settings.frameRate];
            }
            
            settings.antiAliasing = 'Close';
        }
        
        // Play style adjustments
        if (playStyle === 'aggressive') {
            // Prioritize FPS for fast reactions
            const frameRates = Object.keys(this.gameSettings.pubg.frameRate);
            const currentIndex = frameRates.indexOf(settings.frameRate);
            if (currentIndex < frameRates.length - 1) {
                settings.frameRate = frameRates[Math.min(frameRates.length - 1, currentIndex + 1)];
                settings.frameRateValue = this.gameSettings.pubg.frameRate[settings.frameRate];
            }
        } else if (playStyle === 'sniper') {
            // Prioritize quality for long-range visibility
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(settings.graphics);
            if (graphicsIndex < this.gameSettings.pubg.graphics.length - 1) {
                settings.graphics = this.gameSettings.pubg.graphics[Math.min(this.gameSettings.pubg.graphics.length - 1, graphicsIndex + 1)];
            }
            settings.style = 'Realistic';
        }
        
        // Screen resolution adjustments
        const pixels = profile.screen.physicalPixels;
        if (pixels > 8294400) { // 4K+
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(settings.graphics);
            if (graphicsIndex > 0) {
                settings.graphics = this.gameSettings.pubg.graphics[Math.max(0, graphicsIndex - 1)];
            }
        }
        
        // Add recommendations
        settings.recommendations = this.generatePUBGRecommendations(settings, profile, playStyle);
        
        return settings;
    }

    generatePUBGRecommendations(settings, profile, playStyle) {
        const recommendations = [];
        
        if (settings.frameRateValue >= 60) {
            recommendations.push('High FPS enabled - Excellent for competitive play');
        }
        
        if (settings.graphics === 'Smooth') {
            recommendations.push('Smooth graphics - Best performance and visibility');
        }
        
        if (settings.antiAliasing !== 'Close') {
            recommendations.push('Anti-aliasing enabled - May impact battery life');
        }
        
        if (profile.battery.supported && profile.battery.level < 0.3 && !profile.battery.charging) {
            recommendations.push('Low battery detected - Consider enabling battery mode');
        }
        
        if (playStyle === 'sniper' && settings.graphics !== 'HDR' && settings.graphics !== 'Ultra HD') {
            recommendations.push('For sniping, consider higher graphics for better visibility');
        }
        
        return recommendations;
    }

    getDefaultPUBGSettings() {
        return {
            graphics: 'Smooth',
            frameRate: 'High',
            frameRateValue: 30,
            style: 'Classic',
            antiAliasing: 'Close',
            autoAdjustGraphics: false,
            recommendations: ['Using default settings - Initialize engine for optimized settings']
        };
    }

    // ============================================
    // Call of Duty Mobile Graphics Generation
    // ============================================
    
    generateCODSettings(options = {}) {
        if (!this.initialized) {
            console.warn('⚠️ Graphics Engine not initialized');
            return this.getDefaultCODSettings();
        }
        
        const {
            playStyle = 'balanced',
            prioritizeFPS = false,
            priorityQuality = false,
            batteryMode = false,
            competitiveMode = false,
            gameMode = 'multiplayer' // multiplayer or battle-royale
        } = options;
        
        console.log('🎮 Generating COD Mobile settings...');
        console.log('📊 Device Tier:', this.deviceProfile.tier);
        console.log('🎯 Play Style:', playStyle);
        console.log('🎮 Game Mode:', gameMode);
        
        const settings = this.calculateCODSettings(
            this.deviceProfile,
            this.performanceMetrics,
            playStyle,
            prioritizeFPS,
            priorityQuality,
            batteryMode,
            competitiveMode,
            gameMode
        );
        
        return settings;
    }

    calculateCODSettings(profile, metrics, playStyle, prioritizeFPS, priorityQuality, batteryMode, competitiveMode, gameMode) {
        const tier = profile.tier;
        const isLowBattery = profile.battery.supported && profile.battery.level < 0.2 && !profile.battery.charging;
        
        let settings = {
            quality: 'Medium',
            frameRate: 'High',
            frameRateValue: 50,
            effects: {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: true
            }
        };
        
        // Base settings by device tier
        if (tier === 'ultra') {
            settings.quality = priorityQuality ? 'Very High' : 'High';
            settings.frameRate = prioritizeFPS ? 'Ultra' : 'Max';
            settings.frameRateValue = prioritizeFPS ? 90 : 60;
            settings.effects = {
                depthOfField: !prioritizeFPS,
                bloom: true,
                realTimeShadows: !prioritizeFPS,
                ragdoll: true
            };
        } else if (tier === 'high') {
            settings.quality = priorityQuality ? 'High' : 'Medium';
            settings.frameRate = prioritizeFPS ? 'Max' : 'Very High';
            settings.frameRateValue = prioritizeFPS ? 60 : 60;
            settings.effects = {
                depthOfField: false,
                bloom: true,
                realTimeShadows: false,
                ragdoll: true
            };
        } else if (tier === 'medium') {
            settings.quality = 'Medium';
            settings.frameRate = 'High';
            settings.frameRateValue = 50;
            settings.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: true
            };
        } else if (tier === 'low') {
            settings.quality = 'Low';
            settings.frameRate = 'Medium';
            settings.frameRateValue = 40;
            settings.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: false
            };
        } else {
            settings.quality = 'Low';
            settings.frameRate = 'Low';
            settings.frameRateValue = 30;
            settings.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: false
            };
        }
        
        // Competitive mode adjustments
        if (competitiveMode) {
            settings.quality = 'Low';
            settings.frameRate = tier === 'ultra' ? 'Ultra' : 'Max';
            settings.frameRateValue = tier === 'ultra' ? 90 : 60;
            settings.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: false
            };
        }
        
        // Battery mode adjustments
        if (batteryMode || isLowBattery) {
            const qualityIndex = this.gameSettings.cod.quality.indexOf(settings.quality);
            if (qualityIndex > 0) {
                settings.quality = this.gameSettings.cod.quality[Math.max(0, qualityIndex - 1)];
            }
            
            const frameRates = Object.keys(this.gameSettings.cod.frameRate);
            const currentFPSIndex = frameRates.indexOf(settings.frameRate);
            if (currentFPSIndex > 0) {
                settings.frameRate = frameRates[Math.max(0, currentFPSIndex - 1)];
                settings.frameRateValue = this.gameSettings.cod.frameRate[settings.frameRate];
            }
            
            settings.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: false
            };
        }
        
        // Game mode adjustments
        if (gameMode === 'battle-royale') {
            // Battle Royale needs better visibility
            const qualityIndex = this.gameSettings.cod.quality.indexOf(settings.quality);
            if (qualityIndex < this.gameSettings.cod.quality.length - 1) {
                settings.quality = this.gameSettings.cod.quality[Math.min(this.gameSettings.cod.quality.length - 1, qualityIndex + 1)];
            }
        } else if (gameMode === 'multiplayer') {
            // Multiplayer prioritizes FPS
            const frameRates = Object.keys(this.gameSettings.cod.frameRate);
            const currentIndex = frameRates.indexOf(settings.frameRate);
            if (currentIndex < frameRates.length - 1) {
                settings.frameRate = frameRates[Math.min(frameRates.length - 1, currentIndex + 1)];
                settings.frameRateValue = this.gameSettings.cod.frameRate[settings.frameRate];
            }
        }
        
        // Play style adjustments
        if (playStyle === 'aggressive') {
            settings.effects.depthOfField = false;
            settings.effects.bloom = false;
        } else if (playStyle === 'sniper') {
            settings.effects.depthOfField = tier === 'ultra' || tier === 'high';
        }
        
        // Screen resolution adjustments
        const pixels = profile.screen.physicalPixels;
        if (pixels > 8294400) { // 4K+
            const qualityIndex = this.gameSettings.cod.quality.indexOf(settings.quality);
            if (qualityIndex > 0) {
                settings.quality = this.gameSettings.cod.quality[Math.max(0, qualityIndex - 1)];
            }
        }
        
        // Add recommendations
        settings.recommendations = this.generateCODRecommendations(settings, profile, playStyle, gameMode);
        
        return settings;
    }

    generateCODRecommendations(settings, profile, playStyle, gameMode) {
        const recommendations = [];
        
        if (settings.frameRateValue >= 90) {
            recommendations.push('Ultra FPS enabled - Requires high-end device');
        } else if (settings.frameRateValue >= 60) {
            recommendations.push('Max FPS enabled - Smooth gameplay experience');
        }
        
        if (settings.quality === 'Low') {
            recommendations.push('Low quality - Best performance for competitive play');
        }
        
        const enabledEffects = Object.entries(settings.effects).filter(([_, enabled]) => enabled).length;
        if (enabledEffects === 0) {
            recommendations.push('All effects disabled - Maximum performance');
        } else if (enabledEffects >= 3) {
            recommendations.push('Multiple effects enabled - May impact performance');
        }
        
        if (gameMode === 'multiplayer' && settings.frameRateValue < 60) {
            recommendations.push('Consider higher FPS for multiplayer mode');
        }
        
        if (profile.battery.supported && profile.battery.level < 0.3 && !profile.battery.charging) {
            recommendations.push('Low battery detected - Consider reducing quality');
        }
        
        return recommendations;
    }

    getDefaultCODSettings() {
        return {
            quality: 'Medium',
            frameRate: 'High',
            frameRateValue: 50,
            effects: {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: true
            },
            recommendations: ['Using default settings - Initialize engine for optimized settings']
        };
    }

    // ============================================
    // Free Fire Graphics Generation
    // ============================================
    
    generateFreeFireSettings(options = {}) {
        if (!this.initialized) {
            console.warn('⚠️ Graphics Engine not initialized');
            return this.getDefaultFreeFireSettings();
        }
        
        const {
            playStyle = 'balanced',
            prioritizeFPS = false,
            priorityQuality = false,
            batteryMode = false,
            competitiveMode = false,
            hasFFMax = false
        } = options;
        
        console.log('🎮 Generating Free Fire settings...');
        console.log('📊 Device Tier:', this.deviceProfile.tier);
        console.log('🎯 Play Style:', playStyle);
        console.log('🎮 FF MAX:', hasFFMax);
        
        const settings = this.calculateFreeFireSettings(
            this.deviceProfile,
            this.performanceMetrics,
            playStyle,
            prioritizeFPS,
            priorityQuality,
            batteryMode,
            competitiveMode,
            hasFFMax
        );
        
        return settings;
    }

    calculateFreeFireSettings(profile, metrics, playStyle, prioritizeFPS, priorityQuality, batteryMode, competitiveMode, hasFFMax) {
        const tier = profile.tier;
        const isLowBattery = profile.battery.supported && profile.battery.level < 0.2 && !profile.battery.charging;
        
        let settings = {
            graphics: 'Standard',
            frameRate: 'Normal',
            frameRateValue: 30,
            shadow: false,
            highRes: false,
            filter: 'Classic'
        };
        
        // Base settings by device tier
        if (tier === 'ultra') {
            settings.graphics = hasFFMax && priorityQuality ? 'Max' : 'Ultra';
            settings.frameRate = 'High';
            settings.frameRateValue = 60;
            settings.shadow = !prioritizeFPS;
            settings.highRes = !prioritizeFPS;
            settings.filter = 'Vivid';
        } else if (tier === 'high') {
            settings.graphics = 'Ultra';
            settings.frameRate = prioritizeFPS ? 'High' : 'Normal';
            settings.frameRateValue = prioritizeFPS ? 60 : 30;
            settings.shadow = false;
            settings.highRes = !prioritizeFPS;
            settings.filter = 'Bright';
        } else if (tier === 'medium') {
            settings.graphics = 'Standard';
            settings.frameRate = 'Normal';
            settings.frameRateValue = 30;
            settings.shadow = false;
            settings.highRes = false;
            settings.filter = 'Classic';
        } else {
            settings.graphics = 'Smooth';
            settings.frameRate = 'Normal';
            settings.frameRateValue = 30;
            settings.shadow = false;
            settings.highRes = false;
            settings.filter = 'Classic';
        }
        
        // Competitive mode adjustments
        if (competitiveMode) {
            settings.graphics = 'Smooth';
            settings.frameRate = tier === 'ultra' || tier === 'high' ? 'High' : 'Normal';
            settings.frameRateValue = tier === 'ultra' || tier === 'high' ? 60 : 30;
            settings.shadow = false;
            settings.highRes = false;
            settings.filter = 'Classic';
        }
        
        // Battery mode adjustments
        if (batteryMode || isLowBattery) {
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(settings.graphics);
            if (graphicsIndex > 0) {
                settings.graphics = this.gameSettings.freeFire.graphics[Math.max(0, graphicsIndex - 1)];
            }
            
            settings.frameRate = 'Normal';
            settings.frameRateValue = 30;
            settings.shadow = false;
            settings.highRes = false;
        }
        
        // Play style adjustments
        if (playStyle === 'aggressive') {
            settings.frameRate = tier === 'ultra' || tier === 'high' ? 'High' : 'Normal';
            settings.frameRateValue = tier === 'ultra' || tier === 'high' ? 60 : 30;
            settings.shadow = false;
        } else if (playStyle === 'sniper') {
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(settings.graphics);
            if (graphicsIndex < this.gameSettings.freeFire.graphics.length - 1) {
                settings.graphics = this.gameSettings.freeFire.graphics[Math.min(this.gameSettings.freeFire.graphics.length - 1, graphicsIndex + 1)];
            }
            settings.filter = 'Vivid';
        }
        
        // Screen resolution adjustments
        const pixels = profile.screen.physicalPixels;
        if (pixels > 8294400) { // 4K+
            settings.highRes = false;
        }
        
        // DPI adjustments (Free Fire is heavily DPI dependent)
        const dpi = profile.screen.pixelRatio;
        if (dpi >= 3) {
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(settings.graphics);
            if (graphicsIndex > 0) {
                settings.graphics = this.gameSettings.freeFire.graphics[Math.max(0, graphicsIndex - 1)];
            }
        }
        
        // Add recommendations
        settings.recommendations = this.generateFreeFireRecommendations(settings, profile, playStyle, hasFFMax);
        
        return settings;
    }

    generateFreeFireRecommendations(settings, profile, playStyle, hasFFMax) {
        const recommendations = [];
        
        if (settings.frameRateValue === 60) {
            recommendations.push('High FPS enabled - Smooth gameplay');
        }
        
        if (settings.graphics === 'Smooth') {
            recommendations.push('Smooth graphics - Best visibility and performance');
        }
        
        if (settings.graphics === 'Max' && hasFFMax) {
            recommendations.push('Max graphics - Requires Free Fire MAX');
        }
        
        if (settings.shadow) {
            recommendations.push('Shadows enabled - May impact performance');
        }
        
        if (settings.highRes) {
            recommendations.push('High resolution enabled - Better visuals, higher battery usage');
        }
        
        if (profile.screen.pixelRatio >= 3) {
            recommendations.push('High DPI detected - Graphics adjusted for performance');
        }
        
        if (profile.battery.supported && profile.battery.level < 0.3 && !profile.battery.charging) {
            recommendations.push('Low battery detected - Consider battery mode');
        }
        
        if (!hasFFMax && profile.tier === 'ultra') {
            recommendations.push('Consider upgrading to Free Fire MAX for better graphics');
        }
        
        return recommendations;
    }

    getDefaultFreeFireSettings() {
        return {
            graphics: 'Standard',
            frameRate: 'Normal',
            frameRateValue: 30,
            shadow: false,
            highRes: false,
            filter: 'Classic',
            recommendations: ['Using default settings - Initialize engine for optimized settings']
        };
    }


    // ============================================
    // Advanced Settings Optimization
    // ============================================
    
    optimizeForPlayStyle(game, playStyle, currentSettings) {
        const optimizations = {
            aggressive: {
                description: 'Optimized for fast-paced aggressive gameplay',
                adjustments: {
                    prioritizeFPS: true,
                    reduceEffects: true,
                    lowerGraphics: true
                }
            },
            balanced: {
                description: 'Balanced settings for all-around performance',
                adjustments: {
                    prioritizeFPS: false,
                    reduceEffects: false,
                    lowerGraphics: false
                }
            },
            sniper: {
                description: 'Optimized for long-range precision',
                adjustments: {
                    prioritizeFPS: false,
                    reduceEffects: false,
                    lowerGraphics: false,
                    increaseQuality: true
                }
            },
            rusher: {
                description: 'Maximum FPS for rushing gameplay',
                adjustments: {
                    prioritizeFPS: true,
                    reduceEffects: true,
                    lowerGraphics: true,
                    maxFPS: true
                }
            }
        };
        
        return optimizations[playStyle] || optimizations.balanced;
    }

    optimizeForBattery(game, currentSettings) {
        const optimized = { ...currentSettings };
        
        if (game === 'pubg') {
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(optimized.graphics);
            optimized.graphics = this.gameSettings.pubg.graphics[Math.max(0, graphicsIndex - 2)];
            optimized.frameRate = 'Medium';
            optimized.frameRateValue = 25;
            optimized.antiAliasing = 'Close';
            optimized.style = 'Classic';
        } else if (game === 'cod') {
            optimized.quality = 'Low';
            optimized.frameRate = 'Medium';
            optimized.frameRateValue = 40;
            optimized.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: false
            };
        } else if (game === 'freeFire') {
            optimized.graphics = 'Smooth';
            optimized.frameRate = 'Normal';
            optimized.frameRateValue = 30;
            optimized.shadow = false;
            optimized.highRes = false;
        }
        
        optimized.recommendations = optimized.recommendations || [];
        optimized.recommendations.push('Battery optimized - Reduced graphics and FPS');
        
        return optimized;
    }

    optimizeForCompetitive(game, currentSettings) {
        const optimized = { ...currentSettings };
        
        if (game === 'pubg') {
            optimized.graphics = 'Smooth';
            optimized.frameRate = this.deviceProfile.tier === 'ultra' || this.deviceProfile.tier === 'high' ? 'Extreme' : 'Ultra';
            optimized.frameRateValue = this.deviceProfile.tier === 'ultra' || this.deviceProfile.tier === 'high' ? 60 : 40;
            optimized.antiAliasing = 'Close';
            optimized.style = 'Classic';
        } else if (game === 'cod') {
            optimized.quality = 'Low';
            optimized.frameRate = this.deviceProfile.tier === 'ultra' ? 'Ultra' : 'Max';
            optimized.frameRateValue = this.deviceProfile.tier === 'ultra' ? 90 : 60;
            optimized.effects = {
                depthOfField: false,
                bloom: false,
                realTimeShadows: false,
                ragdoll: false
            };
        } else if (game === 'freeFire') {
            optimized.graphics = 'Smooth';
            optimized.frameRate = this.deviceProfile.tier === 'ultra' || this.deviceProfile.tier === 'high' ? 'High' : 'Normal';
            optimized.frameRateValue = this.deviceProfile.tier === 'ultra' || this.deviceProfile.tier === 'high' ? 60 : 30;
            optimized.shadow = false;
            optimized.highRes = false;
            optimized.filter = 'Classic';
        }
        
        optimized.recommendations = optimized.recommendations || [];
        optimized.recommendations.push('Competitive optimized - Maximum FPS and visibility');
        
        return optimized;
    }

    // ============================================
    // Settings Comparison and Analysis
    // ============================================
    
    compareSettings(game, settings1, settings2) {
        const comparison = {
            game: game,
            differences: [],
            performanceImpact: 0,
            visualImpact: 0,
            recommendation: ''
        };
        
        if (game === 'pubg') {
            if (settings1.graphics !== settings2.graphics) {
                comparison.differences.push({
                    setting: 'Graphics',
                    value1: settings1.graphics,
                    value2: settings2.graphics,
                    impact: 'high'
                });
                comparison.visualImpact += 30;
            }
            
            if (settings1.frameRateValue !== settings2.frameRateValue) {
                comparison.differences.push({
                    setting: 'Frame Rate',
                    value1: `${settings1.frameRateValue} FPS`,
                    value2: `${settings2.frameRateValue} FPS`,
                    impact: 'high'
                });
                comparison.performanceImpact += 40;
            }
            
            if (settings1.antiAliasing !== settings2.antiAliasing) {
                comparison.differences.push({
                    setting: 'Anti-aliasing',
                    value1: settings1.antiAliasing,
                    value2: settings2.antiAliasing,
                    impact: 'medium'
                });
                comparison.performanceImpact += 20;
            }
            
            if (settings1.style !== settings2.style) {
                comparison.differences.push({
                    setting: 'Style',
                    value1: settings1.style,
                    value2: settings2.style,
                    impact: 'low'
                });
                comparison.visualImpact += 10;
            }
        } else if (game === 'cod') {
            if (settings1.quality !== settings2.quality) {
                comparison.differences.push({
                    setting: 'Quality',
                    value1: settings1.quality,
                    value2: settings2.quality,
                    impact: 'high'
                });
                comparison.visualImpact += 35;
            }
            
            if (settings1.frameRateValue !== settings2.frameRateValue) {
                comparison.differences.push({
                    setting: 'Frame Rate',
                    value1: `${settings1.frameRateValue} FPS`,
                    value2: `${settings2.frameRateValue} FPS`,
                    impact: 'high'
                });
                comparison.performanceImpact += 40;
            }
            
            const effects1 = Object.entries(settings1.effects).filter(([_, v]) => v).length;
            const effects2 = Object.entries(settings2.effects).filter(([_, v]) => v).length;
            if (effects1 !== effects2) {
                comparison.differences.push({
                    setting: 'Effects',
                    value1: `${effects1} enabled`,
                    value2: `${effects2} enabled`,
                    impact: 'medium'
                });
                comparison.performanceImpact += Math.abs(effects1 - effects2) * 10;
            }
        } else if (game === 'freeFire') {
            if (settings1.graphics !== settings2.graphics) {
                comparison.differences.push({
                    setting: 'Graphics',
                    value1: settings1.graphics,
                    value2: settings2.graphics,
                    impact: 'high'
                });
                comparison.visualImpact += 30;
            }
            
            if (settings1.frameRateValue !== settings2.frameRateValue) {
                comparison.differences.push({
                    setting: 'Frame Rate',
                    value1: `${settings1.frameRateValue} FPS`,
                    value2: `${settings2.frameRateValue} FPS`,
                    impact: 'high'
                });
                comparison.performanceImpact += 40;
            }
            
            if (settings1.shadow !== settings2.shadow) {
                comparison.differences.push({
                    setting: 'Shadow',
                    value1: settings1.shadow ? 'On' : 'Off',
                    value2: settings2.shadow ? 'On' : 'Off',
                    impact: 'medium'
                });
                comparison.performanceImpact += 15;
            }
            
            if (settings1.highRes !== settings2.highRes) {
                comparison.differences.push({
                    setting: 'High Resolution',
                    value1: settings1.highRes ? 'On' : 'Off',
                    value2: settings2.highRes ? 'On' : 'Off',
                    impact: 'medium'
                });
                comparison.visualImpact += 20;
            }
        }
        
        // Generate recommendation
        if (comparison.performanceImpact > 50) {
            comparison.recommendation = 'Significant performance difference - Test both settings';
        } else if (comparison.visualImpact > 40) {
            comparison.recommendation = 'Significant visual difference - Choose based on preference';
        } else if (comparison.differences.length === 0) {
            comparison.recommendation = 'Settings are identical';
        } else {
            comparison.recommendation = 'Minor differences - Either setting should work well';
        }
        
        return comparison;
    }

    analyzeSettings(game, settings) {
        const analysis = {
            game: game,
            performanceScore: 0,
            visualScore: 0,
            batteryScore: 0,
            competitiveScore: 0,
            overallScore: 0,
            strengths: [],
            weaknesses: [],
            suggestions: []
        };
        
        if (game === 'pubg') {
            // Performance score
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(settings.graphics);
            analysis.performanceScore += (5 - graphicsIndex) * 15;
            analysis.performanceScore += (settings.frameRateValue / 90) * 40;
            analysis.performanceScore += settings.antiAliasing === 'Close' ? 20 : settings.antiAliasing === '2x' ? 10 : 0;
            
            // Visual score
            analysis.visualScore += graphicsIndex * 15;
            analysis.visualScore += settings.antiAliasing === '4x' ? 30 : settings.antiAliasing === '2x' ? 15 : 0;
            analysis.visualScore += settings.style === 'Realistic' ? 20 : settings.style === 'Colorful' ? 15 : 10;
            
            // Battery score
            analysis.batteryScore += (5 - graphicsIndex) * 20;
            analysis.batteryScore += (90 - settings.frameRateValue) / 90 * 50;
            analysis.batteryScore += settings.antiAliasing === 'Close' ? 30 : 0;
            
            // Competitive score
            analysis.competitiveScore += settings.graphics === 'Smooth' ? 40 : 0;
            analysis.competitiveScore += settings.frameRateValue >= 60 ? 40 : settings.frameRateValue >= 40 ? 20 : 0;
            analysis.competitiveScore += settings.antiAliasing === 'Close' ? 20 : 0;
            
            // Strengths and weaknesses
            if (settings.frameRateValue >= 60) {
                analysis.strengths.push('High FPS for smooth gameplay');
            } else if (settings.frameRateValue < 30) {
                analysis.weaknesses.push('Low FPS may affect gameplay');
            }
            
            if (settings.graphics === 'Smooth') {
                analysis.strengths.push('Best visibility and performance');
            } else if (graphicsIndex >= 4) {
                analysis.weaknesses.push('High graphics may impact performance');
            }
            
            // Suggestions
            if (settings.frameRateValue < 40 && this.deviceProfile.tier !== 'very-low') {
                analysis.suggestions.push('Consider increasing FPS for smoother gameplay');
            }
            
            if (settings.antiAliasing !== 'Close' && this.deviceProfile.battery.level < 0.3) {
                analysis.suggestions.push('Disable anti-aliasing to save battery');
            }
            
        } else if (game === 'cod') {
            // Performance score
            const qualityIndex = this.gameSettings.cod.quality.indexOf(settings.quality);
            analysis.performanceScore += (3 - qualityIndex) * 20;
            analysis.performanceScore += (settings.frameRateValue / 90) * 40;
            const effectsCount = Object.values(settings.effects).filter(v => v).length;
            analysis.performanceScore += (4 - effectsCount) * 10;
            
            // Visual score
            analysis.visualScore += qualityIndex * 20;
            analysis.visualScore += effectsCount * 15;
            
            // Battery score
            analysis.batteryScore += (3 - qualityIndex) * 25;
            analysis.batteryScore += (90 - settings.frameRateValue) / 90 * 50;
            analysis.batteryScore += (4 - effectsCount) * 6.25;
            
            // Competitive score
            analysis.competitiveScore += settings.quality === 'Low' ? 40 : 0;
            analysis.competitiveScore += settings.frameRateValue >= 60 ? 40 : settings.frameRateValue >= 50 ? 20 : 0;
            analysis.competitiveScore += effectsCount === 0 ? 20 : 0;
            
            // Strengths and weaknesses
            if (settings.frameRateValue >= 90) {
                analysis.strengths.push('Ultra high FPS for competitive advantage');
            } else if (settings.frameRateValue < 40) {
                analysis.weaknesses.push('Low FPS may affect fast-paced gameplay');
            }
            
            if (effectsCount === 0) {
                analysis.strengths.push('All effects disabled for maximum performance');
            } else if (effectsCount >= 3) {
                analysis.weaknesses.push('Multiple effects may impact performance');
            }
            
            // Suggestions
            if (settings.frameRateValue < 60 && this.deviceProfile.tier !== 'low' && this.deviceProfile.tier !== 'very-low') {
                analysis.suggestions.push('Consider increasing FPS to 60 for better experience');
            }
            
            if (settings.effects.realTimeShadows && this.deviceProfile.battery.level < 0.3) {
                analysis.suggestions.push('Disable real-time shadows to save battery');
            }
            
        } else if (game === 'freeFire') {
            // Performance score
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(settings.graphics);
            analysis.performanceScore += (3 - graphicsIndex) * 25;
            analysis.performanceScore += (settings.frameRateValue / 60) * 40;
            analysis.performanceScore += !settings.shadow ? 15 : 0;
            analysis.performanceScore += !settings.highRes ? 20 : 0;
            
            // Visual score
            analysis.visualScore += graphicsIndex * 20;
            analysis.visualScore += settings.shadow ? 20 : 0;
            analysis.visualScore += settings.highRes ? 30 : 0;
            analysis.visualScore += settings.filter !== 'Classic' ? 15 : 0;
            
            // Battery score
            analysis.batteryScore += (3 - graphicsIndex) * 30;
            analysis.batteryScore += (60 - settings.frameRateValue) / 60 * 40;
            analysis.batteryScore += !settings.shadow ? 15 : 0;
            analysis.batteryScore += !settings.highRes ? 15 : 0;
            
            // Competitive score
            analysis.competitiveScore += settings.graphics === 'Smooth' ? 40 : 0;
            analysis.competitiveScore += settings.frameRateValue === 60 ? 40 : 20;
            analysis.competitiveScore += !settings.shadow ? 20 : 0;
            
            // Strengths and weaknesses
            if (settings.frameRateValue === 60) {
                analysis.strengths.push('High FPS enabled');
            }
            
            if (settings.graphics === 'Smooth') {
                analysis.strengths.push('Best visibility and performance');
            } else if (settings.graphics === 'Max') {
                analysis.weaknesses.push('Max graphics requires high-end device');
            }
            
            // Suggestions
            if (settings.frameRateValue === 30 && (this.deviceProfile.tier === 'ultra' || this.deviceProfile.tier === 'high')) {
                analysis.suggestions.push('Your device can handle 60 FPS');
            }
            
            if (settings.highRes && this.deviceProfile.screen.pixelRatio >= 3) {
                analysis.suggestions.push('High DPI detected - Consider disabling High Res');
            }
        }
        
        // Calculate overall score
        analysis.overallScore = Math.round(
            (analysis.performanceScore * 0.35 +
             analysis.visualScore * 0.25 +
             analysis.batteryScore * 0.20 +
             analysis.competitiveScore * 0.20)
        );
        
        return analysis;
    }

    // ============================================
    // Preset Management
    // ============================================
    
    getPresets(game) {
        const presets = {
            pubg: {
                competitive: {
                    name: 'Competitive',
                    description: 'Maximum FPS and visibility for competitive play',
                    settings: {
                        graphics: 'Smooth',
                        frameRate: 'Extreme',
                        frameRateValue: 60,
                        style: 'Classic',
                        antiAliasing: 'Close'
                    }
                },
                balanced: {
                    name: 'Balanced',
                    description: 'Balance between performance and visuals',
                    settings: {
                        graphics: 'HD',
                        frameRate: 'High',
                        frameRateValue: 30,
                        style: 'Colorful',
                        antiAliasing: 'Close'
                    }
                },
                quality: {
                    name: 'Quality',
                    description: 'Best visuals for casual play',
                    settings: {
                        graphics: 'HDR',
                        frameRate: 'High',
                        frameRateValue: 30,
                        style: 'Realistic',
                        antiAliasing: '2x'
                    }
                },
                battery: {
                    name: 'Battery Saver',
                    description: 'Optimized for battery life',
                    settings: {
                        graphics: 'Smooth',
                        frameRate: 'Medium',
                        frameRateValue: 25,
                        style: 'Classic',
                        antiAliasing: 'Close'
                    }
                }
            },
            cod: {
                competitive: {
                    name: 'Competitive',
                    description: 'Maximum FPS for competitive play',
                    settings: {
                        quality: 'Low',
                        frameRate: 'Ultra',
                        frameRateValue: 90,
                        effects: {
                            depthOfField: false,
                            bloom: false,
                            realTimeShadows: false,
                            ragdoll: false
                        }
                    }
                },
                balanced: {
                    name: 'Balanced',
                    description: 'Balance between performance and visuals',
                    settings: {
                        quality: 'Medium',
                        frameRate: 'High',
                        frameRateValue: 50,
                        effects: {
                            depthOfField: false,
                            bloom: true,
                            realTimeShadows: false,
                            ragdoll: true
                        }
                    }
                },
                quality: {
                    name: 'Quality',
                    description: 'Best visuals for casual play',
                    settings: {
                        quality: 'Very High',
                        frameRate: 'Max',
                        frameRateValue: 60,
                        effects: {
                            depthOfField: true,
                            bloom: true,
                            realTimeShadows: true,
                            ragdoll: true
                        }
                    }
                },
                battery: {
                    name: 'Battery Saver',
                    description: 'Optimized for battery life',
                    settings: {
                        quality: 'Low',
                        frameRate: 'Medium',
                        frameRateValue: 40,
                        effects: {
                            depthOfField: false,
                            bloom: false,
                            realTimeShadows: false,
                            ragdoll: false
                        }
                    }
                }
            },
            freeFire: {
                competitive: {
                    name: 'Competitive',
                    description: 'Maximum FPS and visibility',
                    settings: {
                        graphics: 'Smooth',
                        frameRate: 'High',
                        frameRateValue: 60,
                        shadow: false,
                        highRes: false,
                        filter: 'Classic'
                    }
                },
                balanced: {
                    name: 'Balanced',
                    description: 'Balance between performance and visuals',
                    settings: {
                        graphics: 'Standard',
                        frameRate: 'Normal',
                        frameRateValue: 30,
                        shadow: false,
                        highRes: false,
                        filter: 'Bright'
                    }
                },
                quality: {
                    name: 'Quality',
                    description: 'Best visuals for casual play',
                    settings: {
                        graphics: 'Ultra',
                        frameRate: 'High',
                        frameRateValue: 60,
                        shadow: true,
                        highRes: true,
                        filter: 'Vivid'
                    }
                },
                battery: {
                    name: 'Battery Saver',
                    description: 'Optimized for battery life',
                    settings: {
                        graphics: 'Smooth',
                        frameRate: 'Normal',
                        frameRateValue: 30,
                        shadow: false,
                        highRes: false,
                        filter: 'Classic'
                    }
                }
            }
        };
        
        return presets[game] || {};
    }

    applyPreset(game, presetName) {
        const presets = this.getPresets(game);
        const preset = presets[presetName];
        
        if (!preset) {
            console.warn(`⚠️ Preset "${presetName}" not found for ${game}`);
            return null;
        }
        
        console.log(`✅ Applied preset: ${preset.name}`);
        return {
            ...preset.settings,
            recommendations: [preset.description]
        };
    }


    // ============================================
    // Auto-Adjustment System
    // ============================================
    
    enableAutoAdjustment(game, targetFPS = 60, checkInterval = 5000) {
        if (this.autoAdjustmentInterval) {
            clearInterval(this.autoAdjustmentInterval);
        }
        
        let currentSettings = null;
        let fpsHistory = [];
        
        this.autoAdjustmentInterval = setInterval(() => {
            const currentFPS = this.measureCurrentFPS();
            fpsHistory.push(currentFPS);
            
            if (fpsHistory.length > 10) {
                fpsHistory.shift();
            }
            
            const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
            
            if (avgFPS < targetFPS * 0.8) {
                // FPS too low, reduce settings
                console.log(`⚠️ FPS too low (${avgFPS.toFixed(1)}), reducing settings...`);
                currentSettings = this.reduceSettings(game, currentSettings);
            } else if (avgFPS > targetFPS * 1.2 && fpsHistory.length >= 10) {
                // FPS stable and high, can increase settings
                console.log(`✅ FPS stable (${avgFPS.toFixed(1)}), increasing settings...`);
                currentSettings = this.increaseSettings(game, currentSettings);
            }
        }, checkInterval);
        
        console.log(`🔄 Auto-adjustment enabled for ${game} (target: ${targetFPS} FPS)`);
    }

    disableAutoAdjustment() {
        if (this.autoAdjustmentInterval) {
            clearInterval(this.autoAdjustmentInterval);
            this.autoAdjustmentInterval = null;
            console.log('🔄 Auto-adjustment disabled');
        }
    }

    measureCurrentFPS() {
        // This is a simplified FPS measurement
        // In real implementation, this would measure actual game FPS
        const performanceScore = this.performanceMetrics?.overallScore || 50;
        return Math.round(30 + (performanceScore / 100) * 60);
    }

    reduceSettings(game, currentSettings) {
        if (!currentSettings) {
            return this.getDefaultSettings(game);
        }
        
        const reduced = { ...currentSettings };
        
        if (game === 'pubg') {
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(reduced.graphics);
            if (graphicsIndex > 0) {
                reduced.graphics = this.gameSettings.pubg.graphics[graphicsIndex - 1];
            }
            
            if (reduced.antiAliasing !== 'Close') {
                const aaIndex = this.gameSettings.pubg.antiAliasing.indexOf(reduced.antiAliasing);
                if (aaIndex > 0) {
                    reduced.antiAliasing = this.gameSettings.pubg.antiAliasing[aaIndex - 1];
                }
            }
        } else if (game === 'cod') {
            const qualityIndex = this.gameSettings.cod.quality.indexOf(reduced.quality);
            if (qualityIndex > 0) {
                reduced.quality = this.gameSettings.cod.quality[qualityIndex - 1];
            }
            
            const enabledEffects = Object.keys(reduced.effects).filter(k => reduced.effects[k]);
            if (enabledEffects.length > 0) {
                reduced.effects[enabledEffects[0]] = false;
            }
        } else if (game === 'freeFire') {
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(reduced.graphics);
            if (graphicsIndex > 0) {
                reduced.graphics = this.gameSettings.freeFire.graphics[graphicsIndex - 1];
            }
            
            if (reduced.shadow) {
                reduced.shadow = false;
            } else if (reduced.highRes) {
                reduced.highRes = false;
            }
        }
        
        return reduced;
    }

    increaseSettings(game, currentSettings) {
        if (!currentSettings) {
            return this.getDefaultSettings(game);
        }
        
        const increased = { ...currentSettings };
        
        if (game === 'pubg') {
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(increased.graphics);
            if (graphicsIndex < this.gameSettings.pubg.graphics.length - 1) {
                increased.graphics = this.gameSettings.pubg.graphics[graphicsIndex + 1];
            }
        } else if (game === 'cod') {
            const qualityIndex = this.gameSettings.cod.quality.indexOf(increased.quality);
            if (qualityIndex < this.gameSettings.cod.quality.length - 1) {
                increased.quality = this.gameSettings.cod.quality[qualityIndex + 1];
            }
        } else if (game === 'freeFire') {
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(increased.graphics);
            if (graphicsIndex < this.gameSettings.freeFire.graphics.length - 1) {
                increased.graphics = this.gameSettings.freeFire.graphics[graphicsIndex + 1];
            }
        }
        
        return increased;
    }

    getDefaultSettings(game) {
        if (game === 'pubg') return this.getDefaultPUBGSettings();
        if (game === 'cod') return this.getDefaultCODSettings();
        if (game === 'freeFire') return this.getDefaultFreeFireSettings();
        return {};
    }

    // ============================================
    // Settings Export/Import
    // ============================================
    
    exportSettings(game, settings) {
        const exportData = {
            version: this.version,
            game: game,
            settings: settings,
            deviceProfile: {
                tier: this.deviceProfile?.tier,
                deviceType: this.deviceProfile?.hardware.deviceType,
                os: this.deviceProfile?.platform.os
            },
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    importSettings(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (!data.version || !data.game || !data.settings) {
                throw new Error('Invalid settings format');
            }
            
            console.log(`✅ Imported ${data.game} settings from ${data.date}`);
            return data.settings;
        } catch (error) {
            console.error('❌ Failed to import settings:', error);
            return null;
        }
    }

    // ============================================
    // Settings Validation
    // ============================================
    
    validateSettings(game, settings) {
        const validation = {
            valid: true,
            errors: [],
            warnings: []
        };
        
        if (game === 'pubg') {
            if (!this.gameSettings.pubg.graphics.includes(settings.graphics)) {
                validation.valid = false;
                validation.errors.push(`Invalid graphics setting: ${settings.graphics}`);
            }
            
            if (!Object.keys(this.gameSettings.pubg.frameRate).includes(settings.frameRate)) {
                validation.valid = false;
                validation.errors.push(`Invalid frame rate: ${settings.frameRate}`);
            }
            
            if (!this.gameSettings.pubg.styles.includes(settings.style)) {
                validation.valid = false;
                validation.errors.push(`Invalid style: ${settings.style}`);
            }
            
            if (!this.gameSettings.pubg.antiAliasing.includes(settings.antiAliasing)) {
                validation.valid = false;
                validation.errors.push(`Invalid anti-aliasing: ${settings.antiAliasing}`);
            }
            
            // Warnings
            if (settings.frameRateValue >= 60 && this.deviceProfile?.tier === 'low') {
                validation.warnings.push('High FPS may not be achievable on this device');
            }
            
            if (settings.graphics === 'UHD' && this.deviceProfile?.tier !== 'ultra') {
                validation.warnings.push('UHD graphics may cause performance issues');
            }
            
        } else if (game === 'cod') {
            if (!this.gameSettings.cod.quality.includes(settings.quality)) {
                validation.valid = false;
                validation.errors.push(`Invalid quality setting: ${settings.quality}`);
            }
            
            if (!Object.keys(this.gameSettings.cod.frameRate).includes(settings.frameRate)) {
                validation.valid = false;
                validation.errors.push(`Invalid frame rate: ${settings.frameRate}`);
            }
            
            if (typeof settings.effects !== 'object') {
                validation.valid = false;
                validation.errors.push('Effects must be an object');
            }
            
            // Warnings
            if (settings.frameRateValue >= 90 && this.deviceProfile?.tier !== 'ultra') {
                validation.warnings.push('Ultra FPS requires high-end device');
            }
            
            const enabledEffects = Object.values(settings.effects).filter(v => v).length;
            if (enabledEffects >= 3 && this.deviceProfile?.tier === 'low') {
                validation.warnings.push('Multiple effects may cause performance issues');
            }
            
        } else if (game === 'freeFire') {
            if (!this.gameSettings.freeFire.graphics.includes(settings.graphics)) {
                validation.valid = false;
                validation.errors.push(`Invalid graphics setting: ${settings.graphics}`);
            }
            
            if (!Object.keys(this.gameSettings.freeFire.frameRate).includes(settings.frameRate)) {
                validation.valid = false;
                validation.errors.push(`Invalid frame rate: ${settings.frameRate}`);
            }
            
            if (!this.gameSettings.freeFire.filters.includes(settings.filter)) {
                validation.valid = false;
                validation.errors.push(`Invalid filter: ${settings.filter}`);
            }
            
            if (typeof settings.shadow !== 'boolean') {
                validation.valid = false;
                validation.errors.push('Shadow must be boolean');
            }
            
            if (typeof settings.highRes !== 'boolean') {
                validation.valid = false;
                validation.errors.push('High Res must be boolean');
            }
            
            // Warnings
            if (settings.graphics === 'Max' && this.deviceProfile?.platform.os !== 'Android') {
                validation.warnings.push('Max graphics only available in Free Fire MAX');
            }
            
            if (settings.highRes && this.deviceProfile?.screen.pixelRatio >= 3) {
                validation.warnings.push('High Res may cause performance issues on high DPI screens');
            }
        }
        
        return validation;
    }

    // ============================================
    // Performance Prediction
    // ============================================
    
    predictPerformance(game, settings) {
        const prediction = {
            estimatedFPS: 0,
            batteryDrain: 0,
            thermalImpact: 0,
            stability: 0,
            rating: ''
        };
        
        const basePerformance = this.performanceMetrics?.overallScore || 50;
        
        if (game === 'pubg') {
            const graphicsIndex = this.gameSettings.pubg.graphics.indexOf(settings.graphics);
            const graphicsPenalty = graphicsIndex * 5;
            const aaPenalty = settings.antiAliasing === '4x' ? 15 : settings.antiAliasing === '2x' ? 8 : 0;
            
            prediction.estimatedFPS = Math.round(
                (basePerformance / 100) * settings.frameRateValue * 
                (1 - (graphicsPenalty + aaPenalty) / 100)
            );
            
            prediction.batteryDrain = graphicsIndex * 10 + (settings.frameRateValue / 90) * 50 + aaPenalty;
            prediction.thermalImpact = graphicsIndex * 8 + (settings.frameRateValue / 90) * 60;
            
        } else if (game === 'cod') {
            const qualityIndex = this.gameSettings.cod.quality.indexOf(settings.quality);
            const qualityPenalty = qualityIndex * 8;
            const effectsCount = Object.values(settings.effects).filter(v => v).length;
            const effectsPenalty = effectsCount * 5;
            
            prediction.estimatedFPS = Math.round(
                (basePerformance / 100) * settings.frameRateValue * 
                (1 - (qualityPenalty + effectsPenalty) / 100)
            );
            
            prediction.batteryDrain = qualityIndex * 12 + (settings.frameRateValue / 90) * 50 + effectsCount * 8;
            prediction.thermalImpact = qualityIndex * 10 + (settings.frameRateValue / 90) * 60 + effectsCount * 5;
            
        } else if (game === 'freeFire') {
            const graphicsIndex = this.gameSettings.freeFire.graphics.indexOf(settings.graphics);
            const graphicsPenalty = graphicsIndex * 6;
            const extrasPenalty = (settings.shadow ? 8 : 0) + (settings.highRes ? 12 : 0);
            
            prediction.estimatedFPS = Math.round(
                (basePerformance / 100) * settings.frameRateValue * 
                (1 - (graphicsPenalty + extrasPenalty) / 100)
            );
            
            prediction.batteryDrain = graphicsIndex * 10 + (settings.frameRateValue / 60) * 40 + extrasPenalty;
            prediction.thermalImpact = graphicsIndex * 8 + (settings.frameRateValue / 60) * 50 + extrasPenalty;
        }
        
        // Calculate stability (how consistent FPS will be)
        prediction.stability = Math.max(0, 100 - prediction.thermalImpact);
        
        // Rating
        if (prediction.estimatedFPS >= settings.frameRateValue * 0.9) {
            prediction.rating = 'excellent';
        } else if (prediction.estimatedFPS >= settings.frameRateValue * 0.75) {
            prediction.rating = 'good';
        } else if (prediction.estimatedFPS >= settings.frameRateValue * 0.6) {
            prediction.rating = 'fair';
        } else {
            prediction.rating = 'poor';
        }
        
        return prediction;
    }

    // ============================================
    // Benchmark System
    // ============================================
    
    async runBenchmark(game, settings) {
        console.log(`🔬 Running benchmark for ${game}...`);
        
        const benchmark = {
            game: game,
            settings: settings,
            results: {
                avgFPS: 0,
                minFPS: 0,
                maxFPS: 0,
                frameTime: 0,
                stability: 0
            },
            duration: 0,
            timestamp: Date.now()
        };
        
        const startTime = performance.now();
        
        // Simulate benchmark (in real implementation, this would run actual game tests)
        const prediction = this.predictPerformance(game, settings);
        
        benchmark.results.avgFPS = prediction.estimatedFPS;
        benchmark.results.minFPS = Math.round(prediction.estimatedFPS * 0.85);
        benchmark.results.maxFPS = Math.round(prediction.estimatedFPS * 1.15);
        benchmark.results.frameTime = 1000 / prediction.estimatedFPS;
        benchmark.results.stability = prediction.stability;
        
        benchmark.duration = performance.now() - startTime;
        
        console.log(`✅ Benchmark completed in ${benchmark.duration.toFixed(2)}ms`);
        console.log(`📊 Average FPS: ${benchmark.results.avgFPS}`);
        
        return benchmark;
    }

    // ============================================
    // Device Compatibility Check
    // ============================================
    
    checkCompatibility(game, settings) {
        const compatibility = {
            compatible: true,
            issues: [],
            warnings: [],
            recommendations: []
        };
        
        if (!this.initialized) {
            compatibility.compatible = false;
            compatibility.issues.push('Graphics engine not initialized');
            return compatibility;
        }
        
        const tier = this.deviceProfile.tier;
        const prediction = this.predictPerformance(game, settings);
        
        // Check if device can handle settings
        if (prediction.estimatedFPS < settings.frameRateValue * 0.5) {
            compatibility.compatible = false;
            compatibility.issues.push('Device cannot maintain target FPS');
            compatibility.recommendations.push('Reduce graphics settings or target FPS');
        }
        
        if (game === 'pubg') {
            if (settings.graphics === 'UHD' && tier !== 'ultra') {
                compatibility.warnings.push('UHD graphics may cause lag on this device');
            }
            
            if (settings.frameRateValue >= 90 && tier !== 'ultra') {
                compatibility.warnings.push('90 FPS may not be stable on this device');
            }
            
            if (settings.antiAliasing === '4x' && (tier === 'low' || tier === 'very-low')) {
                compatibility.warnings.push('4x anti-aliasing not recommended for this device');
            }
            
        } else if (game === 'cod') {
            if (settings.quality === 'Very High' && tier !== 'ultra' && tier !== 'high') {
                compatibility.warnings.push('Very High quality may cause performance issues');
            }
            
            if (settings.frameRateValue >= 90 && tier !== 'ultra') {
                compatibility.warnings.push('Ultra FPS requires flagship device');
            }
            
            const enabledEffects = Object.values(settings.effects).filter(v => v).length;
            if (enabledEffects >= 3 && tier === 'low') {
                compatibility.warnings.push('Multiple effects may cause significant lag');
            }
            
        } else if (game === 'freeFire') {
            if (settings.graphics === 'Max' && this.deviceProfile.platform.os !== 'Android') {
                compatibility.issues.push('Max graphics only available in Free Fire MAX (Android)');
                compatibility.compatible = false;
            }
            
            if (settings.highRes && this.deviceProfile.screen.pixelRatio >= 3) {
                compatibility.warnings.push('High Res may cause lag on high DPI screens');
            }
        }
        
        // Battery warnings
        if (this.deviceProfile.battery.supported && this.deviceProfile.battery.level < 0.2) {
            compatibility.warnings.push('Low battery - Consider reducing settings');
        }
        
        // Thermal warnings
        if (prediction.thermalImpact > 70) {
            compatibility.warnings.push('High thermal impact - Device may heat up');
        }
        
        return compatibility;
    }

    // ============================================
    // Utility Methods
    // ============================================
    
    getDeviceInfo() {
        if (!this.initialized) {
            return { error: 'Engine not initialized' };
        }
        
        return {
            tier: this.deviceProfile.tier,
            deviceType: this.deviceProfile.hardware.deviceType,
            os: this.deviceProfile.platform.os,
            browser: this.deviceProfile.platform.browser,
            screen: {
                resolution: `${this.deviceProfile.screen.width}x${this.deviceProfile.screen.height}`,
                pixelRatio: this.deviceProfile.screen.pixelRatio,
                refreshRate: this.deviceProfile.screen.refreshRate
            },
            hardware: {
                cpuCores: this.deviceProfile.hardware.cpuCores,
                ram: this.deviceProfile.hardware.ram,
                gpu: this.deviceProfile.gpu.renderer
            },
            performance: {
                overallScore: this.performanceMetrics.overallScore,
                cpuScore: this.performanceMetrics.cpu.score,
                gpuScore: this.performanceMetrics.gpu.score
            }
        };
    }

    getSupportedSettings(game) {
        return this.gameSettings[game] || null;
    }

    getRecommendedSettings(game, priority = 'balanced') {
        const priorities = {
            performance: { prioritizeFPS: true, priorityQuality: false },
            balanced: { prioritizeFPS: false, priorityQuality: false },
            quality: { prioritizeFPS: false, priorityQuality: true },
            battery: { batteryMode: true },
            competitive: { competitiveMode: true }
        };
        
        const options = priorities[priority] || priorities.balanced;
        
        if (game === 'pubg') {
            return this.generatePUBGSettings(options);
        } else if (game === 'cod') {
            return this.generateCODSettings(options);
        } else if (game === 'freeFire') {
            return this.generateFreeFireSettings(options);
        }
        
        return null;
    }

    // ============================================
    // Debug and Logging
    // ============================================
    
    getDebugInfo() {
        return {
            version: this.version,
            initialized: this.initialized,
            deviceProfile: this.deviceProfile,
            performanceMetrics: this.performanceMetrics,
            gameSettings: this.gameSettings
        };
    }

    logSettings(game, settings) {
        console.group(`🎮 ${game.toUpperCase()} Settings`);
        
        Object.entries(settings).forEach(([key, value]) => {
            if (key === 'recommendations') {
                console.group('📋 Recommendations');
                value.forEach(rec => console.log(`  • ${rec}`));
                console.groupEnd();
            } else if (typeof value === 'object' && value !== null) {
                console.group(`${key}:`);
                Object.entries(value).forEach(([k, v]) => {
                    console.log(`  ${k}: ${v}`);
                });
                console.groupEnd();
            } else {
                console.log(`${key}: ${value}`);
            }
        });
        
        console.groupEnd();
    }
}

// ============================================
// Export Engine Instance
// ============================================

// Create singleton instance
let engineInstance = null;

export function getGraphicsEngine() {
    if (!engineInstance) {
        engineInstance = new GraphicsEngine();
    }
    return engineInstance;
}

export default GraphicsEngine;

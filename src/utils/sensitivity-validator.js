// ============================================
// Sensitivity Validator - التحقق من جودة الحساسيات
// ============================================

/**
 * أداة للتحقق من صحة ومنطقية الحساسيات المولدة
 */

export class SensitivityValidator {
    constructor() {
        this.validationRules = this.defineValidationRules();
    }

    defineValidationRules() {
        return {
            // القواعد الأساسية
            basic: {
                min: 20,
                max: 200,
                description: 'يجب أن تكون القيم بين 20 و 200'
            },
            
            // قواعد العلاقات بين المناظير
            scopeRelations: {
                // الحساسية العامة يجب أن تكون الأعلى أو قريبة من الأعلى
                generalVsRedDot: {
                    rule: (general, redDot) => general >= redDot * 0.95,
                    description: 'الحساسية العامة يجب أن تكون أعلى أو مساوية للنقطة الحمراء'
                },
                
                // النقطة الحمراء أعلى من 2x
                redDotVsScope2x: {
                    rule: (redDot, scope2x) => redDot >= scope2x * 1.05,
                    description: 'النقطة الحمراء يجب أن تكون أعلى من سكوب 2x'
                },
                
                // 2x أعلى من 4x
                scope2xVsScope4x: {
                    rule: (scope2x, scope4x) => scope2x >= scope4x * 1.15,
                    description: 'سكوب 2x يجب أن تكون أعلى من سكوب 4x'
                },
                
                // 4x أعلى من Sniper
                scope4xVsSniper: {
                    rule: (scope4x, sniper) => scope4x >= sniper * 1.25,
                    description: 'سكوب 4x يجب أن تكون أعلى من القناصة'
                },
                
                // النظر الحر أعلى من العامة
                freeLookVsGeneral: {
                    rule: (freeLook, general) => freeLook >= general * 0.95,
                    description: 'النظر الحر يجب أن يكون قريباً أو أعلى من الحساسية العامة'
                }
            },
            
            // قواعد التناسب
            proportions: {
                // الفرق بين المناظير المتتالية يجب أن يكون معقولاً
                maxDifference: {
                    rule: (higher, lower) => (higher - lower) / higher <= 0.5,
                    description: 'الفرق بين المناظير المتتالية لا يجب أن يتجاوز 50%'
                },
                
                // القيم لا يجب أن تكون متطرفة
                extremeValues: {
                    rule: (value) => value >= 30 && value <= 180,
                    description: 'تجنب القيم المتطرفة (أقل من 30 أو أكثر من 180)'
                }
            },
            
            // قواعد الجيروسكوب
            gyroscope: {
                range: {
                    min: 20,
                    max: 100,
                    description: 'حساسية الجيروسكوب يجب أن تكون بين 20 و 100'
                },
                
                // الجيروسكوب يجب أن يكون أقل من الحساسية العادية
                vsNormal: {
                    rule: (gyro, normal) => gyro <= normal * 0.6,
                    description: 'الجيروسكوب يجب أن يكون أقل من الحساسية العادية'
                }
            },
            
            // قواعد زر الضرب
            fireButton: {
                range: {
                    min: 10,
                    max: 100,
                    description: 'حجم زر الضرب يجب أن يكون بين 10 و 100'
                }
            }
        };
    }

    /**
     * التحقق الشامل من الحساسيات
     */
    validate(sensitivities) {
        const results = {
            isValid: true,
            errors: [],
            warnings: [],
            score: 100,
            details: {}
        };

        // 1. التحقق من القيم الأساسية
        this.validateBasicValues(sensitivities, results);

        // 2. التحقق من العلاقات بين المناظير
        this.validateScopeRelations(sensitivities, results);

        // 3. التحقق من التناسب
        this.validateProportions(sensitivities, results);

        // 4. التحقق من الجيروسكوب
        if (sensitivities.gyroscope) {
            this.validateGyroscope(sensitivities, results);
        }

        // 5. التحقق من زر الضرب
        if (sensitivities.fireButtonSize) {
            this.validateFireButton(sensitivities, results);
        }

        // حساب النقاط النهائية
        results.score = Math.max(0, results.score - (results.errors.length * 10) - (results.warnings.length * 5));
        results.isValid = results.errors.length === 0;

        return results;
    }

    validateBasicValues(sensitivities, results) {
        const { min, max } = this.validationRules.basic;
        const scopes = ['general', 'redDot', 'scope2x', 'scope4x', 'sniper', 'freeLook'];

        for (const scope of scopes) {
            const value = sensitivities[scope];

            if (value === undefined || value === null) {
                results.errors.push(`القيمة ${scope} غير موجودة`);
                results.score -= 10;
                continue;
            }

            if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
                results.errors.push(`القيمة ${scope} غير صالحة: ${value}`);
                results.score -= 10;
                continue;
            }

            if (value < min || value > max) {
                results.errors.push(`القيمة ${scope} خارج النطاق: ${value} (يجب أن تكون بين ${min} و ${max})`);
                results.score -= 10;
            }

            // تحذير للقيم المتطرفة
            if (value < 30 || value > 180) {
                results.warnings.push(`القيمة ${scope} متطرفة: ${value}`);
            }
        }
    }

    validateScopeRelations(sensitivities, results) {
        const relations = this.validationRules.scopeRelations;

        // General vs RedDot
        if (!relations.generalVsRedDot.rule(sensitivities.general, sensitivities.redDot)) {
            results.warnings.push(relations.generalVsRedDot.description);
            results.score -= 5;
        }

        // RedDot vs Scope2x
        if (!relations.redDotVsScope2x.rule(sensitivities.redDot, sensitivities.scope2x)) {
            results.errors.push(relations.redDotVsScope2x.description);
            results.score -= 10;
        }

        // Scope2x vs Scope4x
        if (!relations.scope2xVsScope4x.rule(sensitivities.scope2x, sensitivities.scope4x)) {
            results.errors.push(relations.scope2xVsScope4x.description);
            results.score -= 10;
        }

        // Scope4x vs Sniper
        if (!relations.scope4xVsSniper.rule(sensitivities.scope4x, sensitivities.sniper)) {
            results.errors.push(relations.scope4xVsSniper.description);
            results.score -= 10;
        }

        // FreeLook vs General
        if (!relations.freeLookVsGeneral.rule(sensitivities.freeLook, sensitivities.general)) {
            results.warnings.push(relations.freeLookVsGeneral.description);
            results.score -= 5;
        }
    }

    validateProportions(sensitivities, results) {
        const scopes = [
            { name: 'general', value: sensitivities.general },
            { name: 'redDot', value: sensitivities.redDot },
            { name: 'scope2x', value: sensitivities.scope2x },
            { name: 'scope4x', value: sensitivities.scope4x },
            { name: 'sniper', value: sensitivities.sniper }
        ];

        // التحقق من الفروقات بين المناظير المتتالية
        for (let i = 0; i < scopes.length - 1; i++) {
            const current = scopes[i];
            const next = scopes[i + 1];

            if (current.value < next.value) {
                results.errors.push(`${current.name} (${current.value}) يجب أن يكون أعلى من ${next.name} (${next.value})`);
                results.score -= 10;
            }

            const difference = (current.value - next.value) / current.value;
            if (difference > 0.5) {
                results.warnings.push(`الفرق بين ${current.name} و ${next.name} كبير جداً (${Math.round(difference * 100)}%)`);
                results.score -= 3;
            }
        }
    }

    validateGyroscope(sensitivities, results) {
        const gyro = sensitivities.gyroscope;
        const { min, max } = this.validationRules.gyroscope.range;

        if (typeof gyro === 'object') {
            // التحقق من كل قيمة في الجيروسكوب
            for (const [key, value] of Object.entries(gyro)) {
                if (value < min || value > max) {
                    results.errors.push(`جيروسكوب ${key} خارج النطاق: ${value}`);
                    results.score -= 5;
                }

                // التحقق من العلاقة مع الحساسية العادية
                const normalValue = sensitivities[key] || sensitivities.general;
                if (!this.validationRules.gyroscope.vsNormal.rule(value, normalValue)) {
                    results.warnings.push(`جيروسكوب ${key} يجب أن يكون أقل من الحساسية العادية`);
                    results.score -= 3;
                }
            }
        } else if (typeof gyro === 'number') {
            if (gyro < min || gyro > max) {
                results.errors.push(`الجيروسكوب خارج النطاق: ${gyro}`);
                results.score -= 5;
            }
        }
    }

    validateFireButton(sensitivities, results) {
        const { min, max } = this.validationRules.fireButton.range;
        const value = sensitivities.fireButtonSize;

        if (value < min || value > max) {
            results.errors.push(`حجم زر الضرب خارج النطاق: ${value}`);
            results.score -= 5;
        }
    }

    /**
     * اختبار شامل للمحرك
     */
    testEngine(engine) {
        console.log('🧪 بدء اختبار المحرك...\n');

        const playStyles = ['fast', 'medium', 'slow', 'proSniper', 'aggressive', 'tactical'];
        const results = [];

        for (const style of playStyles) {
            console.log(`\n📊 اختبار نمط: ${style}`);
            
            const generated = engine.generateSensitivity(style, 'medium');
            const validation = this.validate(generated.sensitivities);

            console.log(`   ✓ النتيجة: ${validation.score}/100`);
            console.log(`   ✓ صالح: ${validation.isValid ? 'نعم' : 'لا'}`);
            
            if (validation.errors.length > 0) {
                console.log(`   ❌ أخطاء: ${validation.errors.length}`);
                validation.errors.forEach(err => console.log(`      - ${err}`));
            }
            
            if (validation.warnings.length > 0) {
                console.log(`   ⚠️  تحذيرات: ${validation.warnings.length}`);
                validation.warnings.forEach(warn => console.log(`      - ${warn}`));
            }

            results.push({
                style,
                sensitivities: generated.sensitivities,
                validation
            });
        }

        // ملخص النتائج
        console.log('\n\n📈 ملخص الاختبار:');
        const avgScore = results.reduce((sum, r) => sum + r.validation.score, 0) / results.length;
        const allValid = results.every(r => r.validation.isValid);
        
        console.log(`   متوسط النقاط: ${avgScore.toFixed(1)}/100`);
        console.log(`   جميع الاختبارات صالحة: ${allValid ? 'نعم ✅' : 'لا ❌'}`);

        return {
            results,
            avgScore,
            allValid
        };
    }

    /**
     * مقارنة بين محركين
     */
    compareEngines(engine1, engine2, playStyle = 'medium') {
        console.log('\n🔬 مقارنة المحركات...\n');

        const result1 = engine1.generateSensitivity(playStyle, 'medium');
        const result2 = engine2.generateSensitivity(playStyle, 'medium');

        const validation1 = this.validate(result1.sensitivities);
        const validation2 = this.validate(result2.sensitivities);

        console.log('المحرك 1:');
        console.log(`   النقاط: ${validation1.score}/100`);
        console.log(`   الأخطاء: ${validation1.errors.length}`);
        console.log(`   التحذيرات: ${validation1.warnings.length}`);

        console.log('\nالمحرك 2:');
        console.log(`   النقاط: ${validation2.score}/100`);
        console.log(`   الأخطاء: ${validation2.errors.length}`);
        console.log(`   التحذيرات: ${validation2.warnings.length}`);

        const winner = validation1.score > validation2.score ? 'المحرك 1' : 
                      validation2.score > validation1.score ? 'المحرك 2' : 'تعادل';

        console.log(`\n🏆 الفائز: ${winner}`);

        return {
            engine1: validation1,
            engine2: validation2,
            winner
        };
    }

    /**
     * توليد تقرير مفصل
     */
    generateReport(sensitivities) {
        const validation = this.validate(sensitivities);

        const report = {
            timestamp: new Date().toISOString(),
            sensitivities,
            validation,
            
            // تحليل إضافي
            analysis: {
                range: this.calculateRange(sensitivities),
                average: this.calculateAverage(sensitivities),
                distribution: this.analyzeDistribution(sensitivities),
                consistency: this.checkConsistency(sensitivities)
            },
            
            // توصيات
            recommendations: this.generateRecommendations(sensitivities, validation)
        };

        return report;
    }

    calculateRange(sensitivities) {
        const values = [
            sensitivities.general,
            sensitivities.redDot,
            sensitivities.scope2x,
            sensitivities.scope4x,
            sensitivities.sniper
        ];

        return {
            min: Math.min(...values),
            max: Math.max(...values),
            spread: Math.max(...values) - Math.min(...values)
        };
    }

    calculateAverage(sensitivities) {
        const values = [
            sensitivities.general,
            sensitivities.redDot,
            sensitivities.scope2x,
            sensitivities.scope4x,
            sensitivities.sniper,
            sensitivities.freeLook
        ];

        return values.reduce((sum, v) => sum + v, 0) / values.length;
    }

    analyzeDistribution(sensitivities) {
        const values = [
            sensitivities.general,
            sensitivities.redDot,
            sensitivities.scope2x,
            sensitivities.scope4x,
            sensitivities.sniper
        ];

        // حساب الانحراف المعياري
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        return {
            mean: avg,
            standardDeviation: stdDev,
            coefficient: stdDev / avg // معامل الاختلاف
        };
    }

    checkConsistency(sensitivities) {
        // التحقق من الاتساق في التناقص
        const values = [
            sensitivities.general,
            sensitivities.redDot,
            sensitivities.scope2x,
            sensitivities.scope4x,
            sensitivities.sniper
        ];

        let isConsistent = true;
        const ratios = [];

        for (let i = 0; i < values.length - 1; i++) {
            const ratio = values[i + 1] / values[i];
            ratios.push(ratio);

            if (ratio > 1) {
                isConsistent = false;
            }
        }

        // حساب متوسط النسبة
        const avgRatio = ratios.reduce((sum, r) => sum + r, 0) / ratios.length;

        return {
            isConsistent,
            averageRatio: avgRatio,
            ratios
        };
    }

    generateRecommendations(sensitivities, validation) {
        const recommendations = [];

        if (validation.score < 70) {
            recommendations.push('⚠️ النقاط منخفضة - يُنصح بإعادة التوليد');
        }

        if (validation.errors.length > 0) {
            recommendations.push('❌ يوجد أخطاء يجب إصلاحها');
        }

        const range = this.calculateRange(sensitivities);
        if (range.spread > 120) {
            recommendations.push('📊 الفرق بين أعلى وأقل قيمة كبير جداً');
        }

        const consistency = this.checkConsistency(sensitivities);
        if (!consistency.isConsistent) {
            recommendations.push('🔄 القيم غير متسقة - بعض المناظير أعلى من السابقة');
        }

        if (recommendations.length === 0) {
            recommendations.push('✅ الإعدادات ممتازة!');
        }

        return recommendations;
    }
}

// تصدير نسخة واحدة
export const sensitivityValidator = new SensitivityValidator();
export default SensitivityValidator;

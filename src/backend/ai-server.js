// AI Backend Server - Express.js API for AI Features
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCi1euTKx54HzVb1CVl7RNriN-xnCeXQqo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// Middleware for validation
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// AI Chat endpoint
app.post('/api/chat', [
    body('message').isString().trim().isLength({ min: 1, max: 4000 }),
    body('history').optional().isArray(),
    validateRequest
], async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        // Prepare conversation context
        const contents = [
            ...history.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ];

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('Gemini API Error:', data.error);
            return res.status(500).json({ 
                error: 'AI service error',
                details: data.error.message 
            });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        res.json({
            success: true,
            response: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Translation endpoint
app.post('/api/translate', [
    body('text').isString().trim().isLength({ min: 1, max: 5000 }),
    body('targetLang').isString().trim().isLength({ min: 2, max: 10 }),
    validateRequest
], async (req, res) => {
    try {
        const { text, targetLang } = req.body;

        const prompt = `Translate the following text to ${targetLang}. Only return the translation, no explanations:\n${text}`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    topK: 1,
                    topP: 1,
                    maxOutputTokens: 2048,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ 
                error: 'Translation service error',
                details: data.error.message 
            });
        }

        res.json({
            success: true,
            translation: data.candidates[0].content.parts[0].text,
            originalText: text,
            targetLanguage: targetLang
        });

    } catch (error) {
        console.error('Translation endpoint error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Sensitivity recommendation endpoint
app.post('/api/sensitivity/recommend', [
    body('deviceInfo').isObject(),
    body('playStyle').isString().isIn(['fast', 'medium', 'slow']),
    validateRequest
], async (req, res) => {
    try {
        const { deviceInfo, playStyle } = req.body;

        const prompt = `
        Based on the following device information, provide optimal gaming sensitivity recommendations for Free Fire:
        
        Device Info:
        ${JSON.stringify(deviceInfo, null, 2)}
        
        Play Style: ${playStyle}
        
        Provide specific recommendations for:
        1. General sensitivity (number between 20-200)
        2. Red dot sensitivity (number between 20-200)
        3. Scope sensitivities (2x, 4x, sniper)
        4. Fire button size (number between 10-100)
        5. Additional tips
        
        Format the response as JSON with these exact keys: general, redDot, scope2x, scope4x, sniper, freeLook, fireButtonSize, tips
        `;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.5,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ 
                error: 'AI recommendation error',
                details: data.error.message 
            });
        }

        // Try to parse JSON from response
        let recommendations;
        try {
            const text = data.candidates[0].content.parts[0].text;
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        } catch (e) {
            recommendations = null;
        }

        res.json({
            success: true,
            recommendations: recommendations,
            rawResponse: data.candidates[0].content.parts[0].text
        });

    } catch (error) {
        console.error('Sensitivity recommendation error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Gaming tips endpoint
app.get('/api/tips/:game', async (req, res) => {
    try {
        const { game } = req.params;
        const validGames = ['freefire', 'pubg', 'pubgmobile'];
        
        if (!validGames.includes(game.toLowerCase())) {
            return res.status(400).json({ 
                error: 'Invalid game. Supported games: freefire, pubg, pubgmobile' 
            });
        }

        const prompt = `Provide 5 professional gaming tips for ${game}. Make them concise and actionable.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                }
            })
        });

        const data = await response.json();

        if (data.error) {
            return res.status(500).json({ 
                error: 'Tips generation error',
                details: data.error.message 
            });
        }

        res.json({
            success: true,
            game: game,
            tips: data.candidates[0].content.parts[0].text
        });

    } catch (error) {
        console.error('Tips endpoint error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Backend Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

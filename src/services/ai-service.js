// AI Service - Backend for AI Features
const GEMINI_API_KEY = 'AIzaSyCi1euTKx54HzVb1CVl7RNriN-xnCeXQqo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

// AI Service Class
export class AIService {
    constructor() {
        this.conversationHistory = [];
        this.currentChatId = null;
        this.chats = JSON.parse(localStorage.getItem('chats') || '[]');
    }

    // Initialize new chat
    startNewChat() {
        const chatId = Date.now().toString();
        const newChat = {
            id: chatId,
            title: 'محادثة جديدة',
            messages: [],
            createdAt: new Date().toISOString()
        };
        
        this.chats.unshift(newChat);
        this.currentChatId = chatId;
        this.conversationHistory = [];
        
        this.saveChats();
        return chatId;
    }

    // Load existing chat
    loadChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return null;
        
        this.currentChatId = chatId;
        this.conversationHistory = chat.messages || [];
        return chat;
    }

    // Delete chat
    deleteChat(chatId) {
        const index = this.chats.findIndex(c => c.id === chatId);
        if (index !== -1) {
            this.chats.splice(index, 1);
            
            if (chatId === this.currentChatId) {
                if (this.chats.length > 0) {
                    this.loadChat(this.chats[0].id);
                } else {
                    this.startNewChat();
                }
            }
            
            this.saveChats();
            return true;
        }
        return false;
    }

    // Edit chat title
    editChatTitle(chatId, newTitle) {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat && newTitle.trim()) {
            chat.title = newTitle.trim();
            this.saveChats();
            return true;
        }
        return false;
    }

    // Get all chats
    getChats() {
        return this.chats;
    }

    // Save chats to localStorage
    saveChats() {
        localStorage.setItem('chats', JSON.stringify(this.chats));
    }

    // Send message to AI
    async sendMessage(message, context = '') {
        if (!message.trim()) {
            throw new Error('Message cannot be empty');
        }

        if (!this.currentChatId) {
            this.startNewChat();
        }

        try {
            // Prepare conversation context
            const conversationContext = this.conversationHistory.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            }));

            // Add gaming context if relevant
            const gamingContext = this.getGamingContext();
            
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: gamingContext }]
                        },
                        ...conversationContext,
                        {
                            role: 'user',
                            parts: [{ text: message }]
                        }
                    ],
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
                throw new Error(data.error.message);
            }

            const aiResponse = data.candidates[0].content.parts[0].text;
            
            // Update conversation history
            this.conversationHistory.push(
                { role: 'user', content: message },
                { role: 'model', content: aiResponse }
            );

            // Update current chat
            const currentChat = this.chats.find(c => c.id === this.currentChatId);
            if (currentChat) {
                currentChat.messages = this.conversationHistory;
                
                // Update title based on first message
                if (this.conversationHistory.length === 2) {
                    currentChat.title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
                }
                
                this.saveChats();
            }

            return {
                success: true,
                response: aiResponse,
                chatId: this.currentChatId
            };
            
        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                success: false,
                error: error.message,
                response: 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.'
            };
        }
    }

    // Get gaming context for better responses
    getGamingContext() {
        return `
        أنت مساعد ذكي متخصص في ألعاب الفيديو، وخاصة Free Fire و PUBG Mobile.
        يمكنك مساعدة اللاعبين في:
        - توليد إعدادات الحساسية المناسبة لأجهزتهم
        - نصائح لتحسين الأداء في اللعبة
        - إعدادات الجرافيك الأمثل
        - استراتيجيات اللعب
        - حلول للمشاكل التقنية
        
        كن ودوداً ومفيداً وقدم إجابات دقيقة ومفصلة.
        `;
    }

    // Translate text
    async translate(text, targetLang) {
        try {
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
                throw new Error(data.error.message);
            }

            return {
                success: true,
                translation: data.candidates[0].content.parts[0].text
            };
        } catch (error) {
            console.error('Translation Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Generate sensitivity recommendations
    async generateSensitivityRecommendation(deviceInfo, playStyle) {
        const prompt = `
        بناءً على معلومات الجهاز التالية، قم بتوصية إعدادات الحساسية المثالية:
        
        معلومات الجهاز:
        ${JSON.stringify(deviceInfo, null, 2)}
        
        نمط اللعب: ${playStyle}
        
        قدم توصيات محددة لـ:
        1. الحساسية العامة
        2. حساسية النقطة الحمراء
        3. حساسية المناظير
        4. حجم زر الضرب
        5. نصائح إضافية
        `;

        try {
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
                throw new Error(data.error.message);
            }

            return {
                success: true,
                recommendation: data.candidates[0].content.parts[0].text
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Clear current chat
    clearChat() {
        this.conversationHistory = [];
        const currentChat = this.chats.find(c => c.id === this.currentChatId);
        if (currentChat) {
            currentChat.messages = [];
            this.saveChats();
        }
    }
}

// Create singleton instance
export const aiService = new AIService();

// Export for use in other modules
export default AIService;

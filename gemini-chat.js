const GEMINI_API_KEY = 'AIzaSyCi1euTKx54HzVb1CVl7RNriN-xnCeXQqo'; // استبدل بمفتاح API الخاص بك
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';

let conversationHistory = [];
let currentChatId = null;
let chats = JSON.parse(localStorage.getItem('chats') || '[]');

function startNewChat() {
    const chatId = Date.now().toString();
    const newChat = {
        id: chatId,
        title: 'محادثة جديدة',
        messages: []
    };
    
    chats.unshift(newChat);
    currentChatId = chatId;
    conversationHistory = [];
    
    updateChatHistory();
    clearChat();
    saveChatToLocalStorage();
}

function updateChatHistory() {
    const history = document.getElementById('chat-history');
    history.innerHTML = chats.map(chat => `
        <div class="chat-history-item ${chat.id === currentChatId ? 'active' : ''}" 
             onclick="loadChat('${chat.id}')">
            <div class="chat-info">
                <i class="fas fa-comments"></i>
                <span>${chat.title}</span>
            </div>
            <div class="chat-actions">
                <button class="chat-action-btn edit" onclick="event.stopPropagation(); editChatTitle('${chat.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="chat-action-btn delete" onclick="event.stopPropagation(); deleteChat('${chat.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function deleteChat(chatId) {
    if (confirm('هل أنت متأكد من حذف هذه المحادثة؟')) {
        const index = chats.findIndex(c => c.id === chatId);
        if (index !== -1) {
            chats.splice(index, 1);
            if (chatId === currentChatId) {
                if (chats.length > 0) {
                    loadChat(chats[0].id);
                } else {
                    startNewChat();
                }
            }
            saveChatToLocalStorage();
            updateChatHistory();
        }
    }
}

function editChatTitle(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const newTitle = prompt('أدخل العنوان الجديد للمحادثة:', chat.title);
    if (newTitle !== null && newTitle.trim() !== '') {
        chat.title = newTitle.trim();
        saveChatToLocalStorage();
        updateChatHistory();
    }
}

function loadChat(chatId) {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    conversationHistory = chat.messages;
    
    updateChatHistory();
    clearChat();
    
    // إعادة عرض رسائل المحادثة المحددة
    chat.messages.forEach(msg => {
        appendMessage(msg.role === 'user' ? 'user' : 'bot', msg.content);
    });
}

function clearChat() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';
}

function saveChatToLocalStorage() {
    localStorage.setItem('chats', JSON.stringify(chats));
}

function toggleSidebar() {
    const sidebar = document.querySelector('.chat-sidebar');
    sidebar.classList.toggle('active');
}

async function sendMessageToAI() {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendButton = document.getElementById('send-message');
    
    if (!userInput.value.trim()) return;

    if (!currentChatId) {
        startNewChat();
    }

    // إضافة رسالة المستخدم إلى المحادثة
    appendMessage('user', userInput.value);
    
    // تعطيل زر الإرسال وحقل الإدخال
    sendButton.disabled = true;
    userInput.disabled = true;
    
    try {
        // إضافة نقاط متحركة لإظهار أن الذكاء الاصطناعي يكتب
        appendMessage('bot', '<div class="typing-indicator">جاري الكتابة<span>.</span><span>.</span><span>.</span></div>', 'typing');
        
        // تحضير سياق المحادثة
        const context = conversationHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }));

        // إعداد الطلب
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    ...context,
                    {
                        role: 'user',
                        parts: [{ text: userInput.value }]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
                safetySettings: [
                    {
                        category: 'HARM_CATEGORY_HARASSMENT',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    },
                    {
                        category: 'HARM_CATEGORY_HATE_SPEECH',
                        threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                    }
                ]
            })
        });

        const data = await response.json();
        
        // إزالة مؤشر الكتابة
        document.querySelector('.typing-indicator')?.parentElement?.remove();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        // إضافة رد الذكاء الاصطناعي
        const aiResponse = data.candidates[0].content.parts[0].text;
        appendMessage('bot', aiResponse);
        
        // تحديث سجل المحادثة
        conversationHistory.push(
            { role: 'user', content: userInput.value },
            { role: 'model', content: aiResponse }
        );

        const currentChat = chats.find(c => c.id === currentChatId);
        if (currentChat) {
            currentChat.messages = conversationHistory;
            // تحديث عنوان المحادثة بناءً على أول رسالة
            if (conversationHistory.length === 2) {
                currentChat.title = conversationHistory[0].content.slice(0, 30) + '...';
                updateChatHistory();
            }
            saveChatToLocalStorage();
        }
        
    } catch (error) {
        console.error('Error:', error);
        document.querySelector('.typing-indicator')?.parentElement?.remove();
        appendMessage('bot', 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.');
    } finally {
        // إعادة تفعيل زر الإرسال وحقل الإدخال
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.value = '';
        userInput.focus();
    }
}

function appendMessage(type, content, className = '') {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} ${className}`;
    messageDiv.innerHTML = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// التعامل مع ضغط Enter للإرسال
document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessageToAI();
    }
});

// تحميل المحادثات عند بدء التطبيق
document.addEventListener('DOMContentLoaded', () => {
    if (chats.length > 0) {
        loadChat(chats[0].id);
    } else {
        startNewChat();
    }
});

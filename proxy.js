const express = require('express');
const app = express();
const crypto = require('crypto');

// مفتاح التشفير السري
const SECRET_KEY = crypto.randomBytes(32).toString('hex');

// تكوين CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://your-domain.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// تشفير المحتوى
function encryptContent(content) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(SECRET_KEY, 'hex'), iv);
    let encrypted = cipher.update(content, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
    };
}

// التحقق من صحة الطلب
function validateRequest(req) {
    const clientToken = req.headers['x-client-token'];
    const timestamp = req.headers['x-timestamp'];
    const expectedToken = crypto
        .createHash('sha256')
        .update(`${timestamp}${SECRET_KEY}`)
        .digest('hex');
    return clientToken === expectedToken;
}

// توجيه طلبات الملفات
app.get('/*', (req, res) => {
    if (!validateRequest(req)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const filePath = req.path;
    try {
        const content = require('fs').readFileSync(__dirname + filePath, 'utf8');
        const encrypted = encryptContent(content);
        res.json(encrypted);
    } catch (err) {
        res.status(404).json({ error: 'File not found' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});

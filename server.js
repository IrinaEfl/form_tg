const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Раздаём статические файлы

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8372456001:AAHuufc1A4f3szneC5TbgFDOs8krbsNHEMk';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1665167511';

// Маршрут для отправки данных в Telegram
app.post('/send-feedback', async (req, res) => {
    try {
        const { name, email, phone, message, category } = req.body;
        
        // Форматируем сообщение для Telegram
        const telegramMessage = `
📨 *НОВОЕ СООБЩЕНИЕ ОБРАТНОЙ СВЯЗИ*

👤 *Имя:* ${name}
📧 *Email:* ${email}
📞 *Телефон:* ${phone || 'Не указан'}
🏷️ *Категория:* ${getCategoryName(category)}

📝 *Сообщение:*
${message}

⏰ *Время отправки:* ${new Date().toLocaleString('ru-RU')}
        `;
        
        // Отправляем сообщение в Telegram
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown',
            disable_notification: false
        });
        
        res.json({ 
            success: true, 
            message: 'Сообщение успешно отправлено в Telegram' 
        });
        
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            error: 'Ошибка при отправке сообщения' 
        });
    }
});

function getCategoryName(category) {
    const categories = {
        'general': 'Общий вопрос',
        'technical': 'Техническая проблема',
        'support': 'Поддержка',
        'suggestion': 'Предложение',
        'other': 'Другое'
    };
    return categories[category] || category;
}

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Откройте в браузере: http://localhost:${PORT}`);
});

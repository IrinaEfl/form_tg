document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Получаем данные формы
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        message: document.getElementById('message').value.trim(),
        category: document.getElementById('category').value
    };
    
    // Валидация
    if (!formData.name || !formData.email || !formData.message) {
        showMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    if (!isValidEmail(formData.email)) {
        showMessage('Введите корректный email адрес', 'error');
        return;
    }
    
    // Показываем загрузку
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Отправляем данные на сервер
        const response = await fetch('/send-feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Сообщение успешно отправлено! Мы ответим вам в ближайшее время.', 'success');
            // Очищаем форму
            document.getElementById('feedbackForm').reset();
        } else {
            showMessage(result.error || 'Произошла ошибка при отправке', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Ошибка соединения с сервером', 'error');
    } finally {
        // Восстанавливаем кнопку
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

function showMessage(text, type) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = text;
    statusEl.className = 'status-message ' + type;
    
    // Автоматически скрываем сообщение через 5 секунд
    setTimeout(() => {
        statusEl.style.opacity = '0';
        setTimeout(() => {
            statusEl.className = 'status-message';
            statusEl.style.opacity = '1';
        }, 300);
    }, 5000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Маска для телефона
document.getElementById('phone').addEventListener('input', function(e) {
    let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + (x[3] ? ') ' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
});
const btnBurger = document.querySelector('.btn_burger_menu');
const mobMenu = document.querySelector('.mobile_menu');
const html = document.documentElement;
const body = document.body;

btnBurger.addEventListener('click', () => {
    btnBurger.classList.toggle('open');
    mobMenu.classList.toggle('open');
    
    html.classList.toggle('no-scrolled');
    body.classList.toggle('no-scrolled');

});


function toggleScroll(enable) {
    if (enable) {
        // Включаем прокрутку - удаляем класс
        html.classList.remove('no-scrolled');
        body.classList.remove('no-scrolled');
    } else {
        // Выключаем прокрутку - добавляем класс
        html.classList.add('no-scrolled');
        body.classList.add('no-scrolled');
    }
}

// Открытие модалки по кнопкам с классом btn_call
const openModalButtons = document.querySelectorAll('.btn_call');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal_close');

openModalButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        modal.classList.add('open');
        btnBurger.classList.remove('open');
    mobMenu.classList.remove('open');
        toggleScroll(false)
    });
});

// Закрытие модалки
modalClose.addEventListener('click', function () {
    modal.classList.remove('open');
    toggleScroll(true)
});

// Закрытие при клике вне модалки
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        modal.classList.remove('open');
        toggleScroll(true)
    }
});

// Маска для телефона
const phoneInputs = document.querySelectorAll('.phone-input');

phoneInputs.forEach(input => {
    input.addEventListener('input', function (e) {
        let x = this.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

        if (x[1] === '7' || x[1] === '8') {
            x[1] = '+7';
        } else if (x[1] === '9' || x[1] === '') {
            x[1] = '+7';
            x[2] = x[1] + x[2];
            x[1] = '';
        }

        this.value = !x[3] ? x[1] + x[2] : x[1] + ' (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
    });

    // Обработка удаления символов (Backspace)
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && this.value.length === 4) {
            this.value = '';
        }
    });
});

// Обработка формы
const modalForm = document.querySelector('.modal_form');

modalForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Здесь можно добавить реальную отправку формы через AJAX
    console.log('Форма отправлена');
    console.log('Имя:', this.modal_name.value);
    console.log('Телефон:', this.modal_tel.value);

    // Закрываем модалку
    modal.classList.remove('open');
    toggleScroll(true)
    showModalSuccess(true)
    // Здесь можно открыть другую модалку с сообщением об успехе
    // Например: successModal.classList.add('open');

    // Очищаем форму
    this.reset();
});


const modalSuccess = document.querySelector('.modal_call__success');
const modalCloseBtn = modalSuccess.querySelector('.modal_close');
const continueBtn = modalSuccess.querySelector('.btn_modal_close');

function showModalSuccess(access) {
    modalSuccess.classList.add('open');
     toggleScroll(false)
    if (access) {
        modalSuccess.classList.remove('success_false');
        modalSuccess.classList.add('success_true');
    } else {
        modalSuccess.classList.add('success_false');
        modalSuccess.classList.remove('success_true');
    }
}

function hideModalSuccess() {
    modalSuccess.classList.remove('open');
     toggleScroll(true)
}

// Обработчик для кнопки "Продолжить"
continueBtn.addEventListener('click', hideModalSuccess);

// Обработчик для кнопки закрытия (крестик)
modalCloseBtn.addEventListener('click', hideModalSuccess);

// Опционально: закрытие при клике вне модального окна
modalSuccess.addEventListener('click', function (e) {
    if (e.target === modalSuccess) {
        hideModalSuccess();
    }
});
// Элементы DOM
const dateInput = document.getElementById('dateInput');
const currentMonthYear = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const daysOfWeek = document.getElementById('daysOfWeek');
const daysGrid = document.getElementById('daysGrid');
const orderBtn = document.querySelector('.order_btn');
const orderResultPrice = document.querySelector('.order__result__price span:last-child');
const orderResultContainer = document.querySelector('.order__result');

// Блоки формы
const orderOptionRoute = document.querySelector('.order__option_route');
const orderOptionTrip = document.querySelector('.order__option_trip');
const orderOptionTicket = document.querySelector('.order__option_ticket');

// Блоки результата
const orderItemRoute = document.querySelector('.order__result_item_location');
const orderItemTime = document.querySelector('.order__result_item_time');
const orderItemPlace = document.querySelector('.order__result_item_place');
const orderRouteResult = document.getElementById('order_route_result');
const orderTimeResult = document.getElementById('order_result_time');

// Настройки календаря
const MAX_YEARS_FROM_NOW = 1;
const MONTHS_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const DAYS_OF_WEEK_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Текущая дата
const today = new Date();
today.setHours(0, 0, 0, 0);
let currentDate = new Date();
currentDate.setHours(0, 0, 0, 0);
let selectedDate = new Date(today);

// Инициализация календаря
function initCalendar() {
    dateInput.value = formatDate(today);
    renderDaysOfWeek();
    updateCalendar();
}

// Форматирование даты
function formatDate(date) {
    return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
}

// Отрисовка дней недели
function renderDaysOfWeek() {
    daysOfWeek.innerHTML = '';
    DAYS_OF_WEEK_RU.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        daysOfWeek.appendChild(dayElement);
    });
}

// Обновление календаря
function updateCalendar() {
    currentMonthYear.textContent = `${MONTHS_RU[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    renderDays();
}

// Отрисовка дней месяца
function renderDays() {
    daysGrid.innerHTML = '';

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;

    // Дни предыдущего месяца
    const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dayElement = document.createElement('div');
        dayElement.className = 'day other-month disabled';
        dayElement.textContent = day;
        daysGrid.appendChild(dayElement);
    }

    // Дни текущего месяца
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = day;

        if (date.getTime() === today.getTime()) {
            dayElement.classList.add('today');
        }

        if (selectedDate && date.getTime() === selectedDate.getTime()) {
            dayElement.classList.add('selected');
        }

        if (date < today) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(date, day));
        }

        daysGrid.appendChild(dayElement);
    }

    // Дни следующего месяца
    const daysToAdd = 42 - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= daysToAdd; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
        const dayElement = document.createElement('div');
        dayElement.className = 'day other-month disabled';
        dayElement.textContent = day;

        const maxDate = new Date(today.getFullYear() + MAX_YEARS_FROM_NOW, today.getMonth(), today.getDate());
        if (date > maxDate) {
            dayElement.style.visibility = 'hidden';
        }

        daysGrid.appendChild(dayElement);
    }

    // Обновление кнопок навигации
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    prevMonthBtn.disabled = currentDate.getTime() <= minDate.getTime();

    const maxDate = new Date(today.getFullYear() + MAX_YEARS_FROM_NOW, today.getMonth(), 1);
    nextMonthBtn.disabled = currentDate.getMonth() === maxDate.getMonth() &&
        currentDate.getFullYear() === maxDate.getFullYear();
}

// Выбор даты
function selectDate(date, day) {
    selectedDate = new Date(date);
    dateInput.value = formatDate(date);
    updateCalendar();

    // Сбрасываем последующие шаги
    resetRouteSelection();
    resetTripSelection();
    resetTicketSelection();

    // Показываем выбор маршрута
    orderOptionRoute.classList.remove('hidden');
    orderItemRoute.classList.add('hidden');
    orderOptionTrip.classList.add('hidden');
    orderOptionTicket.classList.add('hidden');

    checkOrderComplete();
}

// Навигация по месяцам
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

// Обработка выбора маршрута
const routeItems = document.querySelectorAll('.route_item');
routeItems.forEach(route => {
    const input = route.querySelector('input[type="radio"]');
    input.addEventListener('change', () => {
        orderRouteResult.textContent = input.value;
        orderItemRoute.classList.remove('hidden');

        // Показываем выбор рейса
        orderOptionTrip.classList.remove('hidden');
        orderItemTime.classList.add('hidden');
        orderOptionTicket.classList.add('hidden');

        // Сбрасываем последующие шаги
        resetTripSelection();
        resetTicketSelection();

        checkOrderComplete();
    });
});

// Обработка выбора рейса
const tripItems = document.querySelectorAll('.trip_item');
tripItems.forEach(trip => {
    const input = trip.querySelector('input[type="radio"]');
    input.addEventListener('change', () => {
        orderTimeResult.textContent = input.value;
        orderItemTime.classList.remove('hidden');

        // Показываем выбор билетов
        orderOptionTicket.classList.remove('hidden');
        orderItemPlace.classList.add('hidden');

        // Сбрасываем выбор билетов
        resetTicketSelection();

        checkOrderComplete();
    });
});

// Сброс выбора маршрута
function resetRouteSelection() {
    routeItems.forEach(route => {
        route.querySelector('input[type="radio"]').checked = false;
    });
    orderItemRoute.classList.add('hidden');
}

// Сброс выбора рейса
function resetTripSelection() {
    tripItems.forEach(trip => {
        trip.querySelector('input[type="radio"]').checked = false;
    });
    orderItemTime.classList.add('hidden');
}

// Сброс выбора билетов
function resetTicketSelection() {
    // Получаем выбранный тариф
    const selectedTariff = document.querySelector('input[name="tariff"]:checked');
    if (!selectedTariff) return;

    // Ищем контейнер билетов для выбранного тарифа
    const ticketContainer = document.querySelector(`.order_ticket__container[data-tarif="${selectedTariff.value}"]`);
    if (!ticketContainer) return;

    // Сбрасываем счетчики только в активном тарифе
    ticketContainer.querySelectorAll('.order_ticket__counter-count').forEach(countElement => {
        countElement.textContent = '0';
    });

    // Скрываем все билеты в результате
    document.querySelectorAll('.order__result_item_ticket').forEach(item => {
        item.classList.add('hidden');
    });

    updateTotalPrice();
}

// Инициализация счетчиков билетов
function initTicketCounters() {
    document.querySelectorAll('.order_ticket__counter-plus').forEach(plus => {
        plus.addEventListener('click', (e) => {
            const counter = e.target.closest('.order_ticket__counter');
            const countElement = counter.querySelector('.order_ticket__counter-count');
            let count = parseInt(countElement.textContent);

            // Проверяем, является ли это бесплатным детским билетом
            const isFreeChild = counter.closest('.ticket_child_free') !== null;

            if (isFreeChild) {
                // Получаем количество взрослых билетов
                const adultCounter = document.querySelector('.ticket_adult .order_ticket__counter-count');
                const adultCount = adultCounter ? parseInt(adultCounter.textContent) : 0;

                // Максимальное количество бесплатных билетов равно количеству взрослых
                if (count < adultCount) {
                    countElement.textContent = count + 1;
                }
            } else {
                countElement.textContent = count + 1;
            }

            updateTicketsDisplay();
            updateTotalPrice();
            checkOrderComplete();
        });
    });

    document.querySelectorAll('.order_ticket__counter-minus').forEach(minus => {
        minus.addEventListener('click', (e) => {
            const counter = e.target.closest('.order_ticket__counter');
            const countElement = counter.querySelector('.order_ticket__counter-count');
            let count = parseInt(countElement.textContent);

            if (count > 0) {
                countElement.textContent = count - 1;
                updateTicketsDisplay();
                updateTotalPrice();
                checkOrderComplete();
            }
        });
    });
}

// Обновление отображения билетов в результате
function updateTicketsDisplay() {
    const ticketTypes = [
        { selector: '.ticket_adult_res', class: 'ticket_adult' },
        { selector: '.ticket_adult_res_vip', class: 'ticket_adult_vip' },
        { selector: '.ticket_child_free_res', class: 'ticket_child_free' },
        { selector: '.ticket_child_res', class: 'ticket_child' }
    ];

    let totalPlaces = 0;

    ticketTypes.forEach(type => {
        const ticketElement = document.querySelector(type.selector);
        if (!ticketElement) return;

        // Ищем счетчик в активном тарифе
        const selectedTariff = document.querySelector('input[name="tariff"]:checked');
        if (!selectedTariff) return;

        const ticketContainer = document.querySelector(`.order_ticket__container[data-tarif="${selectedTariff.value}"]`);
        if (!ticketContainer) return;

        const counter = ticketContainer.querySelector(`.${type.class} .order_ticket__counter-count`);
        if (!counter) return;

        const count = parseInt(counter.textContent);

        if (count > 0) {
            ticketElement.classList.remove('hidden');
            ticketElement.querySelector('.order__ticket_count').textContent = count;
            totalPlaces += count;
        } else {
            ticketElement.classList.add('hidden');
        }
    });

    // Общее количество мест
    if (totalPlaces > 0) {
        orderItemPlace.classList.remove('hidden');
        orderItemPlace.querySelector('span').textContent = `Мест: ${totalPlaces}`;
    } else {
        orderItemPlace.classList.add('hidden');
    }
}

// Обновление общей цены
function updateTotalPrice() {
    let total = 0;

    // Получаем выбранный тариф
    const selectedTariff = document.querySelector('input[name="tariff"]:checked');
    if (!selectedTariff) return;

    // Ищем контейнер билетов для выбранного тарифа
    const ticketContainer = document.querySelector(`.order_ticket__container[data-tarif="${selectedTariff.value}"]`);
    if (!ticketContainer) return;

    // Пересчитываем только билеты из активного тарифа
    ticketContainer.querySelectorAll('.order_ticket').forEach(ticket => {
        const price = parseInt(ticket.dataset.price) || 0;
        const counter = ticket.querySelector('.order_ticket__counter-count');
        if (!counter) return;

        const count = parseInt(counter.textContent) || 0;
        total += price * count;
    });

    orderResultPrice.textContent = `${total} ₽`;
}

// Проверка завершенности заказа
function checkOrderComplete() {
    const isDateSelected = dateInput.value !== '';
    const isRouteSelected = document.querySelector('input[name="route"]:checked') !== null;
    const isTripSelected = document.querySelector('input[name="trip"]:checked') !== null;

    // Получаем выбранный тариф
    const selectedTariff = document.querySelector('input[name="tariff"]:checked');
    if (!selectedTariff) return;

    // Ищем контейнер билетов для выбранного тарифа
    const ticketContainer = document.querySelector(`.order_ticket__container[data-tarif="${selectedTariff.value}"]`);
    if (!ticketContainer) return;

    // Проверяем наличие хотя бы одного взрослого билета в активном тарифе
    let adultCount = 0;
    if (selectedTariff.value === 'standart') {
        const adultCounter = ticketContainer.querySelector('.ticket_adult .order_ticket__counter-count');
        adultCount = adultCounter ? parseInt(adultCounter.textContent) : 0;
    } else if (selectedTariff.value === 'vip') {
        const adultVipCounter = ticketContainer.querySelector('.ticket_adult_vip .order_ticket__counter-count');
        adultCount = adultVipCounter ? parseInt(adultVipCounter.textContent) : 0;
    }

    // Проверяем, что количество бесплатных детских билетов не превышает количество взрослых (только для стандартного тарифа)
    if (selectedTariff.value === 'standart') {
        const freeChildCounter = ticketContainer.querySelector('.ticket_child_free .order_ticket__counter-count');
        const freeChildCount = freeChildCounter ? parseInt(freeChildCounter.textContent) : 0;

        if (freeChildCount > 0 && adultCount === 0) {
            freeChildCounter.textContent = '0';
            updateTicketsDisplay();
            updateTotalPrice();
        }

        // Проверяем, что нет детских билетов без взрослых
        const childCounter = ticketContainer.querySelector('.ticket_child .order_ticket__counter-count');
        const childCount = childCounter ? parseInt(childCounter.textContent) : 0;

        if (childCount > 0 && adultCount === 0) {
            childCounter.textContent = '0';
            updateTicketsDisplay();
            updateTotalPrice();
        }
    }

    if (isDateSelected && isRouteSelected && isTripSelected && adultCount > 0) {
        orderBtn.classList.remove('disabled');
        orderBtn.addEventListener('click', () => {
            orderBtn.style.display = 'none'
        })
    } else {
        orderBtn.classList.add('disabled');
    }
}
orderBtn.addEventListener('click', () => {
    nextTab();
    orderBtn.style.display = 'none'
})
// Обработка выбора тарифа
const tariffItems = document.querySelectorAll('.tariffs__item input[type="radio"]');
tariffItems.forEach(tariff => {
    tariff.addEventListener('change', () => {
        // Скрываем все контейнеры с билетами
        document.querySelectorAll('.order_ticket__container').forEach(container => {
            container.style.display = 'none';
        });

        // Показываем только выбранный контейнер
        const selectedContainer = document.querySelector(`.order_ticket__container[data-tarif="${tariff.value}"]`);
        if (selectedContainer) {
            selectedContainer.style.display = 'block';

        }

        // Сбрасываем счетчики билетов при смене тарифа
        resetTicketSelection();

        // Обновляем отображение билетов в результате
        updateTicketsDisplay();
        checkOrderComplete();
    });
});
// Инициализация
initCalendar();
initTicketCounters();
checkOrderComplete();

// mobile
const orderMobileTopItems = document.querySelectorAll('.order_mobile_top');

orderMobileTopItems.forEach(item => {
    item.addEventListener('click', () => {
        window.scrollTo({
            top: 50,
            behavior: 'smooth'
        });
        if (item.classList.contains('open')) {
            item.classList.remove('open');
        } else {
            orderMobileTopItems.forEach(item => item.classList.remove('open'));
            item.classList.add('open');

        }

    })
})


// tabs
const orderTabs = document.querySelectorAll('.order_tab');
const orderOptionContents = document.querySelectorAll('.order__options_content');

function closeOrderOptions() {
    orderOptionContents.forEach(content => content.classList.add('hidden'))
}

let indexTab = 0;
function nextTab() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    if (indexTab < orderTabs.length - 1) {
        orderTabs[indexTab].classList.add('open')
        orderTabs[indexTab].classList.remove('active');
        indexTab++;
        orderTabs[indexTab].classList.add('active');
    }
    closeOrderOptions();

    switch (indexTab) {
        case 0:
            orderOptionContents.forEach(content => {
                if (content.classList.contains('order__option_pay')) {
                    content.classList.remove('hidden')
                }
            })

            break;
        case 1:
            orderResultContainer.classList.add('mobile_hidden')
            orderOptionContents.forEach(content => {
                if (content.classList.contains('order__option_delivery')) {
                    content.classList.remove('hidden');
                }
            })
            break;

        case 2:
            orderOptionContents.forEach(content => {
                if (content.classList.contains('order__option_data')) {
                    content.classList.remove('hidden')
                }
            })
            break;
        case 3:
            alert('На отправку оплаты');
            orderOptionContents.forEach(content => {
                if (content.classList.contains('order__option_payment')) {
                    content.classList.remove('hidden')
                }
            })
            break;
        default:
            break;
    }


}

// форма доставки 

const form = document.querySelector('.form_delivery');
const emailInput = form.querySelector('input[name="deliver_email"]');
const phoneInput = form.querySelector('input[name="deliver_phone"]');
const checkbox = form.querySelector('input[name="politicks"]');
const submitButton = form.querySelector('.btn_primary');

// Маска для телефона
IMask(phoneInput, {
    mask: '+{7}(000)000-00-00',
    lazy: false, // маска всегда видна
    placeholderChar: '_' // символ-заполнитель
});

// Валидация email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Валидация телефона
function validatePhone(phone) {
    const re = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
    return re.test(phone);
}

// Проверка всей формы
function validateForm() {
    let isValid = true;

    // Проверка email
    if (!validateEmail(emailInput.value)) {
        emailInput.closest('.label_input').classList.add('error');
        isValid = false;
    } else {
        emailInput.closest('.label_input').classList.remove('error');
    }

    // Проверка телефона
    if (!validatePhone(phoneInput.value)) {
        phoneInput.closest('.label_input').classList.add('error');
        isValid = false;
    } else {
        phoneInput.closest('.label_input').classList.remove('error');
    }

    // Проверка чекбокса
    if (!checkbox.checked) {
        checkbox.closest('.politick_checkbox').classList.add('error');
        isValid = false;
    } else {
        checkbox.closest('.politick_checkbox').classList.remove('error');
    }

    return isValid;
}

// Обработчик отправки формы
form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (validateForm()) {

        nextTab()
    } else {
        // Показать ошибки
        console.log('Форма содержит ошибки');
    }
});

// Валидация при вводе (для интерактивной обратной связи)
emailInput.addEventListener('input', function () {
    if (validateEmail(emailInput.value)) {
        emailInput.closest('.label_input').classList.remove('error');
    }
});

phoneInput.addEventListener('input', function () {
    if (validatePhone(phoneInput.value)) {
        phoneInput.closest('.label_input').classList.remove('error');
    }
});

checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        checkbox.closest('.politick_checkbox').classList.remove('error');
    }
});


// form data
const formTicket = document.querySelector('.form_ticket');

const submitButtons = formTicket.querySelectorAll('.btn_primary, .btn_secondary');
const checkboxTicket = formTicket.querySelector('input[name="politicks"]');

// Функция для инициализации валидации билета
function initTicketValidation(ticketItem) {
    const inputs = {
        surname: ticketItem.querySelector('input[name="surname"]'),
        name: ticketItem.querySelector('input[name="name"]'),
        nameFather: ticketItem.querySelector('input[name="nameFather"]'),
        sex: ticketItem.querySelector('select[name="sex"]'),
        date: ticketItem.querySelector('input[name="date"]'),
        document: ticketItem.querySelector('select[name="document"]'),
        pasport: ticketItem.querySelector('input[name="pasport"]')
    };

    // Переменная для хранения полного номера паспорта
    let fullPasportNumber = '';

    // Маска для даты рождения
    if (inputs.date) {
        IMask(inputs.date, {
            mask: Date,
            pattern: 'd`.`m`.`Y',
            blocks: {
                d: { mask: IMask.MaskedRange, placeholderChar: 'д', from: 1, to: 31, maxLength: 2 },
                m: { mask: IMask.MaskedRange, placeholderChar: 'м', from: 1, to: 12, maxLength: 2 },
                Y: { mask: IMask.MaskedRange, placeholderChar: 'г', from: 1900, to: new Date().getFullYear(), maxLength: 4 }
            },
            format: function (date) {
                let day = date.getDate();
                let month = date.getMonth() + 1;
                const year = date.getFullYear();

                if (day < 10) day = "0" + day;
                if (month < 10) month = "0" + month;

                return [day, month, year].join('.');
            },
            parse: function (str) {
                const [d, m, Y] = str.split('.');
                return new Date(Y, m - 1, d);
            },
            autofix: true,
            overwrite: true
        });
    }

    // Маска для паспорта
    if (inputs.pasport) {
        const pasportMask = IMask(inputs.pasport, {
            mask: '0000 000000',
            placeholderChar: '_'
        });

        inputs.pasport.addEventListener('input', function () {
            fullPasportNumber = pasportMask.unmaskedValue;
        });

        inputs.pasport.addEventListener('blur', function () {
            if (fullPasportNumber.length === 10) {
                const masked = fullPasportNumber.substring(0, 2) + '******' + fullPasportNumber.substring(8);
                pasportMask.value = masked;
            }
        });

        inputs.pasport.addEventListener('focus', function () {
            if (fullPasportNumber.length === 10) {
                pasportMask.value = fullPasportNumber.replace(/(\d{4})(\d{6})/, '$1 $2');
            }
        });
    }

    // Валидация даты рождения
    function validateDate() {
        if (!inputs.date) return true;

        const value = inputs.date.value;
        const re = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/;
        const isValid = re.test(value);

        toggleError(inputs.date.closest('.label_input'), !isValid);
        return isValid;
    }

    // Валидация паспорта
    function validatePasport() {
        if (!inputs.pasport) return true;

        const isValid = fullPasportNumber.length === 10;
        toggleError(inputs.pasport.closest('.label_input'), !isValid);
        return isValid;
    }

    // Валидация ФИО
    function validateName(input) {
        if (!input) return true;

        const re = /^[а-яА-ЯёЁ\-]+$/;
        const isValid = re.test(input.value);
        toggleError(input.closest('.label_input'), !isValid);
        return isValid;
    }

    // Валидация выпадающих списков
    function validateSelect(select) {
        if (!select) return true;

        const isValid = !!select.value;
        toggleError(select.closest('.label_input'), !isValid);
        return isValid;
    }

    // Управление отображением ошибок
    function toggleError(element, show) {
        if (!element) return;

        if (show) {
            element.classList.add('error');
        } else {
            element.classList.remove('error');
        }
    }

    // Проверка всех полей билета
    function validateTicket() {
        const validations = [
            validateName(inputs.surname),
            validateName(inputs.name),
            validateName(inputs.nameFather),
            validateSelect(inputs.sex),
            validateDate(),
            validateSelect(inputs.document),
            validatePasport()
        ];

        return validations.every(valid => valid);
    }

    return validateTicket;
}

// Инициализация валидации для всех билетов
const ticketValidators = [];
formTicket.querySelectorAll('.form_ticket_item').forEach(ticket => {
    ticketValidators.push(initTicketValidation(ticket));
});

// Обработчик отправки формы
function handleSubmit(e) {
    e.preventDefault();

    let allValid = true;

    // Проверяем все билеты
    ticketValidators.forEach(validateTicket => {
        const ticketValid = validateTicket();
        if (!ticketValid) {
            allValid = false;
        }
    });

    // Проверка чекбокса
    if (!checkboxTicket.checked) {
        checkboxTicket.closest('.politick_checkbox').classList.add('error');
        allValid = false;
    } else {
        checkboxTicket.closest('.politick_checkbox').classList.remove('error');
    }

    if (allValid) {
        nextTab()
    } else {
        const firstError = formTicket.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Назначаем обработчики на кнопки
submitButtons.forEach(button => {
    button.addEventListener('click', handleSubmit);
});

// Сброс ошибок при вводе
formTicket.addEventListener('input', function (e) {
    const target = e.target;
    const parent = target.closest('.label_input');
    if (parent) {
        parent.classList.remove('error');
    }
});

// Для чекбокса
if (checkboxTicket) {
    checkboxTicket.addEventListener('change', function () {
        if (checkboxTicket.checked) {
            checkboxTicket.closest('.politick_checkbox').classList.remove('error');
        }
    });
}

// Находим все элементы с классом form_ticket__title
const ticketTitles = document.querySelectorAll('.form_ticket__title');

// Добавляем обработчик клика к каждому элементу
ticketTitles.forEach(title => {
    title.addEventListener('click', function () {

        document.querySelectorAll('.form_ticket__title').forEach(el => {
            el.classList.remove('open');
        });
        this.classList.add('open');

    });
});


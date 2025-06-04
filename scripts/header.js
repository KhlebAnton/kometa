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
document.addEventListener('DOMContentLoaded', function () {
    const faqItems = document.querySelectorAll('.faq_item');

    faqItems.forEach(item => {
        const top = item.querySelector('.faq_item__top');

        top.addEventListener('click', () => {
            // Закрываем все открытые элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });


    const sectionForm = document.querySelector('.form_section');

    sectionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showModalSuccess(true)
    })


    const swiperAlbum = new Swiper('.swiper-container_album', {
        // Настройки Swiper
        slidesPerView: '1', // Автоматическое количество слайдов
        spaceBetween: 10, // Отступ между слайдами
        navigation: {
            nextEl: '.swiper__next',
            prevEl: '.swiper__prev',
        },


        breakpoints: {
            // Настройки для разных размеров экрана
            320: {
                slidesPerView: '1',
                spaceBetween: 16
            },
            760: {
                slidesPerView: '3',
                spaceBetween: 20
            }
        }
    });
    const swiperReview = new Swiper('.swiper-container_reviews', {
        // Настройки Swiper
        slidesPerView: '1', // Автоматическое количество слайдов
        spaceBetween: 10, // Отступ между слайдами
        navigation: {
            nextEl: '.swiper__next_rev',
            prevEl: '.swiper__prev_rev',
        },


        breakpoints: {
            // Настройки для разных размеров экрана
            320: {
                slidesPerView: '1',
                spaceBetween: 16
            },
            760: {
                slidesPerView: '2',
                spaceBetween: 20
            }
        }
    });
});



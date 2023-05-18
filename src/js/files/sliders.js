import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';

// Инициализация слайдеров
function initSliders() {
  if (document.querySelector('.hero__slider')) {
    let splide = new Splide('.hero__slider', {
      type: 'loop',
      perPage: 1,
      pagination: true,
      autoplay: true,
      breakpoints: {
        1200: {
          gap: 10,
        }
      }
    }).mount();
  }
  if (document.querySelector('.events__slider')) {
    let splide = new Splide('.events__slider', {
      type: 'slide',
      perPage: 3,
      perMove: 1,
      pagination: false,
      autoplay: false,
      arrows: false,
      gap: 16,
      mediaQuery: 'min',
      breakpoints: {
        1200: {
          destroy: true,
          gap: 16,
        },
        767: {
          perPage: 3,
        },
        480: {
          perPage: 2,
        },
        100: {
          perPage: 1,
          gap: 17,
        }
      }
    }).mount();
  }
  if (document.querySelector('.records__slider')) {
    let splide = new Splide('.records__slider', {
      type: 'loop',
      perPage: 4,
      perMove: 1,
      pagination: false,
      autoplay: true,
      mediaQuery: 'min',
      breakpoints: {
        1200: {
          perPage: 4,
          gap: 20,
        },
        767: {
          perPage: 3,
        },
        480: {
          perPage: 2,
        },
        100: {
          perPage: 1,
          gap: 16,
        }
      }
    }).mount();
  }
  if (document.querySelector('.news__slider')) {
    let splide = new Splide('.news__slider', {
      type: 'loop',
      perPage: 3,
      perMove: 1,
      pagination: false,
      autoplay: true,
      mediaQuery: 'min',
      breakpoints: {
        992: {
          perPage: 3,
          gap: 21,
        },
        480: {
          perPage: 2,
        },
        100: {
          perPage: 1,
          gap: 16,
        }
      }
    }).mount();
  }
  if (document.querySelector('.reviews__slider')) {
    let splide = new Splide('.reviews__slider', {
      type: 'slide',
      perPage: 3,
      perMove: 1,
      pagination: false,
      autoplay: true,
      mediaQuery: 'min',
      breakpoints: {
        992: {
          perPage: 3,
          gap: 20,
        },
        480: {
          perPage: 2,
        },
        100: {
          perPage: 1,
          gap: 16,
        }
      }
    }).mount();
  }
}
// Скролл на базе слайдера (по классу swiper_scroll для оболочки слайдера)
function initSlidersScroll() {
	let sliderScrollItems = document.querySelectorAll('.swiper_scroll');
	if (sliderScrollItems.length > 0) {
		for (let index = 0; index < sliderScrollItems.length; index++) {
			const sliderScrollItem = sliderScrollItems[index];
			const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
			const sliderScroll = new Swiper(sliderScrollItem, {
				observer: true,
				observeParents: true,
				direction: 'vertical',
				slidesPerView: 'auto',
				freeMode: {
					enabled: true,
				},
				scrollbar: {
					el: sliderScrollBar,
					draggable: true,
					snapOnRelease: false
				},
				mousewheel: {
					releaseOnEdges: true,
				},
			});
			sliderScroll.scrollbar.updateSize();
		}
	}
}

window.addEventListener("load", function (e) {
	// Запуск инициализации слайдеров
	initSliders();
	// Запуск инициализации скролла на базе слайдера (по классу swiper_scroll)
	//initSlidersScroll();
});



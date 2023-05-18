// Подключение функционала "Чертогов Фрилансера"
import { isMobile, FLS } from "./functions.js";
// Подключение списка активных модулей
import { mhzModules } from "./modules.js";

// Подключение из node_modules
import tippy from 'tippy.js';

// Подключение cтилей из src/scss/libs
import "../../scss/libs/tippy.scss";
// Подключение cтилей из node_modules
import 'tippy.js/themes/light.css';
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модулей
mhzModules.tippy = [];

const tippies = tippy('[data-tippy-content]', {
});
mhzModules.tippy.push(...tippies)

const startippyEls = document.querySelectorAll('[data-tippy-stars]');
if (startippyEls.length) {
  startippyEls.forEach(startippyEl=>{
    const text = startippyEl.getAttribute('data-tippy-stars').trim()!=='' ? startippyEl.getAttribute('data-tippy-stars').trim() : 'Количество звезд, которое вы получите за участие в мероприятии';
    const isvalid = startippyEl.hasAttribute('data-position')&&startippyEl.getAttribute('data-position').trim()!=='';
    const placement = isvalid ? startippyEl.getAttribute('data-position').trim() : 'bottom-end'
    const offsetValid = startippyEl.hasAttribute('data-offset')&&startippyEl.getAttribute('data-offset').trim()!==''
    const offset = offsetValid ? startippyEl.getAttribute('data-offset').split(',') : [0, -5];

    const starTippy = tippy(startippyEl, {
      // trigger: 'click',
      interactive: true,
      placement,
      allowHTML: true,
      arrow: false,
      theme: 'light',
      content: `
      <div class="star-tippy">
        <div class="star-tippy__star">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.54077 1.06637C6.71432 0.663388 7.28569 0.663389 7.45923 1.06637L9.04562 4.75014C9.11801 4.91822 9.27644 5.03333 9.45867 5.05024L13.4524 5.42064C13.8892 5.46116 14.0658 6.00457 13.7362 6.29414L10.7229 8.94124C10.5854 9.06202 10.5249 9.24828 10.5652 9.42681L11.447 13.3395C11.5435 13.7675 11.0812 14.1034 10.704 13.8794L7.25528 11.8316C7.09792 11.7381 6.90208 11.7381 6.74472 11.8316L3.29604 13.8793C2.91877 14.1034 2.45652 13.7675 2.55299 13.3395L3.43484 9.42681C3.47507 9.24827 3.41456 9.06202 3.27706 8.94124L0.263817 6.29414C-0.0658138 6.00456 0.11075 5.46116 0.547636 5.42064L4.54133 5.05024C4.72356 5.03333 4.88199 4.91822 4.95438 4.75014L6.54077 1.06637Z" fill="#FFCB79"/>
          </svg>
        </div>
        <div class="star-tippy__text">${text}</div>
      </div>`,
      maxWidth: 240,
      offset: window.innerWidth > 767 ? offset : [0, 10],
    })
    mhzModules.tippy.push(starTippy);
  })
}
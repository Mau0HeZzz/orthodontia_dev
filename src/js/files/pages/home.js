import Splide from '@splidejs/splide';
import '@splidejs/splide/css/core';
// Подключение плагина из node_modules
import SimpleBar from 'simplebar';
// Подключение стилей из node_modules
import 'simplebar/dist/simplebar.css';

document.addEventListener('DOMContentLoaded', function() {
  const eventNames =document.querySelectorAll('.item-events__name');
  setTimeout(() => {
    eventNames.length ? setEventNamesHeight(eventNames) : null;
  }, 200);
  if (eventNames.length) {
    window.addEventListener('resize', (e)=>{
      setEventNamesHeight(eventNames)
    })
  }

  const calendarSlider = document.querySelector('[data-calendar-slider]');
  calendarSlider ? calendarSliderCreate(calendarSlider) : null;
})



document.addEventListener('beforePopupOpen', (e)=>{
  const popup = e.detail.popup;
  console.log(popup)
  const popupEl = popup.targetOpen.element;
  const trigger = popup.previousActiveElement;
  if (popupEl.classList.contains('popupEventRegFull')) {
    if (trigger.classList.contains('item-events__button')) {
      const popupPrice = popupEl.querySelector('[data-price]');
      const popupOldPrice = popupEl.querySelector('[data-oldprice]');
      const popupStars = popupEl.querySelector('[data-stars]');
      
      const triggerValidPrice = popupPrice&&trigger.hasAttribute('data-price')&&trigger.getAttribute('data-price').trim()!=='';
      const triggerValidOldPrice = popupOldPrice&&trigger.hasAttribute('data-oldprice')&&trigger.getAttribute('data-oldprice').trim()!=='';
      const triggerValidStars = popupStars&&trigger.hasAttribute('data-stars')&&trigger.getAttribute('data-stars').trim()!=='';
      
      popupPrice.innerHTML = triggerValidPrice ? `${trigger.getAttribute('data-price').trim()} ${trigger.getAttribute('data-price').trim().toLowerCase()!=='бесплатно' ? '<font class="rub">i</font>' : ''}` : 'Цена по запросу';
      if (triggerValidOldPrice) {
        popupOldPrice.innerHTML = `${trigger.getAttribute('data-oldprice').trim()} <font class="rub">i</font>`
        popupOldPrice.hidden = false;
      } else {
        popupOldPrice.hidden = true;
      }
      if(triggerValidStars&&popupStars.querySelector('span')) {
        popupStars.hidden = false;
        popupStars.querySelector('span').innerHTML = trigger.getAttribute('data-stars').trim();
      } else {
        popupStars.hidden = true;
      }
    }

    const clonedHiddenInputs =popupEl.querySelectorAll('input[data-cloned]');
    clonedHiddenInputs.length ? clonedHiddenInputs.forEach(e=> e.remove()) : null;

    const triggerEvent = trigger.closest('[data-event]');
    const form = popupEl.querySelector('form');
    if (triggerEvent&&form) {
      const hiddenInputs = triggerEvent.querySelectorAll('input[type="hidden"]');
      const inputsContainer = form.querySelector('[data-inputs]');
      if (hiddenInputs.length&&inputsContainer) {
        let str = '';
        hiddenInputs.forEach((hiddenInput, index)=>{
          let type = hiddenInput.getAttribute('data-type');
          let name = hiddenInput.getAttribute('data-name');
          let value = hiddenInput.value;
          let blackText = hiddenInput.getAttribute('data-black-text');
          let stars = hiddenInput.getAttribute('data-stars');
          let greyText = hiddenInput.getAttribute('data-grey-text');
          let disabled = hiddenInput.disabled;
          let checked = hiddenInput.checked;
          if (type === 'hidden') {
            str+=`<input type="hidden" name="${name}" value="${value}">\n`
          }
          if (type === 'radio') {
            if (name&&blackText) {
              str+=`
              <div class="form-popupEventRegFull__row">
                <input type="radio" ${disabled ? 'disabled' : ''} ${checked ? 'checked' : ''} name="${name}" id="form-popupEventRegFull__radio_${index+1}" class="form-popupEventRegFull__radio" value="${value}">
                <label for="form-popupEventRegFull__radio_${index+1}" class="form-popupEventRegFull__label">
                  <span class="form-popupEventRegFull__black">
                    <span>${blackText}</span>
                    ${stars ? `
                    <div class="form-popupEventRegFull__smallstars">
                      <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.71298 0.666482C4.82145 0.414618 5.17855 0.414618 5.28702 0.666482L6.27851 2.96883C6.32375 3.07389 6.42278 3.14583 6.53667 3.1564L9.03273 3.3879C9.30578 3.41322 9.41613 3.75285 9.21011 3.93384L7.32684 5.58827C7.2409 5.66376 7.20308 5.78017 7.22823 5.89176L7.77938 8.33719C7.83967 8.6047 7.55077 8.8146 7.31498 8.67459L5.15955 7.39474C5.0612 7.33634 4.9388 7.33634 4.84045 7.39474L2.68502 8.67459C2.44923 8.8146 2.16033 8.6047 2.22062 8.33719L2.77177 5.89176C2.79692 5.78017 2.7591 5.66376 2.67317 5.58827L0.789886 3.93384C0.583867 3.75285 0.694219 3.41322 0.967273 3.3879L3.46333 3.1564C3.57722 3.14583 3.67625 3.07389 3.72149 2.96883L4.71298 0.666482Z" fill="white"/>
                      </svg>
                      <span>${stars}</span>
                    </div>
                    ` : ''}
                  </span>
                  ${greyText ? `
                  <span class="form-popupEventRegFull__grey">${greyText}</span>
                  ` : ''}
                </label>
              </div>
              \n`
            }
          }
        });
        inputsContainer.innerHTML = str;
      }
    }
  }
})

function setEventNamesHeight(eventNames) {
  let heights = [];
  eventNames.forEach(eventName=>{
    eventName.style = ``;
  })
  setTimeout(() => {
    eventNames.forEach(eventName=>{
      heights.push(eventName.offsetHeight);
    })
    eventNames.forEach(eventName=>{
      eventName.style.minHeight = `${Math.max(...heights) >= 72 ? Math.max(...heights) : 72}px`
    })
  }, 10);
}

async function calendarSliderCreate(calendarSlider) {
  let url = calendarSlider.getAttribute('data-calendar-slider');
  if (url.trim()) {
    fetch(url)
    .then(response => {
      return response.json();
    })
    .then(response => {
      calendarSlider.innerHTML = ``;
      Object.keys(response).forEach((e, index)=>{
        new CalendarMonth(e, response[e], calendarSlider, index);
      })
      let splide = new Splide('.calendar__slider', {
        type: 'slide',
        perPage: 3,
        perMove: 1,
        pagination: false,
        autoplay: false,
        gap: 10,
        breakpoints: {
          1080: {
            perPage: 2
          },
          767: {
            perPage: 1,
            gap: 0
          }
        }
      }).mount();
    })
  }
}

class CalendarMonth {
  date;
  slide;
  events;
  daysCount;
  firstDayIndex;
  monthArr;
  constructor(monthStr, events, calendarSlider, index) {
    let newMonth = monthStr.split('.');
    this.monthArr = monthStr.split('.');
    this.date = new Date(`${newMonth[0]}.01.${newMonth[1]}`);
    this.events = events;
    this.daysCount = this.date.daysInMonth();
    this.firstDayIndex = this.date.getDay() > 0 ? this.date.getDay()-1 : 6;

    this.init(calendarSlider, index)
  }
  init(calendarSlider, index) {
    this.slide = document.createElement('div');
    this.slide.className = 'calendar__slide splide__slide month-calendar';
    this.setMonthHead();
    this.setMonthRows();
    this.setMonthDays();
    calendarSlider.appendChild(this.slide);
  }
  setMonthHead() {
    let localeDate = this.date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long'
    });
    let slideHead = document.createElement('div');
    slideHead.className = 'month-calendar__head';
    slideHead.innerHTML = `<div class="month-calendar__title">${localeDate}</div>`;
    this.slide.appendChild(slideHead);
  }
  setMonthRows() {
    let mnth = this.date.getMonth();
    let year = this.date.getFullYear();
    let l = new Date(year, mnth+1, 0);
    let rowsCount = Math.ceil( (l.getDate()- (l.getDay()>0?l.getDay():7))/7 )+1;
    this.body = document.createElement('div');
    this.body.className = `month-calendar__body`;
    let str = ``;
    for (let index = 1; index <= rowsCount; index++) {
      str+=`
      <div class="month-calendar__row">
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
        <div class="month-calendar__date">
          <div class="month-calendar__number">
          </div>
          <div class="month-calendar__lines">
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
            <div class="month-calendar__line" style="background-color: #fff;"></div>
          </div>
        </div>
      </div>\n`
    }
    this.body.innerHTML = `
    <div class="month-calendar__row month-calendar__row_first">
      <div class="month-calendar__day">пн</div>
      <div class="month-calendar__day">вт</div>
      <div class="month-calendar__day">ср</div>
      <div class="month-calendar__day">чт</div>
      <div class="month-calendar__day">пт</div>
      <div class="month-calendar__day">сб</div>
      <div class="month-calendar__day">вс</div>
    </div>
    ${str}`;
    this.slide.appendChild(this.body)
  }
  setMonthDays() {
    const days = this.slide.querySelectorAll('.month-calendar__date');
    let dayNumber = 1;
    for (let index = this.firstDayIndex; index < this.daysCount+this.firstDayIndex; index++) {
      const element = days[index];
      let dateStr = `${this.monthArr[0]}.${dayNumber < 10 ? `0${dayNumber}` : dayNumber}.${this.monthArr[1]}`;
      if (element) {
        element.setAttribute('data-date', dateStr);
        const numberEl = element.querySelector('.month-calendar__number');
        this.setToday(dateStr, element);
        numberEl.innerHTML = `<span>${dayNumber}</span>`;
        this.setLines(element, dayNumber);
        let tooltip = this.setTooltip(element, dayNumber, dateStr);
        if (tooltip) {
          document.body.appendChild(tooltip);
          const tooltipBody = tooltip.querySelector('.tooltip-calendar__body');
          new SimpleBar(tooltipBody, {
            autoHide: false
          }) 
        }
        dayNumber++
        this.setElClickHandler(element, tooltip);
      }
    }
  }
  setToday(dateStr, element) {
    if (new Date(dateStr).toLocaleDateString() === new Date().toLocaleDateString()) {
      element.classList.add('_today');
    }
  }
  setLines(element, dayNumber) {
    this.events.forEach(event=>{
      if (parseFloat(event.date) === dayNumber) {
        const lines = element.querySelectorAll('.month-calendar__line');
        event.events.length ? event.events.forEach((event, index)=>{
          if (index < 4) {
            lines[index].style.backgroundColor = event.color ? event.color : '#fff';
          }
        }) : null;
      }
    })
  }
  setTooltip(element, dayNumber, dateStr) {
    let fullLocaleDate = new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    let tooltip = document.createElement('div');
    tooltip.className = `month-calendar__tooltip tooltip-calendar`;
    tooltip.setAttribute('data-tooltip-date', dateStr);
    let tooltipCreate = false;
    this.events.forEach(event => {
      if (parseFloat(event.date) === dayNumber&&event.events.length) {
        tooltipCreate = true;
        // console.log(element, element.getBoundingClientRect())
        let str = ``;
        event.events.forEach(event=>{
          event.name ? str+=`
          <div class="tooltip-calendar__item item-tooltip">
            <div class="item-tooltip__head">
              ${event.section ? `<div class="item-tooltip__category" style="background-color: ${event.color ? `${event.color}` : '#6DBEF4'}">${event.section}</div>` : ''}
              ${event.level ? `<div class="item-tooltip__level">${event.level}</div>` : ''}
            </div>
            ${event.name ? `<div class="item-tooltip__name">${event.name}</div>` : ''}
            ${event.link ? `<a href="${event.link}" class="item-tooltip__more btn btn-border">Подробнее</a>` : ''}
          </div>\n
          ` : null;
        });
        tooltip.innerHTML = `
        <div class="tooltip-calendar__backdrop">
          <div class="tooltip-calendar__content">
            <div class="tooltip-calendar__head">
              <div class="tooltip-calendar__title">${fullLocaleDate}</div>
            </div>
            <div class="tooltip-calendar__body">
            ${str}
            </div>
            <div class="tooltip-calendar__footer"><button type="button" class="tooltip-calendar__button btn btn-lightblue">Закрыть</button></div>
          </div>
        </div>
        `;
      }
    });
    if (tooltipCreate) {
      return tooltip
    }
  }
  setElClickHandler(element, tooltip) {
    document.addEventListener('click', (e)=>{
      if ((e.target === element)) {
        element.classList.add('_active');
        const tooltips =document.querySelectorAll('.tooltip-calendar');
        tooltips.length ? tooltips.forEach(othertooltip=>{
          othertooltip.classList.remove('_active');
          othertooltip.classList.remove('_nocenter');
          othertooltip.style = '';
        }) : null;
        if (tooltip) {
          tooltip.classList.add('_active');
          this.setTooltipPosition(tooltip, element);
          setTimeout(() => {
            window.innerWidth <= 992 ? document.documentElement.classList.add('lock') : null;
            tooltip.querySelector('.tooltip-calendar__content').offsetHeight >= window.innerHeight ? tooltip.classList.add('_nocenter') : null;
          }, 2);
        }
      } else if (!e.target.closest('.tooltip-calendar__content')) {
        element.classList.remove('_active');
        window.innerWidth <= 992 ? document.documentElement.classList.remove('lock') : null;
        if (tooltip) {
          tooltip.classList.remove('_active');
          tooltip.classList.remove('_nocenter');
          tooltip.style = '';
          const tooltipBody = tooltip.querySelector('.tooltip-calendar__body')
          tooltipBody.style = '';
        }
      }
      if ((e.target.closest('.tooltip-calendar__button')||e.target.classList.contains('tooltip-calendar__backdrop'))&&tooltip) {
        tooltip.classList.remove('_active');
        tooltip.classList.remove('_nocenter');
        tooltip.style = '';
        window.innerWidth <= 992 ? document.documentElement.classList.remove('lock') : null;
        const tooltipBody = tooltip.querySelector('.tooltip-calendar__body');
        tooltipBody.style = '';
      }
    });
    window.addEventListener('scroll', ()=>{
      const tooltips =document.querySelectorAll('.tooltip-calendar');
      tooltips.length ? tooltips.forEach(tooltip=>{
        tooltip.classList.remove('_active');
        tooltip.style = '';
        const tooltipBody = tooltip.querySelector('.tooltip-calendar__body');
        tooltipBody.style = '';
      }) : null;
    })
  }
  setTooltipPosition(tooltip, element) {
    let pos = element.getBoundingClientRect();
    let btm = window.innerHeight - pos.top;
    let left = 0;
    if (window.innerWidth - pos.right < 390) {
      left = pos.right - pos.width - 375;
    } else {
      left = pos.left+pos.width
    }
    tooltip.style = `--tp: ${pos.top}px; --lft: ${left}px`;
        const tooltipBody = tooltip.querySelector('.tooltip-calendar__body');
    if (window.innerWidth > 992&&btm>205&&tooltip.offsetHeight>btm) {
      tooltipBody.style.maxHeight = btm-68+'px';
    }
  }
}

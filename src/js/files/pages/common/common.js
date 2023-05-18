import { mhzModules } from "../../modules.js";



Date.prototype.daysInMonth = function() {
  return 33 - new Date(this.getFullYear(), this.getMonth(), 33).getDate();
};

let md1 = window.matchMedia("(max-width: 1200px)")
document.addEventListener('DOMContentLoaded', function(e) {
  setPagePaddingTop();
  window.addEventListener('resize', setPagePaddingTop);
  
  const popupContents = document.querySelectorAll('.popup');
  popupContents.length ? popupContentsActions(popupContents) : null;
});


function setPagePaddingTop() {
  const header = document.querySelector('.header');
  const page = document.querySelector('.page');
  const headerMobile = document.querySelector('.header__mobile');
  if (header&&page) {
    let height = header.offsetHeight;
    let mobileHeight = headerMobile.offsetHeight
    page.style.paddingTop = md1.matches ? `${mobileHeight}px` : `${height < 138 ? 138 : height}px`;
  }
}

function popupContentsActions(popupContents) {
  popupContents.forEach(popupContent => {
    const popupContentCloseSpan = popupContent.querySelector('[data-drag-close]');
    if (popupContentCloseSpan) {
      let touchStartPoint = null;
      popupContentCloseSpan.addEventListener('touchstart', e => touchStartPoint = e.touches[0].clientY);
      popupContentCloseSpan.addEventListener('touchmove', e => {
        if (!touchStartPoint) return;
        let touchPoint = e.touches[0].clientY - touchStartPoint;
        popupContent.style.transition = `none`;
        popupContent.style.transform = `translateY(${touchPoint}px)`;
        if (touchPoint > 100) {
          mhzModules.popup.close(popupContent);
        }
      });
      popupContentCloseSpan.addEventListener('touchend', (e) => { 
        touchStartPoint = null;
        popupContent.style = '';
      });
    }
  });
}
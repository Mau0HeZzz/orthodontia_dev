import { mhzModules } from "../../modules.js";
import { formValidate } from "../../forms/forms.js";
// Подключение плагина из node_modules
import SimpleBar from 'simplebar';
// Подключение стилей из node_modules
import 'simplebar/dist/simplebar.css';

document.addEventListener('DOMContentLoaded', function() {
  const citychange = document.querySelector('[data-citychange]');
  citychange ? cityChangeActions(citychange) : null;

  const searchBox = document.querySelector('[data-search]');
  searchBox ? searchActions(searchBox) : null;

  const sideMenu = document.querySelector('.sidemenu');
  sideMenu ? sideMenuActions(sideMenu) : null;
})

document.addEventListener('formSent', (e)=>{
  const form = e.detail.form;
  const {success} = e.detail.responseResult;
  if (form.closest('#authPopup')&&success) {
    const phoneInput = form.querySelector('[data-phone]');
    const phoneOutput = document.querySelector('#pinPopup .authPopup__subtitle span');
    phoneOutput.innerHTML = phoneInput.value;
    mhzModules.popup.open('#pinPopup');
    const authPopupLinks =document.querySelectorAll('[data-popup="#authPopup"]');
    if (authPopupLinks) {
      authPopupLinks.forEach(authPopupLink=>{
        if (!authPopupLink.closest('#pinPopup')) {
          authPopupLink.setAttribute('data-popup', '#pinPopup');
          setTimeout(() => {
            authPopupLink.setAttribute('data-popup', '#authPopup');
          }, 6000);
        }
      })
    }
    const pinCodeTimer = document.querySelector('#pinPopup [data-timer]');
    pinCodeTimer ? setPinCodeTimer(pinCodeTimer.dataset.timer, pinCodeTimer) : null;

    const newCodeButton = document.querySelector('[data-newcode] button');
    newCodeButton ? 
    newCodeButton.addEventListener('click', (e)=>{
      pinCodeTimer ? setPinCodeTimer(pinCodeTimer.dataset.timer, pinCodeTimer) : null;
    })
    : null;
  }
})

document.addEventListener('beforePopupClose', (e)=>{
  const form = e.detail.popup.targetOpen.element.querySelector('form');
  if (form) {
    formValidate.formClean(form);
  }
})

const middleSubMenuParents =document.querySelectorAll('[data-middlesubmenu-parent]');
const middleSubMenuChildrens =document.querySelectorAll('[data-middlesubmenu-children]');
if (middleSubMenuParents.length&&middleSubMenuChildrens.length) {
  subMenuActions(middleSubMenuParents, middleSubMenuChildrens);
}

function cityChangeActions(citychange) {
  const citylinks = citychange.querySelectorAll('[data-number]');
  const cityoutput = citychange.querySelector('[data-output]');
  const spollerTrigger = citychange.querySelector('[data-spoller]');
  citylinks.forEach(citylink=>{
    citylink.addEventListener('click', (e)=>{
      e.preventDefault();
      let number = citylink.getAttribute('data-number');
      let numberRedacted = number.replaceAll('(','').replaceAll(')','').replaceAll('-','').replaceAll(' ','');
      let city = citylink.textContent;
      spollerTrigger.querySelector('span') 
        ? spollerTrigger.querySelector('span').innerHTML = city 
        : spollerTrigger.innerHTML = city;

      cityoutput.innerHTML = number;
      cityoutput.setAttribute('href', `tel:${numberRedacted}`)
      spollerTrigger.click();
      citylinks.forEach(citylink=>{citylink.hidden = false});
      citylink.hidden = true;
    })
  })
}

function searchActions(searchBox) {
  const searchInput = searchBox.querySelector('[data-search-input]');
  const searchClear = searchBox.querySelector('[data-search-clean]');
  if (searchInput) {
    searchInput.addEventListener('focusin', (e)=>{
      const middleHeaderMenu = document.querySelector('.middle-header__menu');
      const middleHeaderSocials = document.querySelector('.middle-header__socials');
      let width = searchBox.offsetWidth;
      middleHeaderMenu ? width += middleHeaderMenu.offsetWidth+20 : null;
      middleHeaderSocials ? width += middleHeaderSocials.offsetWidth+20 : null;
      searchBox.style.setProperty('--srchwdth', `${width}px`);
      searchBox.classList.add('_active');
    });
    searchInput.addEventListener('focusout', (e)=>{
      searchBox.classList.remove('_active');
    });

    searchClear.addEventListener('click', (e)=>{
      e.preventDefault();
      searchInput.value = '';
      searchInput.classList.remove('_form-input');
      searchInput.parentElement.classList.remove('_form-input');
    })
  }
}

function setPinCodeTimer(seconds, pinCodeTimer) {
  const newCode = pinCodeTimer.closest('form').querySelector('[data-newcode]');
  pinCodeTimer.parentElement.hidden = false;
  newCode.hidden = true;
  let minutes = Math.floor(seconds/60);
  let seconds_new = seconds - 60*minutes;
  let timeString = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds_new<10?`0${seconds_new}`:seconds_new}`
  pinCodeTimer.innerHTML = timeString;
  
  let interval = setInterval(() => {
    let minutes = Math.floor(seconds/60);
    let seconds_new = seconds - 60*minutes;
    let timeString = `${minutes < 10 ? `0${minutes}` : minutes}:${seconds_new<10?`0${seconds_new}`:seconds_new}`
    pinCodeTimer.innerHTML = timeString;
    if (seconds>0) {
      --seconds;
    } else {
      clearInterval(interval);
      newCode.hidden = false;
      pinCodeTimer.parentElement.hidden = true;
    }
  }, 1000);

  document.addEventListener('beforePopupClose', (e) =>{
    if (e.detail.popup.targetOpen.element.contains(pinCodeTimer)) {
      typeof interval !== 'undefined' ? clearInterval(interval) : null;
    }
  })
}

function subMenuActions(middleSubMenuParents, middleSubMenuChildrens) {
  middleSubMenuParents.forEach(middleSubMenuParent=>{
    let name = middleSubMenuParent.getAttribute('data-middlesubmenu-parent')
    const children = document.querySelector(`[data-middlesubmenu-children="${name}"]`);
    middleSubMenuParent.addEventListener('mouseenter', (e)=>{
      children ? children.classList.add('_active') : null;
      middleSubMenuParent.classList.add('_active');
    })
    middleSubMenuParent.addEventListener('mouseleave', (e)=>{
      if (children) {
        children.classList.remove('_active');
      }
      middleSubMenuParent.classList.remove('_active');
    })
  })
  middleSubMenuChildrens.forEach(middleSubMenuChildren=>{
    let name = middleSubMenuChildren.getAttribute('data-middlesubmenu-children')
    const children = document.querySelector(`[data-middlesubmenu-parent="${name}"]`);
    middleSubMenuChildren.addEventListener('mouseenter', (e)=>{
      if (children) {
        children.closest('[data-middlesubmenu-children]') ? children.closest('[data-middlesubmenu-children]').classList.add('_active') :  children.classList.add('_active')
      }
      middleSubMenuChildren.classList.add('_active');
    })
    middleSubMenuChildren.addEventListener('mouseleave', (e)=>{
      if (children) {
        children.closest('[data-middlesubmenu-children]') ? children.closest('[data-middlesubmenu-children]').classList.remove('_active') :  children.classList.remove('_active')
      }
      middleSubMenuChildren.classList.remove('_active');
    })
  })
}

function sideMenuActions(sideMenu) {
  const submenuTriggers = sideMenu.querySelectorAll('[data-submenu-trigger]');
  const back = sideMenu.querySelector('.sidemenu__back');
  const mainList = sideMenu.querySelector('.sidemenu__list_main');
  let lastOpened = null;
  let lastStyled = null;
  if (submenuTriggers) {
    submenuTriggers.forEach(submenuTrigger=>{
      submenuTrigger.addEventListener('click', (e)=>{
        const subMenuBody = submenuTrigger.parentElement.querySelector('[data-submenu-body]');
        if (subMenuBody) {
          e.preventDefault();
          subMenuBody.classList.add('_active');
          lastOpened = subMenuBody;
          mainList.style = `height:${subMenuBody.offsetHeight}px; overflow:hidden;`;
          lastStyled = mainList;
          if (submenuTrigger.closest('[data-submenu-body]')) {
            submenuTrigger.closest('[data-submenu-body]').style = `height:${subMenuBody.offsetHeight}px;overflow:hidden;`;
            lastStyled = submenuTrigger.closest('[data-submenu-body]');
          }
          back.hidden = false;
        }
      })
    });
    document.addEventListener('toggleMenu', (e)=>{
      const activeSubMenus =document.querySelectorAll('[data-submenu-body]');
      back.hidden = true;
      activeSubMenus.length ? activeSubMenus.forEach(activeSubMenu=>{
        activeSubMenu.classList.remove('_active');
        activeSubMenu.style = '';
        mainList.style = '';
      }) : null;
    });
    back.addEventListener('click', (e)=>{
      if (lastOpened) {
        lastOpened.classList.remove('_active');
        lastOpened = lastOpened.closest('[data-submenu-body]._active');
        if (lastOpened === null) {
          back.hidden = true;
        }
      } else {
        const activeBodies =document.querySelectorAll('[data-submenu-body]._active');
        activeBodies[activeBodies.length-1].classList.remove('_active');
        back.hidden = true;
      }
      if (lastStyled&&lastStyled!==mainList) {
        lastStyled.style='';
        mainList.style = `height:${lastStyled.offsetHeight}px; overflow:hidden;`;
        lastStyled = lastStyled.closest('[data-submenu-body]._active');
        if (lastStyled === null) {
          mainList.style = '';
        }
      } else {
        mainList.style = '';
      }
    })
  }
}
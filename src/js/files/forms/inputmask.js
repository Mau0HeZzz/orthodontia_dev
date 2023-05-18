/* Маски для полей (в работе) */

// Подключение функционала "Чертогов Фрилансера"
// Подключение списка активных модулей
import { mhzModules } from "../modules.js";

// Подключение модуля
import "inputmask/dist/inputmask.min.js";

export function inputmaslFirstInit() {
	const inputMasks = document.querySelectorAll('[data-inputmask]');
	if (inputMasks.length) {
		mhzModules.inputmask = Inputmask({
      showMaskOnHover: false,
    }).mask(inputMasks);
	}

  const pincodeInputs = document.querySelectorAll('[data-pincode]');
  pincodeInputs.length ? pincodeInputs.forEach(pincodeInput=>{
    let callback = pincodeInput.getAttribute('data-callback');
    new Inputmask({
      mask: '999999',
      inputmode: 'numeric',
      oncomplete: function() {
        const form = this.closest('form');
        if (form&&this.hasAttribute('data-oncomplete-formsent')) {
          form.submit();
        }
        if (callback&&callback.trim !== '') {
          eval(callback)
        }
      }
    }).mask(pincodeInput);
  }) : null;
}
inputmaslFirstInit();

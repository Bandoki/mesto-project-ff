export { enableValidation, clearValidation };

function showInputError(input, config) {
  const errorElement = document.getElementById(`${input.id}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = input.validationMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(input, config) {
  const errorElement = document.getElementById(`${input.id}-error`);
  input.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function setCustomValidation(input) {
  input.setCustomValidity(''); 

  const value = input.value.trim();

  if (input.type === 'url') {
    try {
      new URL(value); 
    } catch {
      input.setCustomValidity('Введите корректный URL');
    }
  }

  if (input.name === 'name' || input.name === 'about' || input.name === 'place-name') {
    const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s\-]+$/;

    if (!nameRegex.test(value)) {
      input.setCustomValidity('Разрешены только буквы, пробел и дефис');
    } else {
      const min = input.getAttribute('minlength');
      const max = input.getAttribute('maxlength');
      if (min && value.length < min) {
        input.setCustomValidity(`Минимум ${min} символа`);
      }
      if (max && value.length > max) {
        input.setCustomValidity(`Максимум ${max} символов`);
      }
    }
  }
}

function checkInputValidity(input, config) {
  setCustomValidation(input); 

  if (!input.validity.valid) {
    showInputError(input, config);
  } else {
    hideInputError(input, config);
  }
}

function toggleButtonState(inputs, button, config) {
  const hasInvalid = inputs.some((input) => {
    setCustomValidation(input);
    return !input.validity.valid;
  });

  if (hasInvalid) {
    disableButton(button, config);
  } else {
    enableButton(button, config);
  }
}

function disableButton(button, config) {
  button.classList.add(config.inactiveButtonClass);
  button.disabled = true;
}

function enableButton(button, config) {
  button.classList.remove(config.inactiveButtonClass);
  button.disabled = false;
}

function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        checkInputValidity(input, config);
        toggleButtonState(inputs, button, config);
      });
    });

    toggleButtonState(inputs, button, config);
  });
}

function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const button = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    input.setCustomValidity('');
    hideInputError(input, config);
  });

  disableButton(button, config);
}

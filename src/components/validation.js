export { enableValidation, clearValidation };

// Проверка на допустимые символы
function validateNameOrPlace(value) {
  const regex = /^[a-zA-Zа-яА-ЯёЁ\- ]+$/;
  return regex.test(value);
}

// Проверка на корректный URL
function validateURL(value) {
  const regex = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
  return regex.test(value);
}

// Включение валидации всех форм
function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach((form) => {
    form.addEventListener('submit', (evt) => evt.preventDefault());

    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const submitButton = form.querySelector(config.submitButtonSelector);

    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        checkInputValidity(input, form, config);
        toggleButtonState(inputs, submitButton, config);
      });
    });

    
    toggleButtonState(inputs, submitButton, config);
  });
}

// Проверка валидности конкретного поля
function checkInputValidity(input, form, config) {
  const errorElement = form.querySelector(`#${input.name}-error`);

  if (!input.validity.valid) {
    showError(input, input.validationMessage, form, config);
    return;
  }

  const value = input.value.trim();

  // Кастомные проверки
  if ((input.name === 'name' || input.name === 'place-name' || input.name === 'about')) {
    if (!validateNameOrPlace(value)) {
      showError(input, input.dataset.error, form, config);
    } else if (
      (input.name === 'name' && (value.length < 2 || value.length > 40)) ||
      (input.name === 'about' && (value.length < 2 || value.length > 200)) ||
      (input.name === 'place-name' && (value.length < 2 || value.length > 30))
    ) {
      showError(input, `Должно быть от ${input.name === 'about' ? '2 до 200' : input.name === 'place-name' ? '2 до 30' : '2 до 40'} символов`, form, config);
    } else {
      hideError(input, errorElement, config);
    }
  } else if (input.name === 'link' && input.type === 'url') {
    if (!validateURL(value)) {
      showError(input, 'Введите корректный URL', form, config);
    } else {
      hideError(input, errorElement, config);
    }
  } else {
    hideError(input, errorElement, config);
  }
}

// сообщение об ошибке
function showError(input, errorMessage, form, config) {
  const errorElement = form.querySelector(`#${input.name}-error`);
  input.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

// Скрывает сообщение об ошибке
function hideError(input, errorElement, config) {
  input.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

// Включает/отключает кнопку
function toggleButtonState(inputs, submitButton, config) {
  const isValid = inputs.every((input) => {
    const value = input.value.trim();
    if (!input.validity.valid) return false;

    if ((input.name === 'name' || input.name === 'place-name' || input.name === 'about') && !validateNameOrPlace(value)) {
      return false;
    }

    if (input.name === 'link' && input.type === 'url' && !validateURL(value)) {
      return false;
    }

    if (input.name === 'name' && (value.length < 2 || value.length > 40)) return false;
    if (input.name === 'about' && (value.length < 2 || value.length > 200)) return false;
    if (input.name === 'place-name' && (value.length < 2 || value.length > 30)) return false;

    return true;
  });

  if (isValid) {
    submitButton.classList.remove(config.inactiveButtonClass);
    submitButton.disabled = false;
  } else {
    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.disabled = true;
  }
}

// Очистка ошибок и деактивация кнопки
function clearValidation(form, config) {
  const inputs = Array.from(form.querySelectorAll(config.inputSelector));
  const submitButton = form.querySelector(config.submitButtonSelector);

  inputs.forEach((input) => {
    const errorElement = form.querySelector(`#${input.name}-error`);
    hideError(input, errorElement, config);
  });

  submitButton.classList.add(config.inactiveButtonClass);
  submitButton.disabled = true;
}

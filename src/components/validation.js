export { enableValidation, clearValidation };

function showInputError(inputElement, config) {
  const errorElement = inputElement
    .closest('form')
    .querySelector(`#${inputElement.id}-error`);

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(inputElement, config) {
  const errorElement = inputElement
    .closest('form')
    .querySelector(`#${inputElement.id}-error`);

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = '';
  errorElement.classList.remove(config.errorClass);
}

function setCustomValidation(inputElement) {
  // Сбрасываем старую ошибку
  inputElement.setCustomValidity('');

  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorPattern || 'Неверный формат');
  } else if (inputElement.validity.typeMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorType || 'Неверный тип данных');
  } else if (inputElement.validity.tooShort || inputElement.validity.tooLong) {
    inputElement.setCustomValidity(inputElement.dataset.errorLength || 'Некорректная длина');
  } else if (inputElement.validity.valueMissing) {
    inputElement.setCustomValidity(inputElement.dataset.errorRequired || 'Заполните это поле');
  } else if (inputElement.validity.badInput) {
    inputElement.setCustomValidity(inputElement.dataset.errorBadInput || 'Некорректное значение');
  } else {
    // Если ошибок нет — сбрасываем
    inputElement.setCustomValidity('');
  }
}

function checkInputValidity(inputElement, config) {
  setCustomValidation(inputElement);

  if (!inputElement.validity.valid) {
    showInputError(inputElement, config);
  } else {
    hideInputError(inputElement, config);
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);

    formElement.addEventListener('submit', (evt) => evt.preventDefault());

    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
        checkInputValidity(inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });

    toggleButtonState(inputList, buttonElement, config);
  });
}

function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity('');
    hideInputError(inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}

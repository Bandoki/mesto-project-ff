export { openModal, closeModal, handleEscClose, handleOverlayClick }

// Функция для открытия попапа
function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', handleEscClose);
    modal.addEventListener('click', handleOverlayClick);
  }
  

// Функция для закрытия попапа
function closeModal(modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', handleEscClose);
    modal.removeEventListener('click', handleOverlayClick);
  }



  // Закрытие по нажатию Escape
  function handleEscClose(evt) {
    if (evt.key === 'Escape') {
      const openedPopup = document.querySelector('.popup_is-opened');
      if (openedPopup) closeModal(openedPopup);
    }
  }
  
  // Закрытие по клику на оверлей
  function handleOverlayClick(evt) {
    if (evt.target.classList.contains('popup')) {
      closeModal(evt.target);
    }
  }
export { openModal, closeModal, openImagePopUp, handleImageClick, openProfileModal }

// Функция для открытия попапа
function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

// Функция для закрытия попапа
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

// Функция для открытия попапа с изображением
function openImagePopUp(imageSrc, caption) {
    const popupImage = document.querySelector('.popup__image');
    const popupCaption = document.querySelector('.popup__caption');
    const imagePopUp = document.querySelector('.popup_type_image');
    
    popupImage.src = imageSrc;  
    popupCaption.textContent = caption;  
    imagePopUp.classList.add('popup_is-opened');
}

function openProfileModal(modal, nameInput, jobInput, profileTitle, profileDesc) {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDesc.textContent;
    openModal(modal);
}

// Функция для обработки клика по изображению
function handleImageClick(imageSrc, caption) {
    openImagePopUp(imageSrc, caption);
}
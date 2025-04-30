import { initialCards } from "./components/cards";
import './styles/index.css';
import { createCard, deleteCard, handleLike } from "./components/card";
import { openModal, closeModal, openImagePopUp, handleImageClick, openProfileModal } from "./components/modal";

// Глобальные переменные для работы с попапами
const profileEditButton = document.getElementById('profilePopUp');
const profilePopUp = document.querySelector('.popup_type_edit');
const popupCloseButton = document.querySelector('.popup__close');
const addCardButton = document.getElementById('addCard');
const newCardPopUp = document.querySelector('.popup_type_new-card');
const imagePopUp = document.querySelector('.popup_type_image');

// Открытие попапа
profileEditButton.addEventListener('click', () => openModal(profilePopUp));
addCardButton.addEventListener('click', () => openModal(newCardPopUp));

// Закрытие попапа
popupCloseButton.addEventListener('click', () => closeModal(profilePopUp));
const newCardCloseButton = newCardPopUp.querySelector('.popup__close');
newCardCloseButton.addEventListener('click', () => closeModal(newCardPopUp));
const imageCloseButton = document.querySelector('.popup_type_image .popup__close');
imageCloseButton.addEventListener('click', () => closeModal(imagePopUp));

// Обработчики для закрытия попапов при клике вне их или при нажатии Esc
window.addEventListener('click', function(event) {
    if (event.target === profilePopUp || event.target === newCardPopUp || event.target === imagePopUp) {
        closeModal(event.target);
    }
});

window.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal(profilePopUp);
        closeModal(newCardPopUp);
        closeModal(imagePopUp);
    }
});

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

profileEditButton.addEventListener('click', () => {
    openProfileModal(profilePopUp, nameInput, jobInput, profileName, profileDescription);
});

// Плавное открытие попапа
(function () {
    profilePopUp.classList.add('popup_is-animated');
    newCardPopUp.classList.add('popup_is-animated');
    imagePopUp.classList.add('popup_is-animated');
})();

// Обработка редактирования профиля
const formElement = document.querySelector('.popup__form');
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');

formElement.addEventListener('submit', function(evt) {
    evt.preventDefault(); 

    const nameValue = nameInput.value;
    const jobValue = jobInput.value;
    const profileName = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');
    
    profileName.textContent = nameValue;
    profileDescription.textContent = jobValue;

    closeModal(profilePopUp);

    formElement.reset();
});

// Добавление новой карточки
const cardFormElement = document.querySelector('.popup_type_new-card .popup__form');
const cardNameInput = cardFormElement.querySelector('.popup__input_type_card-name');
const linkInput = cardFormElement.querySelector('.popup__input_type_url');

cardFormElement.addEventListener('submit', function(evt) {
    evt.preventDefault();

    const cardNameValue = cardNameInput.value;
    const cardLinkValue = linkInput.value;

    if (!cardNameValue || !cardLinkValue) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    const newCard = createCard(
        { name: cardNameValue, link: cardLinkValue },
        deleteCard,
        handleLike,
        handleImageClick
    );
    
    const placesList = document.querySelector('.places__list');
    placesList.prepend(newCard);

    closeModal(newCardPopUp);

    cardFormElement.reset();
});

// Выводим начальные карточки на страницу
initialCards.forEach(cardData => {
    const cardElement = createCard(cardData, deleteCard, handleLike, handleImageClick);
    const placesList = document.querySelector('.places__list');
    placesList.append(cardElement); 
});
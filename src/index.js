import './styles/index.css';
import { openModal, closeModal } from './components/modal';
import { enableValidation, clearValidation } from './components/validation';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteThisCard, putLike, deleteLike, updateAvatar } from './components/api';
import { createCard } from './components/card';

// DOM-элементы
const profileEditButton = document.getElementById('profileEditButton');
const profilePopUp = document.querySelector('.popup_type_edit');
const addCardButton = document.getElementById('addCard');
const newCardPopUp = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');

const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const profileForm = profilePopUp.querySelector('.popup__form');
const nameInput = profileForm.querySelector('.popup__input_type_name');
const jobInput = profileForm.querySelector('.popup__input_type_description');

const cardForm = newCardPopUp.querySelector('.popup__form');
const cardNameInput = cardForm.querySelector('.popup__input_type_card-name');
const cardLinkInput = cardForm.querySelector('.popup__input_type_url');
const placesList = document.querySelector('.places__list');

const avatarForm = avatarPopup.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_avatar');

 const imagePopup = document.querySelector('.popup_type_image');
 const popupImg = imagePopup.querySelector('.popup__image');
 const popupImageCaption = imagePopup.querySelector('.popup__caption');

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

// Обработчики открытия попапов
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profilePopUp);
});

addCardButton.addEventListener('click', () => {
  openModal(newCardPopUp);
});

profileAvatar.addEventListener('click', () => {
  openModal(avatarPopup);
});

// Закрытие по кнопкам
document.querySelectorAll('.popup__close').forEach((button) => {
  button.addEventListener('click', (evt) => {
    const popup = evt.target.closest('.popup');
    if (popup) closeModal(popup);
  });
});

// Пользователь
let userId = null;

// Загрузка данных
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    renderCards(cards);
  })
  .catch((err) => {
    console.error('Ошибка загрузки данных:', err);
    alert('Ошибка при загрузке данных');
  });

// Рендер карточек
function renderCards(cards) {
  placesList.innerHTML = '';
  cards.forEach((cardData) => {
    const cardElement = createCard(cardData, userId, handleDelete, handleLike, handleImageClick);
    placesList.append(cardElement);
  });
}

// Обработчики карточки
function handleDelete(cardId, cardElement) {
  deleteThisCard(cardId)
    .then(() => cardElement.remove())
    .catch((err) => console.error('Ошибка удаления карточки:', err));
}

function handleLike(cardId, isLiked, updateLikesUI) {
  const action = isLiked ? deleteLike : putLike;
  action(cardId)
    .then((updatedCard) => updateLikesUI(updatedCard.likes))
    .catch((err) => console.error('Ошибка лайка:', err));
}

function handleImageClick(link, name) {
  popupImg.src = link;
  popupImg.alt = name;
  popupImageCaption.textContent = name;
  openModal(imagePopup);
}

// Добавление карточки
cardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  const orig = btn.textContent;
  btn.textContent = 'Создание...';
  btn.disabled = true;

  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value
  })
    .then((newCard) => {
      const cardElement = createCard(newCard, userId, handleDelete, handleLike, handleImageClick);
      placesList.prepend(cardElement);
      closeModal(newCardPopUp);
      cardForm.reset();
      clearValidation(cardForm, validationConfig); 
    })
    .catch((err) => {
      console.error('Ошибка создания карточки:', err);
      alert('Не удалось добавить карточку.');
    })
    .finally(() => {
      btn.textContent = orig;
      btn.disabled = false;
    });
});

// Обновление профиля
profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  const orig = btn.textContent;
  btn.textContent = 'Сохранение...';
  btn.disabled = true;

  updateUserInfo(nameInput.value, jobInput.value)
    .then((user) => {
      profileName.textContent = user.name;
      profileDescription.textContent = user.about;
      closeModal(profilePopUp);
    })
    .catch((err) => {
      console.error('Ошибка обновления профиля:', err);
      alert('Не удалось сохранить изменения.');
    })
    .finally(() => {
      btn.textContent = orig;
      btn.disabled = false;
    });
});

// Обновление аватара
avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const btn = evt.submitter;
  const orig = btn.textContent;
  btn.textContent = 'Сохранение...';
  btn.disabled = true;

  updateAvatar(avatarInput.value)
    .then((user) => {
      profileAvatar.style.backgroundImage = `url(${user.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
      clearValidation(avatarForm, validationConfig);
    })
    .catch((err) => {
      console.error('Ошибка обновления аватара:', err);
      alert('Не удалось обновить аватар.');
    })
    .finally(() => {
      btn.textContent = orig;
      btn.disabled = false;
    });
});

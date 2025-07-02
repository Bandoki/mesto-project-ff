import './styles/index.css';
import { openModal, closeModal } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteThisCard, putLike, deleteLike, updateAvatar } from "./components/api";

// Элементы DOM 
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

// Валидация 
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

enableValidation(validationConfig);

// Модальные окна 
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openModal(profilePopUp);
});

addCardButton.addEventListener('click', () => {
  clearValidation(cardForm, validationConfig);
  openModal(newCardPopUp);
});

profileAvatar.addEventListener('click', () => {
  clearValidation(avatarForm, validationConfig);
  openModal(avatarPopup);
});

// Получение данных и рендер 
let userId;

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    renderCards(cards);
  })
  .catch(err => {
    console.error('Ошибка загрузки данных:', err);
    alert('Ошибка при загрузке данных');
  });

// Рендер карточек 
function renderCards(cards) {
  placesList.innerHTML = '';
  cards.forEach(card => {
    const cardElement = createCardElement(card);
    if (cardElement) placesList.append(cardElement);
  });
}

function createCardElement(card) {
  const template = document.querySelector('#card-template').content;
  const cardElement = template.cloneNode(true);

  const img = cardElement.querySelector('.card__image');
  const deleteBtn = cardElement.querySelector('.card__delete-button');
  const title = cardElement.querySelector('.card__title');
  const likeBtn = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count'); 

  img.src = card.link;
  img.alt = card.name;
  title.textContent = card.name;
  likeCount.textContent = card.likes.length; 

  // Лайк
  const setLikeState = () => {
    const liked = card.likes.some(u => u._id === userId);
    likeBtn.classList.toggle('card__like-button_liked', liked);
    likeCount.textContent = card.likes.length; 
  };

  setLikeState();

  likeBtn.addEventListener('click', () => {
    const action = likeBtn.classList.contains('card__like-button_liked')
      ? deleteLike(card._id)
      : putLike(card._id);

    action
      .then(updated => {
        card.likes = updated.likes;
        setLikeState();
      })
      .catch(err => console.error('Ошибка лайка:', err));
  });

  // Удаление карточки
  if (card.owner._id !== userId) {
    deleteBtn.style.display = 'none';
  } else {
    deleteBtn.addEventListener('click', () => {
      deleteThisCard(card._id)
        .then(() => deleteBtn.closest('.places__item').remove())
        .catch(err => console.error('Ошибка удаления:', err));
    });
  }

  // Открытие увеличенного изображения
  img.addEventListener('click', () => {
    openModal(document.querySelector('.popup_type_image'));
    const popupImage = document.querySelector('.popup__image');
    const popupCaption = document.querySelector('.popup__caption');
    popupImage.src = card.link;
    popupImage.alt = card.name;
    popupCaption.textContent = card.name;
  });

  return cardElement;
}

// Добавление новой карточки 
cardForm.addEventListener('submit', evt => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const original = submitBtn.textContent;
  submitBtn.textContent = 'Создание...';
  submitBtn.disabled = true;

  addNewCard({
    name: cardNameInput.value,
    link: cardLinkInput.value
  })
    .then(newCardData => {
      const cardElement = createCardElement(newCardData);
      placesList.prepend(cardElement);
      closeModal(newCardPopUp);
      cardForm.reset();
    })
    .catch(err => console.error('Ошибка создания карточки:', err))
    .finally(() => {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
    });
});

// Обновление профиля 
profileForm.addEventListener('submit', evt => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const original = submitBtn.textContent;
  submitBtn.textContent = 'Сохранение...';
  submitBtn.disabled = true;

  updateUserInfo(nameInput.value, jobInput.value)
    .then(updatedUser => {
      profileName.textContent = updatedUser.name;
      profileDescription.textContent = updatedUser.about;
      closeModal(profilePopUp);
      profileForm.reset();
    })
    .catch(err => console.error('Ошибка обновления профиля:', err))
    .finally(() => {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
    });
});

// Обновление аватара
avatarForm.addEventListener('submit', evt => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const original = submitBtn.textContent;
  submitBtn.textContent = 'Сохранение...';
  submitBtn.disabled = true;

  updateAvatar(avatarInput.value)
    .then(updatedUser => {
      profileAvatar.style.backgroundImage = `url(${updatedUser.avatar})`;
      closeModal(avatarPopup);
      avatarForm.reset();
    })
    .catch(err => console.error('Ошибка обновления аватара:', err))
    .finally(() => {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
    });
});


document.querySelectorAll('.popup__close').forEach(button => {
  button.addEventListener('click', (evt) => {
    const popup = evt.target.closest('.popup');
    if (popup) {
      closeModal(popup);
    }
  });
});
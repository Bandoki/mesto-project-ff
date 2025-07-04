import { deleteThisCard, putLike, deleteLike } from './api';

export { createCard, handleDelete, handleLike };

// Создание карточки
function createCard(cardData, userId, handleDelete, handleLike, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  const { name, link, likes, _id: cardId, owner } = cardData;

  cardImage.src = link;
  cardImage.alt = name;
  cardTitle.textContent = name;
  likeCount.textContent = likes.length;

  // Проверка, поставил ли пользователь лайк
  const isLiked = () => likes.some((like) => like._id === userId);
  if (isLiked()) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Обработка лайка
  likeButton.addEventListener('click', () => {
    const liked = likeButton.classList.contains('card__like-button_is-active');
    handleLike(cardId, liked, (updatedLikes) => {
      likeCount.textContent = updatedLikes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    });
  });

  // Удаление карточки, если она создана текущим пользователем
  if (owner._id !== userId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener('click', () => {
      handleDelete(cardId, cardElement);
    });
  }

  // Открытие картинки в попапе
  cardImage.addEventListener('click', () => {
    handleImageClick(link, name);
  });

  return cardElement;
}

// Функция удаления карточки
function handleDelete(cardId, cardElement) {
  deleteThisCard(cardId)
    .then(() => cardElement.remove())
    .catch((err) => console.error('Ошибка удаления карточки:', err));
}

// Функция обработки лайка
function handleLike(cardId, isLiked, updateLikesUI) {
  const action = isLiked ? deleteLike : putLike;
  action(cardId)
    .then((updatedCard) => updateLikesUI(updatedCard.likes))
    .catch((err) => console.error('Ошибка лайка:', err));
}


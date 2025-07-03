export { createCard };

// Создание карточки
function createCard(cardData, userId, handleDelete, handleLike, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.cloneNode(true).querySelector('.places__item');

  const image = cardElement.querySelector('.card__image');
  const title = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  image.src = cardData.link;
  image.alt = cardData.name;
  title.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  const isOwner = cardData.owner._id === userId;
  const isLiked = () => cardData.likes.some((user) => user._id === userId);

  const updateLikesUI = (likes) => {
    cardData.likes = likes;
    likeCount.textContent = likes.length;
    likeButton.classList.toggle('card__like-button_liked', isLiked());
  };

  if (isOwner) {
    deleteButton.addEventListener('click', () => handleDelete(cardData._id, cardElement));
  } else {
    deleteButton.remove();
  }

  likeButton.addEventListener('click', () => {
    handleLike(cardData._id, isLiked(), updateLikesUI);
  });

  image.addEventListener('click', () => {
    handleImageClick(cardData.link, cardData.name);
  });

  if (isLiked()) {
    likeButton.classList.add('card__like-button_liked');
  }

  return cardElement;
}

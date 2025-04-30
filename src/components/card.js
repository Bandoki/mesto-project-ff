export { createCard, deleteCard, handleLike };



// Функция для создания карточки

function createCard(cardInit, deleteFunction, likeHandler, imageClickHandler) {
    const cardTemplate = document.querySelector('#card-template').content;
    const cardElement = cardTemplate.cloneNode(true);
    
    cardElement.querySelector('.card__image').src = cardInit.link;
    cardElement.querySelector('.card__title').textContent = cardInit.name;

    const cardImage = cardElement.querySelector('.card__image');
    cardImage.src = cardInit.link;
    cardImage.alt = cardInit.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');

    deleteButton.addEventListener('click', deleteFunction);
    likeButton.addEventListener('click', likeHandler);
    cardImage.addEventListener('click', () => imageClickHandler(cardInit.link, cardInit.name));
    
    return cardElement;
}

// Функция для удаления карточки
function deleteCard(event) {
    event.target.closest('.card').remove();
}

// Функция для обработки лайков
function handleLike(event) {
    event.target.classList.toggle('card__like-button_is-active');
}
// @todo: Темплейт карточки

const cardTemplate = document.querySelector('#card-template').content;

/*// @todo: DOM узлы
const cloneElement = cardTemplate.querySelector('.card');*/
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(cardInit, deleteFunction) {

    const cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.card__image').src = cardInit.link;
    cardElement.querySelector('.card__title').textContent = cardInit.name;

    const deleteButton = cardElement.querySelector('.card__delete-button');

    deleteButton.addEventListener ('click', deleteFunction);

    return cardElement;
};

// @todo: Функция удаления карточки
function deleteCard(event) {
    event.target.closest('.card').remove();
};

// @todo: Вывести карточки на страницу


initialCards.forEach(cardData => {

    const cardElement = createCard(cardData, deleteCard);
    
    placesList.append(cardElement); 
    console.log(cardElement);
});
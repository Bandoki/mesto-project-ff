export { getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteThisCard, putLike, deleteLike, updateAvatar };

const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-41',
  headers: {
    authorization: '8a3ae9ab-0c78-4867-b51d-e65583791efa',
    'Content-Type': 'application/json'
  }
};

// Универсальная функция обработки ответа

function getResponseData(res) {
  if (!res.ok) {
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  return res.json();
}

// Функция для получения информации о пользователе

const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers
  }).then(getResponseData);
};

 // Функция для получения карточек

const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'GET',
    headers: config.headers
  }).then(getResponseData);
};

// Функция для обновления информации о пользователе

const updateUserInfo = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then(getResponseData);
};

 // Функция для добавления новой карточки

const addNewCard = ({ name, link }) => {
  if (!name || !link) {
    return Promise.reject('Название и ссылка не могут быть пустыми');
  }

  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then(getResponseData);
};

// Функция для удаления карточки

const deleteThisCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(getResponseData);
};

// Функция для постановки лайка

const putLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers
  }).then(getResponseData);
};

 // Функция для снятия лайка

const deleteLike = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers
  }).then(getResponseData);
};

 // Функция для обновления аватара

const updateAvatar = (avatarUrl) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ avatar: avatarUrl })
  }).then(getResponseData);
};

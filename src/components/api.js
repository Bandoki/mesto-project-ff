export {getUserInfo, getInitialCards, updateUserInfo, addNewCard, deleteThisCard, putLike, deleteLike, updateAvatar }

const config = {
    baseUrl: 'https://nomoreparties.co/v1/wff-cohort-41', 
    headers: {
      authorization: '8a3ae9ab-0c78-4867-b51d-e65583791efa', 
      'Content-Type': 'application/json'
    }
  };

  // Функция для получения информации о пользователе

const getUserInfo = () => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'GET',
      headers: config.headers
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .catch(err => console.log(err));  // Обрабатываем ошибку, если запрос не прошёл
  };
  
  // Функция для получения карточек

const getInitialCards = () => {
    return fetch(`${config.baseUrl}/cards`, {
      method: 'GET',
      headers: config.headers
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
  };


// Функция для обновления информации о пользователе

const updateUserInfo = (name, about) => {
    return fetch(`${config.baseUrl}/users/me`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        name,
        about
      })
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .catch(err => console.log(err));
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
  }).then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`));
};

  // Функция для удаления карточки

const deleteThisCard = (cardId) => {
    return fetch(`${config.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: config.headers
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .catch(err => console.log(err));
  };
  
  // Функция для постановки лайка

const putLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'PUT',
      headers: config.headers
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .catch(err => console.log(err));
  };

  // Функция для снятия лайка
  
const deleteLike = (cardId) => {
    return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
      method: 'DELETE',
      headers: config.headers
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .catch(err => console.log(err));
  };
  
  // Функция для обновления аватара

const updateAvatar = (avatarUrl) => {
    return fetch(`${config.baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify({
        avatar: avatarUrl
      })
    })
      .then(res => res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`))
      .catch(err => console.log(err));
  };
  
import { checkResponse, base_url } from './utils';

class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _parseResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  // Получение карточек от сервера
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => checkResponse(res));
  }

  // Отправка созданных карточек на сервер
  addCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => checkResponse(res));
  }

  // Удаление карточки
  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => checkResponse(res));
  }

  // Получение информации о пользователе с сервера
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => checkResponse(res));
  }

  // Редактирование информации о пользователе
  setUserInfo(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: data.username,
        about: data.job,
      }),
    }).then((res) => checkResponse(res));
  }

  // Редактирование аватара пользователя
  setUserAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => checkResponse(res));
  }

  // Добавить/удалить лайк
  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: `${!isLiked ? "DELETE" : "PUT"}`,
      headers: this._headers,
    }).then((res) => checkResponse(res));
  }
}

const api = new Api({
  baseUrl: base_url,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
    "Content-Type": "application/json",
  },
});

export default api;

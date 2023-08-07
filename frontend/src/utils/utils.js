export const base_url = 'https://api.akim.nomoreparties.co';
// export const base_url = 'http://localhost:3001';

export const checkResponse = (response) => {
  return response.ok
    ? response.json()
    : Promise.reject(
        new Error(`Ошибка ${response.status}: ${response.statusText}`)
      );
};
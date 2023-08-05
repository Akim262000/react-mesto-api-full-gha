const Card = require("../models/card");
const { ERROR_OK, ERROR_CREATE } = require("../utils/utils");

const ErrorBadRequest = require("../errors/ErrorBadRequest");
const ErrorForbidden = require("../errors/ErrorForbidden");
const ErrorNotFound = require("../errors/ErrorNotFound");

//Получение всех карточек из базы данных
function getCards(_req, res, next) {
  Card.find({})
    .then((cards) => res.status(ERROR_OK).send(cards.reverse()))
    .catch(next);
}

//Создание новой карточки
function createCards(req, res, next) {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(ERROR_CREATE).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ErrorBadRequest("Переданы неверные данные"));
      }
      return next(err);
    });
}

// Удаление карточки
function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const { _id } = req.user;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound("Карточка не найдена"));
      }

      if (!card.owner.equals(_id)) {
        return next(new ErrorForbidden("Нельзя удалить чужую карточку!"));
      }

      Card.findByIdAndRemove(cardId).then(res.status(ERROR_OK).send(card));
    })
    .catch(next);
}

//Добавление лайка карточке
function likeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(new ErrorNotFound("Карточка не найдена"));
      }
      return res.status(ERROR_OK).send(card);
    })
    .catch(next);
}

//Удаление лайка с карточки
function dislikeCard(req, res, next) {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => {
      if (!card) {
        return next(
          new ErrorNotFound("Карточка не найдена. Лайк не удалось убрать")
        );
      }
      return res.status(ERROR_OK).send(card);
    })
    .catch(next);
}

module.exports = {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
};

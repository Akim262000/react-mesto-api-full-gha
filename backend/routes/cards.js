const router = require("express").Router();

const {
  getCards,
  createCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

const {
  createCardsValidation,
  cardsValidation,
} = require("../middlewares/validations");

//Получение всех карточек из базы данных
router.get("/cards", getCards);
//Создание новой карточки
router.post("/cards", createCardsValidation, createCards);
//Удаление карточки
router.delete("/cards/:cardId", cardsValidation, deleteCard);
//Добавление лайка карточке
router.put("/cards/:cardId/likes", cardsValidation, likeCard);
//Удаление лайка с карточки
router.delete("/cards/:cardId/likes", cardsValidation, dislikeCard);

module.exports = router;

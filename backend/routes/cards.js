const router = require('express').Router();
const { validateCreateCard, validateCard } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} = require('../controllers/cards');

// возвращает всех карточки
router.get('/', getCards);
// создаёт карточку
router.post('/', validateCreateCard, createCard);
// удаляет карточку по _id
router.delete('/:cardId', validateCard, deleteCard);
// поставить лайк карточке
router.put('/:cardId/likes', validateCard, likeCard);
// убрать лайк с карточки
router.delete('/:cardId/likes', validateCard, unlikeCard);

module.exports = router;

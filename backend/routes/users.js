const router = require('express').Router();
const { validateUser, validateEditUserInfo, validateEditAvatar } = require('../middlewares/validation');

const {
  getUsersInfo,
  getUserById,
  getCurrentUserInfo,
  editUserInfo,
  editAvatar,
} = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getUsersInfo);
// возвращает информацию о текущем пользователе
router.get('/me', getCurrentUserInfo);
// редактирование профиля
router.patch('/me', validateEditUserInfo, editUserInfo);
// возвращает пользователя по _id
router.get('/:userId', validateUser, getUserById);
// редактирование аватара
router.patch('/me/avatar', validateEditAvatar, editAvatar);

module.exports = router;

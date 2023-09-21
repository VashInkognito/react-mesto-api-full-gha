const { celebrate, Joi } = require('celebrate');
const { regex } = require('../utils/constants');

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required()
      .regex(regex),
  }),
});

const validateCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

const validateUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

const validateEditUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateEditAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateCreateCard,
  validateCard,
  validateUser,
  validateEditUserInfo,
  validateEditAvatar,
};

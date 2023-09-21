const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err'); // 400
const UnauthorizedError = require('../errors/unauthorized-err'); // 401
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-err'); // 409

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUserInfo = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create(
      {
        ...req.body, password: hash,
      },
    ))
    .then(({
      name, about, avatar, email, _id,
    }) => res.status(201).send({
      name, about, avatar, email, _id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // вернём токен
      res.status(200).send({ token });
    })
    .catch(() => {
      // ошибка аутентификации
      next(new UnauthorizedError('Неправильная почта или пароль'));
    });
};

module.exports.getUsersInfo = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return next(new NotFoundError('Пользователи не найдены'));
      } return res.status(200).send({ users });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports.getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.editUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};

module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      return next(err);
    });
};

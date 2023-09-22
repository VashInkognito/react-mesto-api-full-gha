require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const { createUserInfo, login } = require('./controllers/users');
const NotFoundError = require('./errors/not-found-err'); // 404
const { validateLogin, validateCreateUser } = require('./middlewares/validation');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
};
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', options);

const app = express();

app.use(cors({ origin: ['http://localhost:3001', 'https://localhost:3001', 'https://vashinkognito.nomoredomainsrocks.ru', 'http://vashinkognito.nomoredomainsrocks.ru'] }));

// для сборки JSON-файла
app.use(bodyParser.json());
// для приёма веб-страниц внутри POST-запроса
app.use(bodyParser.urlencoded({ extended: true }));

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// подключаем логгер запросов
app.use(requestLogger);

// роуты, не требующие авторизации
app.post('/signup', validateCreateUser, createUserInfo);
app.post('/signin', validateLogin, login);

// авторизация
app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorHandler);

app.listen(PORT);

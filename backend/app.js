require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const auth = require('./middlewares/auth')
const { errors } = require('celebrate');
const { createUser, login, getUsers } = require("./controllers/users");
const { signUp, signIn } = require("./middlewares/validations");
const ErrorNotFound = require("./errors/ErrorNotFound");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require("./middlewares/cors");

const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors);

// подключаем логгер запросов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', signUp, createUser);
app.post('/signin', signIn, login);

app.use(auth);

// роуты, которым нужна авторизация
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

// запрос к несуществующему роуту
app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

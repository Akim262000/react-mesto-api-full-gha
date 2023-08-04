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

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {
  useCreateIndex: true,
  useUnifiedTopology: false,
  useNewUrlParser: true
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаем логгер запросов
app.use(requestLogger);

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

app.use(cors);

// подключаем логгер ошибок
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

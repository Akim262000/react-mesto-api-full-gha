const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const ErrorConflict = require("../errors/ErrorConflict");
const ErrorBadRequest = require("../errors/ErrorBadRequest");
const ErrorNotFound = require("../errors/ErrorNotFound");

const { ERROR_OK, ERROR_CREATE } = require("../utils/utils");

//Получение данных о всех пользователях
function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.status(ERROR_OK).send(users))
    .catch(next);
}

//Получение данных о конкретном пользователе
function getUser(req, res, next) {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new ErrorNotFound("Пользователь не найден"));
      }
      return res.status(ERROR_OK).send(user);
    })
    .catch(next);
}

//Создание пользователя
function createUser(req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ErrorBadRequest(`Неправильный логин или пароль`);
  }

    bcrypt.hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        password: hash,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
      })
    )
    .then((user) =>
      res.status(ERROR_CREATE).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ErrorConflict("Пользователь с таким email уже существует"));
      }
      return next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user || !password) {
        return next(new ErrorBadRequest("Неверный email или пароль"));
      }
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });

      // вернём токен
      return res.send({ token });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new ErrorNotFound("Пользователь не найден"));
      }

      return res.status(ERROR_OK).send(user);
    })
    .catch(next);
}

//Обновление данных пользователя
function renovateUser(req, res, next) {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(ERROR_OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ErrorBadRequest("Неверный тип данных"));
      }
      return next(err);
    });
}

//Обновление аватара пользователя
function renovateUserAvatar(req, res, next) {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(ERROR_OK).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new ErrorBadRequest("Неверная ссылка"));
      }
      return next(err);
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  login,
  getCurrentUser,
  renovateUser,
  renovateUserAvatar,
};

const {ERROR_INTERNAL_SERVER} = require("../utils/utils");

const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log(err.stack || err);
  const status = err.statusCode || ERROR_INTERNAL_SERVER;
  const message = err.message || 'На сервере произошла ошибка.';

  res.status(status).send({
    err,
    message,
  });
  next();
};

module.exports = errorHandler;
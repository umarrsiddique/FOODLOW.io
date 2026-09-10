// Centralized error handler - keeps controllers free of repeated try/catch boilerplate
// for unexpected errors, similar in spirit to Spring's default exception handling.
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong',
  });
}

module.exports = errorHandler;

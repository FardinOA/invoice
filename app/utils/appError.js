class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.status = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;

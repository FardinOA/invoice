// middleware/globalError.js

import AppError from "./appError.js";

const globalError = (err, req, res, next) => {
  // Set default values for statusCode and status
  err.status = err.status || 500;

  // MongoDB invalid ObjectId error (CastError)
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new AppError(400, message);
  }

  // MongoDB duplicate key error
  if (err.code === 11000) {
    const message = `This ${Object.keys(err.keyValue)} is already exists`;
    err = new AppError(400, message);
  }

  // jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please login again.";
    err = new AppError(401, message);
  }

  // jwt token error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please login again.";
    err = new AppError(401, message);
  }

  // Development environment error response
  if (process.env.NODE_ENV === "development") {
    return res.status(err.status).json({
      success: false,
      status: err.status,
      error: err, // Full error object for debugging
      message: err.message, // Error message
      stack: err.stack, // Stack trace for debugging
    });
  }

  // Production environment error response
  if (process.env.NODE_ENV === "production") {
    // For operational errors, send friendly messages
    if (err.isOperational) {
      return res.status(err.status).json({
        success: false,
        status: err.status,
        message: err.message,
      });
    }

    // Send a generic message
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

export default globalError;

const globalError = (err, req, res, next) => {
  // Set default values for statusCode and status
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    // In development, show the full error details
    return res.status(err.statusCode).json({
      status: err.status,
      error: err, // Full error object for debugging
      message: err.message, // Error message
      stack: err.stack, // Stack trace for debugging
    });
  }

  if (process.env.NODE_ENV === "production") {
    // Operational, trusted errors: send a friendly message to the client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or other unknown errors: don't leak error details
    else {
      // Log the error
      console.error("ERROR 💥", err);

      // Send generic message to the client
      return res.status(500).json({
        status: "error",
        message: "Something went very wrong!",
      });
    }
  }
};

export default globalError;

const errorHandler = (err, req, res, next) => {
  console.error(err);

  // MongoDB Invalid ID
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID",
    });
  }

  // Duplicate Key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: `${Object.keys(err.keyValue)} already exists`,
    });
  }

  // Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((value) => value.message);

    return res.status(422).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Default Error
  return res.status(err.statusCode || 500).json({
    success: false,

    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;

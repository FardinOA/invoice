export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((err) => err.message);

    return res.status(422).json({ status_code: 422, status: "fail", errors });
  }

  next();
};

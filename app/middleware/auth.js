import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
const isAuth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decode.id);
  if (!user) {
    return next(new AppError(401, "Please login to access this resource"));
  }

  req.user = user;
  next();
};

export { isAuth };

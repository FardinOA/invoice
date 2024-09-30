// controllers/authController.js

import User from "../models/userModel.js";

const signup = async (req, res, next) => {
  try {
    const { name, email, address, password, passwordConfirm } = req.body;

    // Create a new user instance
    const newUser = await User.create({
      name,
      email,
      address,
      password,
      passwordConfirm,
    });
    newUser.password = undefined; // Remove password from the response

    res.status(201).json({
      status: 201,
      status_message: "User Created Successfully",
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { signup };

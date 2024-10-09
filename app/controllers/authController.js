// controllers/authController.js

import User from "../models/userModel.js";
import AppError from "../utils/appError.js";

// sign up controller
const signup = async (req, res, next) => {
  try {
    const { name, email, address, password } = req.body;

    // Create a new user instance
    const newUser = await User.create({
      name,
      email,
      address,
      password,
    });
    newUser.password = undefined; // Remove password from the response

    res.status(201).json({
      success: true,
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

// sign in controller

const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, "Please provide email and password"));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password))) {
      return next(new AppError(401, "Invalid email or password"));
    }

    user.password = undefined;

    // create jwt token
    const token = await user.generateToken();

    let oldTokens = user?.tokens || [];

    if (oldTokens?.length) {
      oldTokens = oldTokens.filter((t) => {
        const timeDiff = (Date.now() - parseInt(t.signedAt)) / 1000;
        if (timeDiff < 86400) {
          return t;
        }
      });
    }

    await User.findByIdAndUpdate(user._id, {
      tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
    });

    res.status(200).json({
      success: true,
      status: 200,
      status_message: "User Logged In Successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// logout current user
const logout = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new AppError(401, "Unauthenticated"));
    }

    const tokens = req.user.tokens;

    const newTokens = tokens.filter((t) => t.token !== token);

    await User.findByIdAndUpdate(req.user.id, { tokens: newTokens });
    res.status(200).json({
      success: true,
      status: 200,
      status_message: "User Logged Out Successfully",
    });
  }
};

export { signup, signIn, logout };

import express from "express";
import { logout, signIn, signup } from "../controllers/authController.js";
import { validate } from "../middleware/validator.js";
import {
  userLoginValidationSchema,
  userValidationSchema,
} from "../validator/userValidator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", validate(userValidationSchema), signup);
router.post("/signin", validate(userLoginValidationSchema), signIn);
router.get("/logout", isAuth, logout);

export default router;

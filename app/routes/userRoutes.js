import express from "express";
import { signup } from "../controllers/authController.js";
import { validate } from "../middleware/validator.js";
import { userValidationSchema } from "../validator/userValidator.js";

const router = express.Router();

router.post("/signup", validate(userValidationSchema), signup);

export default router;

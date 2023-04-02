import { body } from "express-validator";

export const registerValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  body("nickname").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];

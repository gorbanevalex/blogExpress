import { body } from "express-validator";

export const registerValidation = [
  body("email", "Введите корректный e-mail").isEmail(),
  body("password", "Пароль минимум 5 символов").isLength({ min: 5 }),
  body("nickname", "Никнейм минимум 3 символа").isLength({ min: 3 }),
  body("avatarUrl").optional().isString(),
];

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

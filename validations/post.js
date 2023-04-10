import { body } from "express-validator";

export const PostValidation = [
  body("title").isLength({ min: 3 }),
  body("text").isLength({ min: 3 }),
  body("imgUrl").optional().isString(),
  body("tags").optional().isArray(),
];

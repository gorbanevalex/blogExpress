import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";

import { UserController, PostController } from "./controllers/index.js";

import { hadlerValidationErrors } from "./utils/index.js";

import checkToken from "./middleware/checkToken.js";

import { loginValidation, registerValidation } from "./validations/auth.js";
import { PostValidation } from "./validations/post.js";

dotenv.config();
mongoose
  .connect(
    `mongodb+srv://admin:${process.env.PASSWORD_DB}@cluster0.m1ocnis.mongodb.net/blogExpress?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("MongoBG already!");
  })
  .catch((err) => {
    console.log("MongoDB not already!", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/upload", express.static("uploads"));

app.listen(8000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Started");
});

app.post(
  "/user/register",
  registerValidation,
  hadlerValidationErrors,
  UserController.register
);
app.post(
  "/user/login",
  loginValidation,
  hadlerValidationErrors,
  UserController.login
);
app.get("/user/me", checkToken, UserController.getMe);

app.post("/upload", checkToken, upload.single("image"), (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Не удалось загрузить файл",
    });
  }
});

app.get("/posts", PostController.getAll);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkToken,
  PostValidation,
  hadlerValidationErrors,
  PostController.create
);
app.delete("/posts/:id", checkToken, PostController.remove);
app.patch(
  "/posts/:id",
  checkToken,
  PostValidation,
  hadlerValidationErrors,
  PostController.update
);

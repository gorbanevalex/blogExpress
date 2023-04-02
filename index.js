import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import checkToken from "./utils/checkToken.js";

import { registerValidation } from "./validations/auth.js";

import * as UserController from "./controllers/UserController.js";

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
app.use(express.json());

app.listen(8000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server Started");
});

app.post("/user/register", registerValidation, UserController.register);

app.post("/user/login", UserController.login);

app.get("/user/me", checkToken, UserController.getMe);

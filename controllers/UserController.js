import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password.toString();
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      nickname: req.body.nickname,
      passwordHash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегестрировать пользователя",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const isValiPass = await bcrypt.compare(
      req.body.password.toString(),
      user.passwordHash
    );
    if (!isValiPass) {
      return res.status(404).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось получить информацию",
    });
  }
};

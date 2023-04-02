import { validationResult } from "express-validator";
import PostModel from "../models/Posts.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find();

    res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }
  try {
    const doc = new PostModel({
      text: req.body.text,
      title: req.body.title,
      tags: req.body.tags,
      imgUrl: req.body.imgUrl,
      author: req.userId,
    });
    const post = await doc.save();
    res.json(post);
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось создать пост",
    });
  }
};

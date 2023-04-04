import { json } from "express";
import { validationResult } from "express-validator";
import PostModel from "../models/Posts.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("author", [
      "nickname",
      "email",
      "avatarUrl",
    ]);

    res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};

export const getOne = async (req, res) => {
  const id = req.params.id;
  PostModel.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $inc: { viewsCount: 1 },
    },
    {
      returnDocument: "after",
    }
  )
    .populate("author", ["nickname", "email", "avatarUrl"])
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Статья не найдена",
        });
      }

      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Не удалось получить статью",
      });
    });
};

export const remove = async (req, res) => {
  const id = req.params.id;
  PostModel.findOneAndDelete({
    _id: id,
    author: req.userId,
  })
    .then((doc) => {
      if (!doc) {
        return res.status(404).json({
          message: "Не удалось найти статью",
        });
      }

      res.json({
        success: true,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        message: "Не удалось удалить статью",
      });
    });
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

export const update = async (req, res) => {
  const id = req.params.id;

  try {
    await PostModel.updateOne(
      {
        _id: id,
        author: req.userId,
      },
      {
        text: req.body.text,
        title: req.body.title,
        tags: req.body.tags,
        imgUrl: req.body.imgUrl,
        author: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось обновить статью",
    });
  }
};

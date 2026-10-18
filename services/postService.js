import mongoose from "mongoose";
import Post from "../models/Post.js";

function createError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validatePostId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw createError("Invalid post ID", 400);
  }
}

function validatePostData({ title, content }) {
  if (typeof title !== "string" || typeof content !== "string") {
    throw createError("Title and content must be strings", 400);
  }

  const cleanTitle = title.trim();
  const cleanContent = content.trim();

  if (cleanTitle.length < 3 || cleanTitle.length > 150) {
    throw createError("Title must be between 3 and 150 characters", 400);
  }

  if (cleanContent.length < 1 || cleanContent.length > 10000) {
    throw createError("Content must be between 1 and 10000 characters", 400);
  }

  return {
    title: cleanTitle,
    content: cleanContent,
  };
}

function canManagePost(post, user) {
  return (
    post.author._id.toString() === user._id.toString() ||
    user.role === "admin"
  );
}

// CREATE POST
export async function createPost(data, userId) {
  const { title, content } = validatePostData(data);

  const post = await Post.create({
    title,
    content,
    author: userId,
  });

  return Post.findById(post._id).populate("author", "name");
}

// GET ALL POSTS
export async function getAllPosts() {
  return Post.find()
    .populate("author", "name")
    .sort({ createdAt: -1 });
}

// GET ONE POST
export async function getPostById(id) {
  validatePostId(id);

  const post = await Post.findById(id).populate("author", "name");

  if (!post) {
    throw createError("Post not found", 404);
  }

  return post;
}

// UPDATE POST
export async function updatePost(id, data, user) {
  validatePostId(id);

  const allowedFields = Object.keys(data);

  if (
    allowedFields.length === 0 ||
    allowedFields.some((field) => !["title", "content"].includes(field))
  ) {
    throw createError("Only title and content can be updated", 400);
  }

  const post = await Post.findById(id).populate("author", "name");

  if (!post) {
    throw createError("Post not found", 404);
  }

  if (!canManagePost(post, user)) {
    throw createError("You cannot edit this post", 403);
  }

  const updatedData = {};

  if (Object.hasOwn(data, "title")) {
    if (typeof data.title !== "string") {
      throw createError("Title must be a string", 400);
    }

    updatedData.title = data.title.trim();

    if (
      updatedData.title.length < 3 ||
      updatedData.title.length > 150
    ) {
      throw createError("Title must be between 3 and 150 characters", 400);
    }
  }

  if (Object.hasOwn(data, "content")) {
    if (typeof data.content !== "string") {
      throw createError("Content must be a string", 400);
    }

    updatedData.content = data.content.trim();

    if (
      updatedData.content.length < 1 ||
      updatedData.content.length > 10000
    ) {
      throw createError(
        "Content must be between 1 and 10000 characters",
        400,
      );
    }
  }

  Object.assign(post, updatedData);

  await post.save();

  return post;
}

// DELETE POST
export async function deletePost(id, user) {
  validatePostId(id);

  const post = await Post.findById(id).populate("author", "name");

  if (!post) {
    throw createError("Post not found", 404);
  }

  if (!canManagePost(post, user)) {
    throw createError("You cannot delete this post", 403);
  }

  await post.deleteOne();

  return true;
}
import * as postService from "../services/postService.js";

function handleError(res, error) {
  const status = error.status || 500;

  return res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
  });
}

// CREATE
export async function createPost(req, res) {
  try {
    const post = await postService.createPost(req.body, req.user._id);

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: { post },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET ALL
export async function getAllPosts(req, res) {
  try {
    const posts = await postService.getAllPosts();

    return res.status(200).json({
      success: true,
      results: posts.length,
      data: { posts },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// GET ONE
export async function getPostById(req, res) {
  try {
    const post = await postService.getPostById(req.params.id);

    return res.status(200).json({
      success: true,
      data: { post },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// UPDATE
export async function updatePost(req, res) {
  try {
    const post = await postService.updatePost(
      req.params.id,
      req.body,
      req.user,
    );

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: { post },
    });
  } catch (error) {
    return handleError(res, error);
  }
}

// DELETE
export async function deletePost(req, res) {
  try {
    await postService.deletePost(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    return handleError(res, error);
  }
}
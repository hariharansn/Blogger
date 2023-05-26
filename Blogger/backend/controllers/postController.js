const Post = require('../models/post');

const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Check if the user ID is available in the req.user object
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User authentication failed' });
    }

    const userId = req.user.id;

    // Create a new post
    const newPost = await Post.create({
      title,
      content,
      userId,
    });

    res.status(201).json({ message: 'Post created', post: newPost });
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ message: 'Failed to create post' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
};

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
};

const updatePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { title, content } = req.body;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.status(200).json({ message: 'Post updated', post });
  } catch (error) {
    console.error('Post update error:', error);
    res.status(500).json({ message: 'Failed to update post' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await post.destroy();

    res.status(200).json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Post deletion error:', error);
    res.status(500).json({ message: 'Failed to delete post' });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};

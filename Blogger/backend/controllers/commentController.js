const Comment = require('../models/comment');
const Post = require('../models/post');

// Create a new comment
const createComment = async (req, res) => {
    try {
      const { postId, content } = req.body;
      
      // Check if the user ID is available in the req.user object
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User authentication failed' });
      }
      
      const userId = req.user.id;
  
      // Check if the post exists
      const post = await Post.findByPk(postId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Create a new comment
      const newComment = await Comment.create({
        postId,
        content,
        userId,
      });
  
      res.status(201).json({ message: 'Comment created', comment: newComment });
    } catch (error) {
      console.error('Comment creation error:', error);
      res.status(500).json({ message: 'Failed to create comment' });
    }
  };
  

// Get all comments for a post
const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Check if the post exists
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Get all comments for the post
    const comments = await Comment.findAll({ where: { postId } });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};


// Get a comment by its ID
const getCommentById = async (req, res) => {
    try {
      const commentId = req.params.commentId;
  
      // Find the comment by its ID
      const comment = await Comment.findByPk(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      res.status(200).json({ comment });
    } catch (error) {
      console.error('Error fetching comment:', error);
      res.status(500).json({ message: 'Failed to fetch comment' });
    }
  };
    

// Update a comment
const updateComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { content } = req.body;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Update the comment
    await comment.update({
      content,
    });

    res.status(200).json({ message: 'Comment updated', comment });
  } catch (error) {
    console.error('Comment update error:', error);
    res.status(500).json({ message: 'Failed to update comment' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Comment deletion error:', error);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};


module.exports = {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    getCommentById,
  };

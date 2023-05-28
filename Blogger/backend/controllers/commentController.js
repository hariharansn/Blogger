
const {Post,Comment}  =require('../models/model')


// Create a new comment on a post
exports.createComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const newComment = await Comment.create({ content, postId, userId });

    res.status(201).json({ message: 'Comment created successfully', comment: newComment });
  } catch (err) {
    console.error('Error creating comment:', err);
    next(err);
  }
};



// Get all comments of a post
exports.getCommentsByPostId = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comments = await Comment.findAll({ where: { postId } });

    res.status(200).json(comments);
  } catch (err) {
    console.error('Error getting comments:', err);
    next(err);
  }
};



// Get a specific comment on a post
exports.getCommentById = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await Comment.findOne({ where: { id: commentId, postId } });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.status(200).json(comment);
  } catch (err) {
    console.error('Error getting comment:', err);
    next(err);
  }
};



// Update a comment on a specific post
exports.updateComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const { userId } = req;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await Comment.findOne({ where: { id: commentId, postId } });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    comment.content = content;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (err) {
    console.error('Error updating comment:', err);
    next(err);
  }
};


// Delete a comment on a specific post
exports.deleteComment = async (req, res, next) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await Comment.findOne({ where: { id: commentId, postId } });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await comment.destroy();

    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', err);
    next(error);
  }
};













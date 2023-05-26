const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authentication');

// Route for creating a new comment
router.post('/', commentController.createComment);

// Route for getting all comments of a post
router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

// Route for getting a specific comment
router.get('/comments/:commentId', commentController.getCommentById);

// Route for updating a comment
router.put('/:commentId', commentController.updateComment);

// Route for deleting a comment
router.delete('/:commentId',  commentController.deleteComment);

module.exports = router;

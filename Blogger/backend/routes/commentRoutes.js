const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateToken } = require('../middleware/authentication');

// Route for creating a new comment
router.post('/',authenticateToken, commentController.createComment);

// Route for getting all comments of a post
router.get('/', commentController.getCommentsByPostId);

// Route for getting a specific comment
router.get('/:commentId', commentController.getCommentById);

// Route for updating a comment
router.put('/:commentId',authenticateToken, commentController.updateComment);

// Route for deleting a comment
router.delete('/:commentId',  authenticateToken,commentController.deleteComment);

module.exports = router;

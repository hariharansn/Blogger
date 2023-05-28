const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateToken } = require('../middleware/authentication');


// Route for creating a new post
router.post('/', authenticateToken, postController.createPost);

// Route for getting all post
router.get('/', postController.getAllPosts);

// Route for getting a specific post
router.get('/:postId', postController.getPostById);


// Route for updating a post
router.put('/:postId', authenticateToken, postController.updatePost);


// Route for deleting a post
router.delete('/:postId', authenticateToken, postController.deletePost);

module.exports = router;

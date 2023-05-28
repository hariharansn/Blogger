
const {User,Post,Comment}  =require('../models/model')


// Create a new blog post
exports.createPost = async (req, res, next) => {
  const { title, content } = req.body;

  try {
    // Get the user ID from the request
    const userId = req.userId;

    // Create the post in the database
    const post = await Post.create({ title, content, userId });
    
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    next(err);
  }
};




// Get all blog posts
exports.getAllPosts =  async (req, res, next) => {
  try {
    // Get all posts from the database
    const posts = await Post.findAll({ include: [{ model: User, attributes: ['username'] }] });

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Error retrieving posts:', err);
    next(err);
  }
};



// Get a specific post
exports.getPostById =  async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      include: { model: Comment, order: [['created_at', 'ASC'], ['updated_at', 'ASC']] }, // Include the associated Comment model and order by created_at ASC
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error retrieving post:', err);
    next(err);
  }
};





// Update a post
exports.updatePost =async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const userId = req.userId; // Assuming req.userId contains the user ID

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    post.title = title;
    post.content = content;
    await post.save();

    res.status(200).json({ message: 'Post updated successfully', post });
  } catch (err) {
    console.error('Error updating post:', err);
    next(err);
  }
};



// Delete a post
exports.deletePost =async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req;

    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete the post
    await post.destroy();

    // Delete the associated comments
    await Comment.destroy({ where: { postId } });

    res.status(200).json({ message: 'Post and associated comments deleted successfully' });
  } catch (err) {
    console.error('Error deleting post:', err);
    next(err);
  }
};













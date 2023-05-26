const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Server error' });
});


// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  port: process.env.DB_PORT,
});




// Test the database connection and initialize tables
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected');
   // Call the initializeTables function to create or check the tables
initializeTables();
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });



// Define the User model
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Define the Post model
const Post = sequelize.define('posts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Define the Comment model
const Comment = sequelize.define('comments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
// Initialize tables
const initializeTables = async () => {
  try {
    // Check if the tables exist in the database
    const userTableExists = await User.sync({ force: false });
    const postTableExists = await Post.sync({ force: false });
    const commentTableExists = await Comment.sync({ force: false });

    if (!userTableExists) {
      console.log('User table created');
    }
    if (!postTableExists) {
      console.log('Post table created');
    }
    if (!commentTableExists) {
      console.log('Comment table created');
    }

    // Define associations between models
    User.hasMany(Post, { foreignKey: 'userId' });
    Post.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Comment, { foreignKey: 'userId' });
    Comment.belongsTo(User, { foreignKey: 'userId' });

    Post.hasMany(Comment, { foreignKey: 'postId' });
    Comment.belongsTo(Post, { foreignKey: 'postId' });

    console.log('Models synchronized with the database');
  } catch (err) {
    console.error('Error synchronizing models:', err);
  }
};






// User registration
app.post('/api/register', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
     await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    next(err); // Pass the error to the error handling middleware
  }
});
// User login
app.post('/api/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      // Compare the provided password with the hashed password in the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: 'Authentication failed' });
      } else {
        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'secretKey');
  
        // Send the token as a response
        res.json({ token });
      }
    }
  } catch (err) {
    console.error('Error retrieving user:', err);
    next(err); // Pass the error to the error handling middleware
  }
});

// Authenticate requests
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  jwt.verify(token, 'secretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
}

// Create a new blog post
app.post('/api/posts', authenticateToken, async (req, res, next) => {
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
});




// Get all blog posts
app.get('/api/posts', async (req, res, next) => {
  try {
    // Get all posts from the database
    const posts = await Post.findAll({ include: [{ model: User, attributes: ['username'] }] });

    res.status(200).json({ posts });
  } catch (err) {
    console.error('Error retrieving posts:', err);
    next(err);
  }
});



// Get a specific post
app.get('/api/posts/:postId',  async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId, {
      include: { model: Comment, order: [['created_at', 'ASC']] }, // Include the associated Comment model and order by created_at ASC
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error retrieving post:', err);
    next(err);
  }
});





// Update a post
app.put('/api/posts/:postId',authenticateToken, async (req, res, next) => {
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
});



// Delete a post
app.delete('/api/posts/:postId',authenticateToken, async (req, res, next) => {
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
});




// Create a new comment on a post
app.post('/api/posts/:postId/comments', authenticateToken,async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = req;

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
});



// Get all comments of a post
app.get('/api/posts/:postId/comments', async (req, res, next) => {
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
});



// Get a specific comment on a post
app.get('/api/posts/:postId/comments/:commentId', async (req, res, next) => {
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
});



// Update a comment on a specific post
app.put('/api/posts/:postId/comments/:commentId',authenticateToken, async (req, res, next) => {
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
});


// Delete a comment on a specific post
app.delete('/api/posts/:postId/comments/:commentId', authenticateToken, async (req, res, next) => {
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
});





// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


#NOTE we can use only with the single sever.js file if want to use download *server.js* and *package.json* and run *npm install*

# Blogger
The provided code is a backend server implementation using Express.js framework, Sequelize ORM, and can use with  PostgreSQL, MYSQL, Oracle database. It defines routes and handlers for user registration, user login, creating blog posts, managing comments on posts, and performing CRUD operations on posts and comments.




To interact with the RESTful API provided in the code using Postman, you can perform various HTTP requests to different endpoints. Here's a list of the available endpoints and their usages:

1. User Registration:
   - Endpoint: `POST /api/register`
   - Usage: Register a new user by sending a POST request with the user's details (username and password) in the request body.

{
  "username": "your_username",
  "password": "your_password"
}



2. User Login:
   - Endpoint: `POST /api/login`
   - Usage: Authenticate a user by sending a POST request with the user's credentials (username and password) in the request body. On successful authentication, the server responds with a JWT token that can be used for subsequent requests requiring authentication.
{
  "username": "your_username",
  "password": "your_password"
}





3. Create a New Blog Post:
   - Endpoint: `POST /api/posts`
   - Usage: Create a new blog post by sending a POST request with the post's details (title and content) in the request body. Include the JWT token obtained during user login in the request headers as `Authorization: Bearer <token>`.

{
  "title": "Your Post Title",
  "content": "Your Post Content"
}




4. Get All Blog Posts:
   - Endpoint: `GET /api/posts`
   - Usage: Retrieve all blog posts by sending a GET request. The server responds with an array of blog posts, including the associated user's username.

5. Get a Specific Blog Post:
   - Endpoint: `GET /api/posts/:postId`
   - Usage: Retrieve a specific blog post by sending a GET request to the endpoint, replacing `:postId` with the ID of the desired post. The server responds with the details of the post, including the associated comments ordered by creation date.

6. Update a Blog Post:
   - Endpoint: `PUT /api/posts/:postId`
   - Usage: Update a specific blog post by sending a PUT request to the endpoint, replacing `:postId` with the ID of the post to update. Include the updated details (title and content) in the request body. Also, include the JWT token obtained during user login in the request headers as `Authorization: Bearer <token>`.

{
  "title": "Updated Post Title",
  "content": "Updated Post Content"
}




7. Delete a Blog Post:
   - Endpoint: `DELETE /api/posts/:postId`
   - Usage: Delete a specific blog post by sending a DELETE request to the endpoint, replacing `:postId` with the ID of the post to delete. Include the JWT token obtained during user login in the request headers as `Authorization: Bearer <token>`.

8. Create a New Comment:
   - Endpoint: `POST /api/posts/:postId/comments`
   - Usage: Create a new comment on a specific blog post by sending a POST request to the endpoint, replacing `:postId` with the ID of the post. Include the comment content in the request body. Also, include the JWT token obtained during user login in the request headers as `Authorization: Bearer <token>`.


   {
  "content": "Your Comment Content"
}


9. Get All Comments of a Post:
   - Endpoint: `GET /api/posts/:postId/comments`
   - Usage: Retrieve all comments of a specific blog post by sending a GET request to the endpoint, replacing `:postId` with the ID of the post. The server responds with an array of comments associated with the post.

10. Get a Specific Comment:
    - Endpoint: `GET /api/posts/:postId/comments/:commentId`
    - Usage: Retrieve a specific comment on a post by sending a GET request to the endpoint, replacing `:postId` with the ID of the post and `:commentId` with the ID of the comment. The server responds with the details of the comment.

11. Update a Comment:
    - Endpoint: `PUT /api/posts/:postId/comments/:commentId`
    - Usage: Update a specific comment on a post by sending a PUT request to the endpoint,

    {
  "content": "Updated Comment Content"
}


 replacing `:postId` with the ID of the post and `:commentId` with the ID of the comment. Include the updated comment content in the request body. Also, include the JWT token obtained during user login in the request headers as `Authorization: Bearer <token>`.

Note: Make sure you have the PostgreSQL database configured and running before testing the API with Postman. Also, you may need to update the database connection details in the code to match your setup.

To use Postman:
1. Install Postman from https://www.postman.com/downloads/.
2. Open Postman and create a new request.
3. Set the HTTP method and enter the endpoint URL.
4. Set request headers if necessary (e.g., `Authorization: Bearer <token>`).
5. Set request body (if required) and format it according to the endpoint's expected data.
6. Click the Send button to make the request and view the response.

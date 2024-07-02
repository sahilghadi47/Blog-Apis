# MERN Blog Backend

## Overview

This is the backend part of the MERN Blog application. It is built using Node.js, Express.js, and MongoDB. The backend handles various functionalities such as user authentication, post management, comments, and likes.

## Project Structure

The project structure is as follows:

```css
backend/
├── node_modules/
├── public/
├── src/
│   ├── config/
│   ├── controller/
│   │   ├── comment.controller.js
│   │   ├── Controller.md
│   │   ├── likes.controller.js
│   │   ├── post.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── comment.model.js
│   │   ├── like.model.js
│   │   ├── post.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── comments.route.js
│   │   ├── likes.route.js
│   │   ├── post.route.js
│   │   └── user.route.js
│   ├── utils/
│   │   ├── app.js
│   │   └── index.js
├── .env
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Installation

Clone the repository: SSH

```sh
git clone git@github.com:sahilghadi47/MERN-Blog.git
```

Navigate to the backend directory:

```sh
cd backend
```

## Install the dependencies

``` sh
npm install
```

Create a .env file in the root of the backend directory and add the following environment variables:

make file

```env
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<your_jwt_secret>
Start the server:
```

Run using :

```sh
npm start
```

## Directory Details

### public

contains temp folder to  temporary save user files.

### src/config/

Contains configuration files for the application.

### src/controller/

Handles the business logic of the application. Each controller corresponds to a specific model.

- comment.controller.js: Manages comment-related operations.
- likes.controller.js: Manages like-related operations.
- post.controller.js: Manages post-related operations.
- user.controller.js: Manages user-related operations.

### src/models/

Contains the Mongoose models that define the schema for the MongoDB collections.

- comment.model.js: Schema for comments.
- like.model.js: Schema for likes.
- post.model.js: Schema for posts.
- user.model.js: Schema for users.
  
### src/routes/

Defines the API endpoints and maps them to the corresponding controllers.

- comments.route.js: Routes for comment operations.
- likes.route.js: Routes for like operations.
- post.route.js: Routes for post operations.
- user.route.js: Routes for user operations.

### src/utils/

Contains utility files for setting up the server and application.

- app.js: Configures and initializes the Express application.
- index.js: Entry point for the backend server.

## Available Scripts

In the project directory, you can run:

- npm start: Runs the app in the development mode.
- npm run dev: Runs the app with nodemon for automatic restarting during development.
- npm test: Launches the test runner.
  
## API Endpoints

For detailed information on the API endpoints, refer to the API Documentation

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/36341181-62510112-72d1-4c03-b94b-6354265c3a79?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D36341181-62510112-72d1-4c03-b94b-6354265c3a79%26entityType%3Dcollection%26workspaceId%3D126e163f-8852-4ace-8684-3a03f05d0f9f#?env%5Bserver%5D=W3sia2V5Ijoic2VydmVyIiwidmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL3YxIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXBpL3YxIiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6Ik1FUk4tQmxvZyIsInZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL01lcm4tQmxvZy9hcGkvdjEvdXNlciIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL01lcm4tQmxvZy9hcGkvdjEiLCJzZXNzaW9uSW5kZXgiOjF9XQ==)

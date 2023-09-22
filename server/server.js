if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: __dirname + '/.env' });
}
//import depencies
const express = require("express");
const connection = require("./config/connection");
const controller = require("./controllers/usersController");
const postController = require("./controllers/postsController");
const commentController = require("./controllers/commentsController");
const cors = require("cors");
const upload = require("./middleware/uploader");
const bodyParser = require('body-parser');

//create app of express
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*"
}));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://wepostnow.vercel.app/");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
})
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

connection();


app.post("/signup", upload.single('profileImg'), controller.createUser);
app.post("/fetch-user", controller.fetchUser);
app.post("/login", controller.login);
app.get("/logout", controller.logout);
app.get("/profile/:id", controller.viewProfile);
app.post("/search-user", controller.searchUser);
app.post("/update-profile", upload.single('profileImg'), controller.updateProfile);


app.post("/create-post", postController.createPost);
app.post("/posts", postController.fetchAllPosts);

app.post("/create-comment", commentController.createComment);
app.post("/fetch-comments", commentController.fetchComments);

app.listen(port);

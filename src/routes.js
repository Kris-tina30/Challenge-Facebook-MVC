const express = require('express');
const router = express.Router();
const postController = require('./controllers/postController');

// post
router.get('/', postController.homePage);
router.post('/add-post', postController.addPost);
router.get('/post/:id', postController.getPost);
router.get('/delete-post/:id', postController.deletePost);
router.get('/edit/:id', postController.getEditPost);
router.post('/edit/:id', postController.editPost);

//comment
router.post('/add-comment/:postId', postController.addComment);

module.exports = router;

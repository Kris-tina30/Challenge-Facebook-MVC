const express = require('express');
const router = express.Router();
const postController = require('./controllers/postController');

// post
router.get('/', postController.homePage);
router.post('/add-post', postController.addFeed);
router.get('/post/:id', postController.getFeed);
router.get('/delete-post/:id', postController.deleteFeed);
router.get('/edit/:id', postController.getEditFeed);
router.post('/edit/:id', postController.editFeed);

//comment
router.post('/add-comment/:postId', postController.addComment);

module.exports = router;

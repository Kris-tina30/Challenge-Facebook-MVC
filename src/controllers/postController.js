const Post = require('../models/posts');
const Comment = require('../models/commentModel');

const getFormattedPosts = () => {
  return Post.find()
    .sort({ createdAt: -1 })
    .populate('comments', '_id userComment')
    .then((result) => {
      return result.map((post) => ({
        ...post._doc,

        createdAt: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(post.createdAt),
      }));
    });
};

const homePage = (req, res) => {
  getFormattedPosts()
    .then((formattedData) => {
      res.render('index', { data: formattedData || [], errors: '' });
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
    });
};

const addPost = (req, res) => {
  const addNewPost = new Post(req.body);

  addNewPost
    .save()
    .then(() => {
      res.redirect('/feed');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return getFormattedPosts().then((formattedData) => {
          res.render('index', { data: formattedData, errors: err.errors });
        });
      }
      res.status(500).send('Internal Server Error');
    });
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'comments',
      '_id userComment',
    );

    if (!post) {
      return res.status(404).send('Post not found');
    }

    const formattedPost = {
      ...post._doc,
      createdAt: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(post.createdAt),
    };

    res.render('post', { post: formattedPost });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const deletePost = (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/feed');
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEditPost = (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.render('postEdit', { post, errors: {} });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
};

const editPost = (req, res) => {
  Post.findByIdAndUpdate(req.params.id, {
    userName: req.body.userName,
    userMessage: req.body.userMessage,
  })
    .then(() => {
      res.redirect(`/feed/post/${req.params.id}`);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error updating post');
    });
};

const addComment = (req, res) => {
  let postId = req.params.postId;
  if (req.body.userComment !== '' && postId) {
    let commentData = {
      ...req.body,
      post: postId,
    };
    const addNewComment = new Comment(commentData);

    addNewComment
      .save()
      .then((savedComment) => {
        Post.findById(postId)
          .then((postInfo) => {
            console.log(postInfo);
            postInfo.comments.push(savedComment._id);
            postInfo
              .save()
              .then(() => {
                res.redirect('/feed');
              })
              .catch((err) => {
                console.log(err);
              });
          })

          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

const notFoundPage = (req, res) => {};

module.exports = {
  getFormattedPosts,
  homePage,
  addPost,
  getPost,
  deletePost,
  getEditPost,
  editPost,
  addComment,
  notFoundPage,
};

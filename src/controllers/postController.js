const Feed = require('../models/feedModel');
const Comment = require('../models/commentModel');

const getFormattedFeeds = () => {
  return Feed.find()
    .sort({ createdAt: -1 })
    .populate('comments', '_id userComment')
    .then((result) => {
      return result.map((feed) => ({
        ...feed._doc,

        createdAt: new Intl.DateTimeFormat('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }).format(feed.createdAt),
      }));
    });
};

const homePage = (req, res) => {
  getFormattedFeeds()
    .then((formattedData) => {
      res.render('index', { data: formattedData || [], errors: '' });
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
    });
};

const addFeed = (req, res) => {
  const addNewFeed = new Feed(req.body);

  addNewFeed
    .save()
    .then(() => {
      res.redirect('/feed');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return getFormattedFeeds().then((formattedData) => {
          res.render('index', { data: formattedData, errors: err.errors });
        });
      }
      res.status(500).send('Internal Server Error');
    });
};

const getFeed = async (req, res) => {
  try {
    const post = await Feed.findById(req.params.id).populate(
      'comments',
      '_id userComment',
    );

    if (!post) {
      return res.status(404).send('Post not found');
    }

    const formattedFeed = {
      ...post._doc,
      createdAt: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(post.createdAt),
    };

    res.render('feed', { feed: formattedFeed });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

const deleteFeed = (req, res) => {
  Feed.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect('/feed');
    })
    .catch((err) => {
      console.log(err);
    });
};

const getEditFeed = (req, res) => {
  Feed.findById(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.render('postEdit', { feed: post, errors: {} });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
};

const editFeed = (req, res) => {
  Feed.findByIdAndUpdate(
    req.params.id,
    {
      userName: req.body.userName,
      userMessage: req.body.userMessage,
    },
    { runValidators: true, new: true },
  )
    .then(() => {
      res.redirect(`/feed/post/${req.params.id}`);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        Feed.findById(req.params.id)
          .then((post) => {
            if (!post) {
              return res.status(404).send('Post not found');
            }
            res.render('postEdit', {
              feed: post,
              errors: err.errors,
            });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
          });
      } else {
        console.error(err);
        res.status(500).send('Error updating post');
      }
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
        Feed.findById(postId)
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
  getFormattedFeeds,
  homePage,
  addFeed,
  getFeed,
  deleteFeed,
  getEditFeed,
  editFeed,
  addComment,
  notFoundPage,
};

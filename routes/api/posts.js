const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
//const multer = require('multer');
//const shortid = require('shortid');
const path = require('path');
const config = require('config');

const User = require('../../models/User');
const Post = require('../../models/Post');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.dirname(path.dirname(__dirname)), 'uploads'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, shortid.generate() + '-' + file.originalname);
//     }
// });

//const upload = multer({ storage: storage });

mongoose.set('useFindAndModify', false);

// @route    POST api/posts
// @desc     Create a post
// @access   Private

router.post(
    '/',
    auth,
    // upload.single('postImage'),
    check('title', 'Title cannot be empty').not().isEmpty(),
    check('text', 'Text cannot be empty').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).lean();

            let newPost = new Post({
                title: req.body.title,
                text: req.body.text,
                user: req.user.id,
                username: user.username,
                avatar: user.avatar
            });

            let image;
            if (req.file) {
                image = config.get('API') + '/public/' + req.file.filename;
            }

            if (user.name) newPost.name = user.name;
            newPost.image = image;

            newPost = await newPost.save();
            res.json(newPost);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private

router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 }).lean();
        res.json(posts);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private

router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).lean();

        if (!post) return res.status(404).json({ msg: 'Post not found' });

        res.json(post);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private

router.delete('/:id', auth, async (req, res) => {
    try {
        // Check user
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Post successfully deleted' });
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        // Get remove index
        const removeIndex = post.likes
            .map((like) => like.user.toString())
            .indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private

router.post(
    '/comment/:id',
    auth,
    check('text', 'Text cannot be empty').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).lean();
            const post = await Post.findById(req.params.id);

            let newComment = {
                text: req.body.text,
                user: req.user.id,
                username: user.username,
                avatar: user.avatar
            };

            if (user.name) newPost.name = user.name;

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        } catch (err) {
            console.log(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        // Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Get remove index
        const removeIndex = post.comments
            .map((comment) => comment.user.toString())
            .indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error');
    }
});

// Update posts

// Update comment

module.exports = router;

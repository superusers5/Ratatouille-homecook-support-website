const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Shop = require('../../models/Shop');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

mongoose.set('useFindAndModify', false);

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).lean();

        if (!profile) {
            return res
                .status(400)
                .json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/profile
// @desc     Create or update user profile
// @access   Private

router.post(
    '/',
    check('username', 'Username is required'),
    auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array });
        }

        const {
            name,
            city,
            state,
            country,
            about,
            cuisines,
            specialities,
            youtube,
            facebook,
            instagram,
            twitter
        } = req.body;

        let user = await User.findById(req.user.id).lean();

        // Build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        profileFields.username = user.username;
        if (name) profileFields.name = name;
        if (city) profileFields.city = city;
        if (state) profileFields.state = state;
        if (country) profileFields.country = country;
        if (about) profileFields.about = about;
        if (cuisines)
            profileFields.cuisines = cuisines
                .split(',')
                .map((cuisine) => cuisine.trim());
        if (specialities)
            profileFields.specialities = specialities
                .split(',')
                .map((speciality) => speciality.trim());
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (facebook) profileFields.social.facebook = facebook;
        if (instagram) profileFields.social.instagram = instagram;
        if (twitter) profileFields.social.twitter = twitter;

        try {
            let profile = await Profile.findOne({ user: req.user.id }).lean();
            // Update
            if (profile) {
                profile = await Profile.findByIdAndUpdate(
                    profile._id,
                    {
                        $set: profileFields
                    },
                    { new: true }
                ).lean();

                return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/profile
// @desc     Get all profiles
// @access   Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().lean();
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user ID
// @access   Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).lean();

        if (!profile) return res.status(400).json({ msg: 'Profile not found' });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/profile
// @desc     Delete profile, shop, user & posts
// @access   Private

router.delete('/', auth, async (req, res) => {
    try {
        // @todo - remove users posts

        // Remove shop
        let user = await User.findById(req.user.id).lean();
        if (user.role === 'chef') {
            await Shop.findByIdAndDelete({
                _id: user.shop
            });
            // Remove dishes
            await Dish.deleteMany({ shop: user.shop });
        }

        // Remove profile
        await Profile.findOneAndDelete({ user: req.user.id });
        // Remove user
        await User.findByIdAndDelete({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

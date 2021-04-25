const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
//const multer = require('multer');
//const shortid = require('shortid');
const path = require('path');
const config = require('config');

const Shop = require('../../models/Shop');
const User = require('../../models/User');

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

// @route    POST api/shop/setup
// @desc     Register foodie as chef and setup shop
// @access   Private

router.post(
    '/setup',
    auth,
    // upload.array('shopImage'),
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('minOrderAmount', 'Minimum order amount is required').not().isEmpty(),
    check('costForOne', 'Cost for one is required').not().isEmpty(),
    check('tags', 'Tags are required').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Get user and make him a chef
            const userID = req.user.id;
            await User.findOneAndUpdate(
                { _id: userID },
                { $set: { role: 'chef' } }
            );

            const {
                name,
                address,
                description,
                minOrderAmount,
                costForOne,
                tags
            } = req.body;

            let images = [];
            if (req.files.length > 0) {
                images = req.files.map((file) => {
                    return config.get('API') + '/public/' + file.filename;
                });
            }

            //Build shop object
            let shopFields = {};
            shopFields.chef = userID;
            shopFields.name = name;
            shopFields.address = address;
            shopFields.description = description;
            shopFields.minOrderAmount = minOrderAmount;
            shopFields.costForOne = costForOne;
            shopFields.images = images;
            shopFields.tags = tags
                .split(',')
                .map((tag) => tag.trim().toLowerCase());

            //Create
            let shop = await Shop.findOne({ chef: req.user.id }).lean();
            if (shop) {
                return res.status(400).json({ msg: 'Chef already has a shop' });
            }

            shop = new Shop(shopFields);

            shop = await shop.save();

            await User.findOneAndUpdate(
                { _id: userID },
                { $set: { shop: shop._id } }
            );

            res.json(shop);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);
// @route    GET api/shop/me
// @desc     Get current chefs shop
// @access   Private

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.id }).lean();
        if (user.role !== 'chef') {
            return res.status(400).json({ msg: 'User is not a chef' });
        }

        const shop = await Shop.findOne({ _id: user.shop }).lean();
        if (!shop) {
            return res
                .status(400)
                .json({ msg: 'There is no shop for this chef' });
        }

        res.json(shop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/shop
// @desc     Update chefs shop
// @access   Private

router.post(
    '/',
    auth,
    // upload.array('shopImage'),
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('minOrderAmount', 'Minimum order amount is required').not().isEmpty(),
    check('costForOne', 'Cost for one is required').not().isEmpty(),
    check('tags', 'Tags are required').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            name,
            address,
            description,
            minOrderAmount,
            costForOne,
            tags
        } = req.body;

        let images = [];
        if (req.files.length > 0) {
            images = req.files.map((file) => {
                return config.get('API') + '/public/' + file.filename;
            });
        }

        //Build shop object
        let shopFields = {};
        shopFields.chef = req.user.id;
        shopFields.name = name;
        shopFields.address = address;
        shopFields.description = description;
        shopFields.minOrderAmount = minOrderAmount;
        shopFields.costForOne = costForOne;
        shopFields.images = images;
        shopFields.tags = tags.split(',').map((tag) => tag.trim());

        // Update
        try {
            shop = await Shop.findOneAndUpdate(
                { chef: req.user.id },
                { $set: shopFields },
                { new: true }
            ).lean();

            return res.json(shop);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/shop
// @desc     Get all shops
// @access   Public

router.get('/', async (req, res) => {
    try {
        const shops = await Shop.find().lean();
        res.json(shops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/shop/chef/:chef_id
// @desc     Get shop by chef ID
// @access   Public

router.get('/chef/:chef_id', async (req, res) => {
    try {
        const shop = await Shop.findOne({ chef: req.params.chef_id }).lean();

        if (!shop) return res.status(400).json({ msg: 'Shop not found' });

        res.json(shop);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Shop not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    GET api/shop/:shop_id
// @desc     Get shop by shop ID
// @access   Public

router.get('/:shop_id', async (req, res) => {
    try {
        const shop = await Shop.findOne({ _id: req.params.shop_id }).lean();

        if (!shop) return res.status(400).json({ msg: 'Shop not found' });

        res.json(shop);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Shop not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route    DELETE api/shop
// @desc     Delete shop and convert chef to foodie
// @access   Private

router.delete('/', auth, async (req, res) => {
    try {
        let user = await findById(req.user.id).lean();
        // Remove shop
        await Shop.findByIdAndDelete(user.shop);
        // Remove dishes
        await Dish.deleteMany({ shop: user.shop });
        // Remove chef
        await User.findByIdAndUpdate(req.user.id, { role: 'foodie' });

        res.json({ msg: 'Shop deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

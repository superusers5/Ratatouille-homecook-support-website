const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
//const multer = require('multer');
//const shortid = require('shortid');
const path = require('path');
const config = require('config');

const Dish = require('../../models/Dish');
const User = require('../../models/User');
const Shop = require('../../models/Shop');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.dirname(path.dirname(__dirname)), 'uploads'));
//     },
//     filename: function (req, file, cb) {
//         cb(null, shortid.generate() + '-' + file.originalname);
//     }
// });

// const upload = multer({ storage: storage });

mongoose.set('useFindAndModify', false);

// @route    POST api/dish/add
// @desc     Add dish
// @access   Private

router.post(
    '/add',
    auth,
    // upload.single('dishImage'),
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('tags', 'Tags are required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('veg', 'Vegetarian field is required').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            console.log('/add');
            const user = await User.findById(req.user.id).lean();

            let {
                name,
                description,
                tags,
                price,
                category,
                veg,
                subcategory,
                discount
            } = req.body;

            let image;
            if (req.file) {
                image = config.get('API') + '/public/' + req.file.filename;
            }

            if (discount && (discount < 0 || discount > 100)) {
                return res
                    .status(400)
                    .json({ msg: 'Discount should be between 0 and 100' });
            }

            name = name.toLowerCase();
            category = category.toLowerCase();
            if (subcategory) subcategory = req.body.subcategory.toLowerCase();

            // Check if dish already exists
            let dish;
            if (subcategory) {
                dish = await Dish.findOne({
                    shop: user.shop,
                    name: name,
                    category: category,
                    subcategory: subcategory,
                    price: price
                }).lean();

                if (dish)
                    return res.status(400).json({
                        msg:
                            'Dish already exists under the mentioned category and subcategory'
                    });
            } else {
                dish = await Dish.findOne({
                    shop: user.shop,
                    name: name,
                    category: category,
                    price: price
                }).lean();

                if (dish)
                    return res.status(400).json({
                        msg: 'Dish already exists under the mentioned category'
                    });
            }

            // Build dish object
            let dishFields = {};
            dishFields.name = name;
            dishFields.description = description;
            dishFields.chef = req.user.id;
            dishFields.shop = user.shop;
            dishFields.tags = tags
                .split(',')
                .map((tag) => tag.trim().toLowerCase());
            dishFields.price = price;
            dishFields.veg = veg;
            dishFields.category = category;
            dishFields.subcategory = subcategory;
            dishFields.image = image;
            dishFields.discount = discount;

            // Create and save
            dish = new Dish(dishFields);
            dish = await dish.save();

            await Shop.findByIdAndUpdate(user.shop, {
                $push: {
                    dishes: dish
                }
            });
            res.json(dish);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/dish/delete/:dish_id
// @desc     Delete dish
// @access   Private

router.delete('/delete/:dish_id', auth, async (req, res) => {
    try {
        console.log('/delete');
        const dish = await Dish.findByIdAndDelete(req.params.dish_id).lean();

        if (!dish) return res.status(400).json({ msg: 'Dish not found' });

        await Shop.findByIdAndUpdate(dish.shop, {
            $pull: { dishes: dish._id }
        });

        res.json({ msg: 'Successfully deleted item' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/dish/:dish_id
// @desc     Get dish
// @access   Private

router.get('/:dish_id', auth, async (req, res) => {
    try {
        console.log('/dish/:dish_id');
        const dish = await Dish.findById(
            req.params.dish_id,
            'name price description tags category subcategory veg'
        ).lean();

        if (!dish) return res.status(400).json({ msg: 'Dish not found' });

        res.json(dish);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/dish/update/:dish_id
// @desc     Update dish
// @access   Private

router.put(
    '/update/:dish_id',
    auth,
    // upload.single('dishImage'),
    check('name', 'Name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('tags', 'Tags are required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('veg', 'Vegetarian field is required').not().isEmpty(),
    check('discount', 'discount should be between 0 and 100').isFloat({
        min: 0,
        max: 100
    }),
    async (req, res) => {
        try {
            let dish = await Dish.findById(req.params.dish_id);

            if (!dish) return res.status(400).json({ msg: 'Dish not found' });

            const user = await User.findById(req.user.id).lean();

            let {
                name,
                description,
                tags,
                price,
                category,
                veg,
                subcategory,
                discount
            } = req.body;

            let image;
            if (req.file) {
                image = config.get('API') + '/public/' + req.file.filename;
            }

            name = name.toLowerCase();
            category = category.toLowerCase();
            if (subcategory) subcategory = req.body.subcategory.toLowerCase();

            // Check if dish already exists
            let flag;
            if (subcategory) {
                flag = await Dish.findOne({
                    shop: user.shop,
                    name: name,
                    category: category,
                    subcategory: subcategory,
                    price: price
                }).lean();

                if (flag)
                    return res.status(400).json({
                        msg:
                            'Dish already exists under the mentioned category and subcategory'
                    });
            } else {
                flag = await Dish.findOne({
                    shop: user.shop,
                    name: name,
                    category: category,
                    price: price
                }).lean();

                if (flag)
                    return res.status(400).json({
                        msg: 'Dish already exists under the mentioned category'
                    });
            }

            dish.name = name;
            dish.description = description;
            dish.chef = req.user.id;
            dish.shop = user.shop;
            dish.tags = tags.split(',').map((tag) => tag.trim().toLowerCase());
            dish.price = price;
            dish.veg = veg;
            dish.category = category;
            dish.subcategory = subcategory;
            dish.image = image;
            dish.discount = discount;

            // Create and save
            dish = await dish.save();

            res.json(dish);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    Get api/dish/
// @desc     Get all dishes
// @access   Private

router.get('/', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).lean();

        let dishes = await Shop.findById(user.shop, 'dishes').populate(
            'dishes'
        );

        res.json(dishes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

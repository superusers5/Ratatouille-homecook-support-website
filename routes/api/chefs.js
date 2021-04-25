const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');

const User = require('../../models/User');
mongoose.set('useFindAndModify', false);

// @route    POST api/chefs
// @desc     Register foodie as chef and setup a shop
// @access   Private

router.post(
    '/',
    auth,
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Get user and make him a chef
            const userID = req.user.id;
            let user = await User.findOneAndUpdate(
                { _id: userID },
                { $set: { chef: true } }
            );

            const { name, address, description, photo, cuisines } = req.body;

            //Build shop object
            let shopFields = {};
            shopFields.chef = userID;
            shopFields.name = name;
            shopFields.address = address;
            if (description) shopFields.description = description;
            if (photo) shopFields.photo = photo;
            if (cuisines) {
                shopFields.cuisines = cuisines
                    .split(',')
                    .map((cuisine) => cuisine.trim());
            }

            //Create
            let shop = await Shop.findOne({ chef: req.user.id });
            if (shop) {
                return res.status(400).json({ msg: 'Chef already has a shop' });
            }

            shop = new Shop(shopFields);

            await shop.save();

            shop = await Shop.findOne({ chef: req.user.id });

            user = await User.findOneAndUpdate(
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

module.exports = router;

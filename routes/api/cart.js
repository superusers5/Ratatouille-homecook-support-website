const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');

const User = require('../../models/User');
const Dish = require('../../models/Dish');

mongoose.set('useFindAndModify', false);

// @route    POST api/cart
// @desc     Add dish to cart
// @access   Private

router.post('/', auth, async (req, res) => {
    try {
        const dishId = req.body.dishId;

        if (!dishId) {
            return res.status(400).json({ msg: 'Dish not provided' });
        }

        const dish = await Dish.findById(dishId).lean();

        if (!dish) {
            return res.status(400).json({ msg: 'Dish not found' });
        }

        const user = await User.findById(req.user.id);
        user.addToCart(dish);

        res.status(200).json({ msg: 'Dish added to cart successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/cart
// @desc     Get cart
// @access   Private

router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('cart.dish')
            .lean();

        const cart = user.cart;
        let totalPrice = 0;

        cart.forEach((cartItem) => {
            totalPrice += cartItem.quantity * cartItem.dish.price;
        });

        res.json({ cart: cart, totalPrice: totalPrice });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/cart/delete-dish
// @desc     Delete dish from cart
// @access   Private

router.post('/delete-dish', auth, async (req, res) => {
    try {
        const dishId = req.body.dishId;

        if (!dishId) {
            return res.status(400).json({ msg: 'Dish not provided' });
        }

        const user = await User.findById(req.user.id);
        user.removeFromCart(dishId);

        res.status(200).json({ msg: 'Item successfully removed from cart' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/cart/remove-dish/:dishId
// @desc     Remove dish from cart
// @access   Private

router.post('/remove-dish/:dishId', auth, async (req, res) => {
    try {
        const dishId = req.params.dishId;

        if (!dishId) {
            return res.status(400).json({ msg: 'Dish not provided' });
        }

        const user = await User.findById(req.user.id);
        user.reduceQuantity(dishId);

        res.status(200).json({ msg: 'Item successfully updated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/cart/clear
// @desc     Clear cart
// @access   Private

router.post('/clear', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.clearCart();
        res.status(200).json({ msg: 'Cart cleared' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

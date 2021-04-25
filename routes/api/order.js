const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');

const Order = require('../../models/Order');
const User = require('../../models/User');

mongoose.set('useFindAndModify', false);

// @route    POST api/order
// @desc     Place order
// @access   Private

router.post('/', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id).populate('cart.dish');

        const shops = user.cart.reduce((accumulator, cartItem) => {
            if (!accumulator[cartItem.dish.shop])
                accumulator[cartItem.dish.shop] = [];

            accumulator[cartItem.dish.shop].push(cartItem);
            return accumulator;
        }, {});

        let orders = [];
        for (let [shop, cartItems] of Object.entries(shops)) {
            let totalAmount = 0;
            cartItems.forEach((item) => {
                totalAmount += item.quantity * item.dish.price;
            });

            let order = new Order({
                user: req.user.id,
                shop: shop,
                totalAmount: totalAmount,
                dishes: cartItems,
                paymentStatus: 'successful',
                paymentType: req.body.paymentType,
                orderStatus: 'placed'
            });

            order = await order.save();
            orders.push(order);
        }

        user.clearCart();

        res.status(200).json({ orders });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/order/me
// @desc     Get user's orders
// @access   Private

router.get('/me', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .sort({
                createdAt: -1
            })
            .lean();

        res.status(200).json({ orders });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/order/shop
// @desc     Get shop's orders
// @access   Private

router.get('/shop', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).lean();
        const orders = await Order.find({ shop: user.shop })
            .sort({
                createdAt: -1
            })
            .lean();

        res.status(200).json({ orders });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/order/status/:order_id
// @desc     Update order status
// @access   Private

router.post('/status-update/:order_id', auth, async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const status = req.body.status;

        if (!req.body.status) {
            return res.status(400).json({ msg: 'Status not provided' });
        }

        let order = await Order.findById(orderId).lean();

        if (!order) {
            return res.status(400).json({ msg: 'Order does not exist' });
        }

        order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus: status },
            { new: true }
        ).lean();

        res.status(200).json({ order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/order/payment-update/:order_id
// @desc     Update payment status
// @access   Private

router.get('/payment-update/:order_id', auth, async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const status = req.body.status;

        if (!req.body.status) {
            return res.status(400).json({ msg: 'Status not provided' });
        }

        let order = await Order.findById(orderId).lean();

        if (!order) {
            return res.status(400).json({ msg: 'Order does not exist' });
        }

        order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus: status },
            { new: true }
        ).lean();

        res.status(200).json({ order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

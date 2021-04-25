const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

// @route    POST api/users
// @desc     Register Foodie
// @access   Public

router.post(
    '/',
    check('email', 'Please Include a valid email').isEmail(),
    check(
        'password',
        'Please Enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check(
        'username',
        'Please choose a username with 3 or more characters'
    ).isLength({ min: 3 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role } = req.body;
        try {
            //see if foodie exists
            let foodie = await User.findOne({ email }).lean();
            if (foodie) {
                return res
                    .status(400)
                    .json({ errors: ['User already exists'] });
            }

            foodie = await User.findOne({ username }).lean();
            if (foodie) {
                return res
                    .status(400)
                    .json({ errors: ['Username already exists'] });
            }

            //get foodie gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });

            foodie = new User({
                username,
                email,
                avatar,
                password,
                role
            });

            //Encrypt password
            const salt = await bcrypt.genSalt(10);

            foodie.password = await bcrypt.hash(password, salt);

            await foodie.save();

            const payload = {
                user: {
                    id: foodie.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;

const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema(
    {
        chef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        name: {
            type: String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true,
            required: true
        },
        address: {
            type: String,
            trim: true,
            required: true
        },
        images: [
            {
                type: String
            }
        ],
        tags: {
            type: [String],
            required: true
        },
        minOrderAmount: {
            type: Number,
            required: true
        },
        costForOne: {
            type: Number,
            required: true
        },
        dishes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'dish'
            }
        ]
    },
    { timestamps: true }
);

module.exports = Shop = mongoose.model('shop', ShopSchema);

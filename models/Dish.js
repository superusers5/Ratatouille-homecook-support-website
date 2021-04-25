const mongoose = require('mongoose');

const DishSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            //required: true
        },
        description: {
            type: String,
            trim: true
        },
        Chef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            //required: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops',
            //required: true
        },
        tags: {
            type: [String],
            //required: true
        },
        image: {
            type: String
        },
        price: {
            type: Number,
            //required: true
        },
        category: {
            type: String,
            trim: true,
            //required: true
        },
        subcategory: {
            type: String,
            trim: true
        },
        discount: {
            type: Number
        },
        veg: {
            type: Boolean,
            //required: true
        }
    },
    { timestamps: true }
);

module.exports = Dish = mongoose.model('dish', DishSchema);

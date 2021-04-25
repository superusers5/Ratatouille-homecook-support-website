const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['foodie', 'chef', 'admin'],
            default: 'foodie',
            //required: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops'
        },
        cart: [
            {
                dish: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'dish',
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ]
    },
    { timestamps: true }
);

UserSchema.methods.addToCart = function (dish) {
    const cartItemIndex = this.cart.findIndex((cartItem) => {
        return cartItem.dish.toString() === dish._id.toString();
    });

    //const updatedCartItems = [...this.cart];

    if (cartItemIndex >= 0) {
        this.cart[cartItemIndex].quantity++;
        //updatedCartItems[cartItemIndex].quantity++;
    } else {
        this.cart.push({
            dish: dish._id,
            quantity: 1
        });
        //updatedCartItems.push({
        //dish: dish._id,
        //quantity: 1
        //});
    }

    //this.cart = updatedCartItems;
    return this.save();
};

UserSchema.methods.reduceQuantity = function (dishId) {
    this.cart.forEach(function (cartItem, i, cartItems) {
        if (cartItem.dish.toString() === dishId.toString())
            cartItems[i].quantity--;
    });

    this.cart = this.cart.filter((cartItem) => {
        return cartItem.quantity > 0;
    });

    return this.save();
};

UserSchema.methods.removeFromCart = function (dishId) {
    this.cart = this.cart.filter((cartItem) => {
        return cartItem.dish.toString() !== dishId.toString();
    });

    return this.save();
};

UserSchema.methods.clearCart = function () {
    this.cart = [];
    return this.save();
};

module.exports = User = mongoose.model('user', UserSchema);

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        shop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'shops',
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        dishes: [
            {
                dish: {
                    type: Object,
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        paymentStatus: {
            type: String,
            enum: ['pending', 'successful', 'cancelled', 'refunded'],
            default: 'pending',
            required: true
        },
        paymentType: {
            type: String,
            enum: ['cash', 'credit-card', 'e-wallet', 'upi', 'debit-card'],
            required: true
        },
        orderStatus: {
            type: String,
            enum: ['placed', 'accepted', 'ready', 'cancelled'],
            default: 'pending',
            required: true
        }
    },
    { timestamps: true }
);

module.exports = Order = mongoose.model('order', OrderSchema);

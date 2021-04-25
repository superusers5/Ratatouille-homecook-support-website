const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        name: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true,
            required: true
        },
        city: {
            type: String,
            trim: true
        },
        state: {
            type: String,
            trim: true
        },
        country: {
            type: String,
            trim: true
        },
        about: {
            type: String,
            trim: true
        },
        cuisines: {
            type: [String]
        },
        specialities: {
            type: [String]
        },
        social: {
            youtube: {
                type: String,
                trim: true
            },
            twitter: {
                type: String,
                trim: true
            },
            facebook: {
                type: String,
                trim: true
            },
            instagram: {
                type: String,
                trim: true
            }
        }
    },
    { timestamps: true }
);

module.exports = Profile = mongoose.model('profile', ProfileSchema);

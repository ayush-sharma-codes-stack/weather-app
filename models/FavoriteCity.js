const mongoose = require('mongoose');

const FavoriteCitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cityName: {
        type: String,
        required: true
    },
    country: {
        type: String
    },
    lat: {
        type: Number
    },
    lon: {
        type: Number
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FavoriteCity', FavoriteCitySchema);

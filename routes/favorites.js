const express = require('express');
const router = express.Router();
const FavoriteCity = require('../models/FavoriteCity');
const SearchHistory = require('../models/SearchHistory');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/favorites
// @desc    Get all favorite cities for user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const favorites = await FavoriteCity.find({ user: req.user.id }).sort('order');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/favorites
// @desc    Add a favorite city
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { cityName, country, lat, lon } = req.body;

        // Check if already exists
        const exists = await FavoriteCity.findOne({ user: req.user.id, cityName });
        if (exists) {
            return res.status(400).json({ message: 'City already in favorites' });
        }

        const newFavorite = await FavoriteCity.create({
            user: req.user.id,
            cityName,
            country,
            lat,
            lon
        });

        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/favorites/:id
// @desc    Remove a favorite city
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const favorite = await FavoriteCity.findById(req.params.id);

        if (!favorite) {
            return res.status(404).json({ message: 'Favorite not found' });
        }

        if (favorite.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await favorite.deleteOne();
        res.json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/favorites/history
// @desc    Get last 10 searched cities
// @access  Private
router.get('/history', protect, async (req, res) => {
    try {
        const history = await SearchHistory.find({ user: req.user.id })
            .sort({ searchedAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

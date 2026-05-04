const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');
const rateLimit = require('express-rate-limit');
const SearchHistory = require('../models/SearchHistory');
const { protect } = require('../middleware/authMiddleware');

// Initialize cache (10 minutes)
const cache = new NodeCache({ stdTTL: 600 });

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiter to all weather routes
router.use(limiter);

// OpenWeather API Base URL
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

// Helper to log search history if user is logged in
const logSearchHistory = async (req, query) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            const jwt = require('jsonwebtoken');
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.id) {
                await SearchHistory.create({
                    user: decoded.id,
                    query: query
                });
            }
        } catch (error) {
            // Ignore auth errors for logging history
        }
    }
};

// @route   GET /api/weather/current
// @desc    Get current weather by city
// @access  Public
router.get('/current', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ message: 'City is required' });

        const cacheKey = `current_${city.toLowerCase()}`;
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey));
        }

        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        cache.set(cacheKey, response.data);
        await logSearchHistory(req, city);

        res.json(response.data);
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// @route   GET /api/weather/forecast
// @desc    Get 5-day forecast by city
// @access  Public
router.get('/forecast', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) return res.status(400).json({ message: 'City is required' });

        const cacheKey = `forecast_${city.toLowerCase()}`;
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey));
        }

        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                q: city,
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric'
            }
        });

        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forecast data' });
    }
});

// @route   GET /api/weather/onecall
// @desc    Get onecall data (hourly, alerts)
// @access  Public
router.get('/onecall', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) return res.status(400).json({ message: 'Latitude and Longitude are required' });

        const cacheKey = `onecall_${lat}_${lon}`;
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey));
        }

        // OpenWeather One Call API 3.0 requires subscription. Using fallback or free APIs if needed.
        // Assuming user has 3.0 access or we fallback.
        const response = await axios.get(`https://api.openweathermap.org/data/3.0/onecall`, {
            params: {
                lat,
                lon,
                exclude: 'minutely',
                appid: process.env.OPENWEATHER_API_KEY,
                units: 'metric'
            }
        }).catch(async () => {
            // Fallback for free tier without onecall access
            return { data: { message: "OneCall API requires subscription" }};
        });

        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching onecall data' });
    }
});

// @route   GET /api/weather/aqi
// @desc    Get air quality index
// @access  Public
router.get('/aqi', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) return res.status(400).json({ message: 'Latitude and Longitude are required' });

        const cacheKey = `aqi_${lat}_${lon}`;
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey));
        }

        const response = await axios.get(`${BASE_URL}/air_pollution`, {
            params: {
                lat,
                lon,
                appid: process.env.OPENWEATHER_API_KEY
            }
        });

        cache.set(cacheKey, response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching air quality data' });
    }
});

// @route   GET /api/weather/unsplash
// @desc    Get background image from Unsplash based on weather
// @access  Public
router.get('/unsplash', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const cacheKey = `img_${query}`;
        if (cache.has(cacheKey)) {
            return res.json(cache.get(cacheKey));
        }

        const response = await axios.get(`https://api.unsplash.com/photos/random`, {
            params: {
                query: `${query} weather`,
                orientation: 'landscape'
            },
            headers: {
                Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });

        const imgData = { url: response.data.urls.regular, author: response.data.user.name };
        cache.set(cacheKey, imgData, 3600); // cache image for 1 hr
        res.json(imgData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching image' });
    }
});

module.exports = router;

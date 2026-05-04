import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
    const { api } = useContext(AuthContext);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [oneCall, setOneCall] = useState(null);
    const [aqi, setAqi] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = process.env.NODE_ENV === 'production' ? '/api/weather' : 'http://localhost:5000/api/weather';

    const fetchWeather = async (city) => {
        setLoading(true);
        setError(null);
        try {
            // Get current weather
            const currentRes = await axios.get(`${API_URL}/current?city=${city}`);
            setCurrentWeather(currentRes.data);

            // Get forecast
            const forecastRes = await axios.get(`${API_URL}/forecast?city=${city}`);
            setForecast(forecastRes.data);

            const { coord } = currentRes.data;
            
            // Get one call (might fail without subscription, but we try)
            try {
                const oneCallRes = await axios.get(`${API_URL}/onecall?lat=${coord.lat}&lon=${coord.lon}`);
                setOneCall(oneCallRes.data);
            } catch (err) {
                console.log("OneCall fetch error", err);
            }

            // Get AQI
            try {
                const aqiRes = await axios.get(`${API_URL}/aqi?lat=${coord.lat}&lon=${coord.lon}`);
                setAqi(aqiRes.data);
            } catch (err) {
                console.log("AQI fetch error", err);
            }

            // Update background
            try {
                const weatherCondition = currentRes.data.weather[0].main;
                const bgRes = await axios.get(`${API_URL}/unsplash?query=${weatherCondition}`);
                if (bgRes.data?.url) {
                    document.getElementById('dynamic-bg').style.backgroundImage = `url(${bgRes.data.url})`;
                }
            } catch (err) {
                console.log("Bg fetch error", err);
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch weather data');
        } finally {
            setLoading(false);
        }
    };

    return (
        <WeatherContext.Provider value={{
            currentWeather, forecast, oneCall, aqi, loading, error, fetchWeather
        }}>
            {children}
        </WeatherContext.Provider>
    );
};

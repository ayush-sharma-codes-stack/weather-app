import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { WeatherContext } from '../context/WeatherContext';
import { motion } from 'framer-motion';
import { Star, StarOff, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FavoriteCities = () => {
    const { user, api } = useContext(AuthContext);
    const { currentWeather, fetchWeather } = useContext(WeatherContext);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavs, setLoadingFavs] = useState(false);

    useEffect(() => {
        if (user) {
            loadFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    const loadFavorites = async () => {
        try {
            const res = await api.get('/favorites');
            setFavorites(res.data);
        } catch (error) {
            console.error("Error loading favorites", error);
        }
    };

    const isCurrentFavorite = () => {
        if (!currentWeather) return false;
        return favorites.some(f => f.cityName.toLowerCase() === currentWeather.name.toLowerCase());
    };

    const toggleFavorite = async () => {
        if (!user) {
            toast.error("Please login to save favorite cities!");
            return;
        }

        if (!currentWeather) return;

        const city = currentWeather.name;
        
        try {
            setLoadingFavs(true);
            const existing = favorites.find(f => f.cityName.toLowerCase() === city.toLowerCase());
            
            if (existing) {
                // Remove
                await api.delete(`/favorites/${existing._id}`);
                setFavorites(favorites.filter(f => f._id !== existing._id));
                toast.success(`${city} removed from favorites`);
            } else {
                // Add
                const res = await api.post('/favorites', {
                    cityName: city,
                    country: currentWeather.sys.country,
                    lat: currentWeather.coord.lat,
                    lon: currentWeather.coord.lon
                });
                setFavorites([...favorites, res.data]);
                toast.success(`${city} added to favorites!`);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed");
        } finally {
            setLoadingFavs(false);
        }
    };

    const removeFavorite = async (e, id) => {
        e.stopPropagation();
        try {
            await api.delete(`/favorites/${id}`);
            setFavorites(favorites.filter(f => f._id !== id));
            toast.success('Removed');
        } catch (error) {
            toast.error('Failed to remove');
        }
    };

    return (
        <>
            {/* Star button to add current to favorites */}
            {currentWeather && (
                <button 
                    onClick={toggleFavorite}
                    disabled={loadingFavs}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: isCurrentFavorite() ? '#ffeb3b' : '#fff',
                        transition: 'all 0.3s'
                    }}
                >
                    {isCurrentFavorite() ? <Star fill="#ffeb3b" size={20} /> : <StarOff size={20} />}
                </button>
            )}

            {/* List of favorites */}
            {user && favorites.length > 0 && (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card" 
                    style={{ padding: '24px', marginTop: '24px' }}
                >
                    <h3 style={{ fontSize: '18px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        ⭐ Saved Locations
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {favorites.map((fav) => (
                            <div 
                                key={fav._id}
                                onClick={() => fetchWeather(fav.cityName)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 16px',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: '1px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.2)'}
                                onMouseLeave={(e) => e.currentTarget.style.border = '1px solid transparent'}
                            >
                                <span style={{ fontWeight: '500' }}>{fav.cityName}, {fav.country}</span>
                                <button 
                                    onClick={(e) => removeFavorite(e, fav._id)}
                                    style={{ background: 'transparent', border: 'none', color: '#ff5252', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default FavoriteCities;

import React, { useState, useContext } from 'react';
import { Search, MapPin } from 'lucide-react';
import { WeatherContext } from '../context/WeatherContext';

const SearchBar = () => {
    const [city, setCity] = useState('');
    const { fetchWeather } = useContext(WeatherContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            fetchWeather(city);
            setCity('');
        }
    };

    const handleLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                // Reverse geocode or just search by lat/lon if API supported.
                // For simplicity, using a fallback default or fetch by lat/lon directly 
                // in a real app you'd call a reverse geocode API here
                // let's just alert for now
                alert(`Location: ${latitude}, ${longitude}`);
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '500px', margin: '0 auto 30px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                    type="text" 
                    placeholder="Search city..." 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-glass)',
                        background: 'var(--bg-glass)',
                        color: 'var(--text-primary)',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)'
                    }}
                />
            </div>
            <button 
                type="button" 
                onClick={handleLocation}
                style={{
                    padding: '0 20px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-glass)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)'
                }}>
                <MapPin size={20} />
            </button>
        </form>
    );
};

export default SearchBar;

import React, { useContext, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherContext } from '../context/WeatherContext';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when location changes
function RecenterAutomatically({ lat, lon }) {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lon]);
    }, [lat, lon, map]);
    return null;
}

const WeatherMap = () => {
    const { currentWeather } = useContext(WeatherContext);
    const [layer, setLayer] = useState('temp_new'); // temp_new, precipitation_new, clouds_new, wind_new

    if (!currentWeather || !currentWeather.coord) return null;

    const { lat, lon } = currentWeather.coord;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card" 
            style={{ padding: '0', overflow: 'hidden', marginTop: '24px', position: 'relative' }}
        >
            <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000, background: 'var(--bg-glass)', backdropFilter: 'blur(10px)', padding: '5px', borderRadius: '8px', display: 'flex', gap: '5px' }}>
                <button onClick={() => setLayer('temp_new')} style={layerStyle(layer === 'temp_new')}>Temp</button>
                <button onClick={() => setLayer('precipitation_new')} style={layerStyle(layer === 'precipitation_new')}>Rain</button>
                <button onClick={() => setLayer('clouds_new')} style={layerStyle(layer === 'clouds_new')}>Clouds</button>
                <button onClick={() => setLayer('wind_new')} style={layerStyle(layer === 'wind_new')}>Wind</button>
            </div>

            <MapContainer center={[lat, lon]} zoom={10} style={{ height: '400px', width: '100%', borderRadius: '24px' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* OpenWeatherMap Weather Layer */}
                <TileLayer
                    url={`https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=c2900403c77d986599a671e45db4e38d`}
                />

                <Marker position={[lat, lon]}>
                    <Popup>
                        <div style={{ textAlign: 'center' }}>
                            <strong style={{ color: '#000' }}>{currentWeather.name}</strong><br/>
                            <span style={{ color: '#000' }}>{Math.round(currentWeather.main.temp)}°C, {currentWeather.weather[0].description}</span>
                        </div>
                    </Popup>
                </Marker>
                
                <RecenterAutomatically lat={lat} lon={lon} />
            </MapContainer>
        </motion.div>
    );
};

const layerStyle = (isActive) => ({
    background: isActive ? 'var(--accent-aurora)' : 'transparent',
    color: isActive ? '#000' : 'var(--text-primary)',
    border: '1px solid var(--border-glass)',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: isActive ? 'bold' : 'normal',
    transition: 'all 0.2s'
});

export default WeatherMap;

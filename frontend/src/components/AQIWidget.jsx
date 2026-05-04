import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { motion } from 'framer-motion';

const AQIWidget = () => {
    const { aqi } = useContext(WeatherContext);

    if (!aqi || !aqi.list || !aqi.list[0]) return null;

    const data = aqi.list[0];
    const index = data.main.aqi; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    const components = data.components;

    const getAqiDetails = (val) => {
        switch(val) {
            case 1: return { label: 'Good', color: '#4caf50', width: '20%' };
            case 2: return { label: 'Fair', color: '#8bc34a', width: '40%' };
            case 3: return { label: 'Moderate', color: '#ffeb3b', width: '60%' };
            case 4: return { label: 'Poor', color: '#ff9800', width: '80%' };
            case 5: return { label: 'Hazardous', color: '#f44336', width: '100%' };
            default: return { label: 'Unknown', color: '#9e9e9e', width: '0%' };
        }
    };

    const info = getAqiDetails(index);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card" 
            style={{ padding: '24px', marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🍃 Air Quality Index
                </h3>
                <span style={{ 
                    background: info.color, 
                    color: '#000', 
                    padding: '4px 12px', 
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    {info.label}
                </span>
            </div>

            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: info.width, height: '100%', background: info.color, transition: 'width 1s ease-in-out' }}></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>PM2.5</p>
                    <p className="mono" style={{ fontWeight: 'bold' }}>{components.pm2_5}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>PM10</p>
                    <p className="mono" style={{ fontWeight: 'bold' }}>{components.pm10}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>CO</p>
                    <p className="mono" style={{ fontWeight: 'bold' }}>{components.co}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>NO2</p>
                    <p className="mono" style={{ fontWeight: 'bold' }}>{components.no2}</p>
                </div>
            </div>
        </motion.div>
    );
};

export default AQIWidget;

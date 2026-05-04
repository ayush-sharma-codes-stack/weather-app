import React, { useContext } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const ForecastRow = () => {
    const { forecast } = useContext(WeatherContext);

    if (!forecast || !forecast.list) return null;

    // Group forecast by day
    const dailyData = [];
    const grouped = {};

    forecast.list.forEach(item => {
        const date = format(new Date(item.dt * 1000), 'yyyy-MM-dd');
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(item);
    });

    // Get max/min and icon for each day
    Object.keys(grouped).forEach(date => {
        const dayItems = grouped[date];
        const temps = dayItems.map(i => i.main.temp);
        const maxTemp = Math.round(Math.max(...temps));
        const minTemp = Math.round(Math.min(...temps));
        // Take middle of the day icon (around 12:00)
        const midDayItem = dayItems.find(i => i.dt_txt.includes('12:00:00')) || dayItems[0];
        
        dailyData.push({
            date: new Date(dayItems[0].dt * 1000),
            maxTemp,
            minTemp,
            icon: midDayItem.weather[0].icon,
            condition: midDayItem.weather[0].main
        });
    });

    // Take up to 5 days, skip today if it's already there
    const displayDays = dailyData.slice(0, 5);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, x: 20 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="show"
            variants={container}
            style={{ 
                display: 'flex', 
                gap: '15px', 
                overflowX: 'auto', 
                padding: '10px 0',
                marginTop: '24px'
            }}
            className="hide-scrollbar"
        >
            {displayDays.map((day, idx) => (
                <motion.div 
                    key={idx} 
                    variants={item}
                    className="glass-card" 
                    style={{ 
                        minWidth: '130px', 
                        flexShrink: 0, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        padding: '20px'
                    }}
                >
                    <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                        {idx === 0 ? 'Today' : format(day.date, 'EEE')}
                    </p>
                    <img 
                        src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`} 
                        alt="weather icon"
                        style={{ width: '60px', height: '60px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <span style={{ fontWeight: 'bold' }}>{day.maxTemp}°</span>
                        <span style={{ color: 'var(--text-muted)' }}>{day.minTemp}°</span>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ForecastRow;

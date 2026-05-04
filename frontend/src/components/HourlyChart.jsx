import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { WeatherContext } from '../context/WeatherContext';
import { motion } from 'framer-motion';

const HourlyChart = () => {
    const { forecast } = useContext(WeatherContext);

    if (!forecast || !forecast.list) return null;

    // The forecast API returns 3-hour intervals for 5 days (40 items).
    // Let's grab the first 8 items for the next 24 hours.
    const data = forecast.list.slice(0, 8).map(item => ({
        time: format(new Date(item.dt * 1000), 'HH:mm'),
        temp: Math.round(item.main.temp),
        fullDate: format(new Date(item.dt * 1000), 'MMM d, h:mm a')
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{ background: 'rgba(0,0,0,0.8)', padding: '10px 15px', borderRadius: '12px', border: '1px solid var(--border-glass)', backdropFilter: 'blur(10px)' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '5px' }}>{payload[0].payload.fullDate}</p>
                    <p style={{ color: 'var(--accent-aurora)', fontSize: '18px', fontWeight: 'bold' }}>{payload[0].value}°</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card" 
            style={{ padding: '24px', marginTop: '24px' }}
        >
            <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>24-Hour Forecast (3h intervals)</h3>
            <div style={{ height: '250px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--accent-aurora)" stopOpacity={0.6}/>
                                <stop offset="95%" stopColor="var(--accent-aurora)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            stroke="var(--text-muted)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                        />
                        <YAxis 
                            stroke="var(--text-muted)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(value) => `${value}°`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                            type="monotone" 
                            dataKey="temp" 
                            stroke="var(--accent-aurora)" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorTemp)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default HourlyChart;

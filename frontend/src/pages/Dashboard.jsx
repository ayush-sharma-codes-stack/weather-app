import React, { useContext, useEffect } from 'react';
import { WeatherContext } from '../context/WeatherContext';
import SearchBar from '../components/SearchBar';
import HourlyChart from '../components/HourlyChart';
import ForecastRow from '../components/ForecastRow';
import WeatherMap from '../components/WeatherMap';
import AQIWidget from '../components/AQIWidget';
import FavoriteCities from '../components/FavoriteCities';
import { motion } from 'framer-motion';
import { Droplets, Wind, Eye, Gauge, UserCircle, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { currentWeather, loading, error, fetchWeather } = useContext(WeatherContext);
    const { user, logout } = useContext(AuthContext);

    useEffect(() => {
        // Fetch default city on load
        if (!currentWeather && !loading) {
            fetchWeather('London');
        }
    }, []);

    return (
        <div style={{ padding: '40px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
                
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 className="premium-title" style={{ fontSize: '36px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>Atmosphere</h1>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                                    <UserCircle size={24} color="var(--accent-aurora)" />
                                    <span style={{ fontWeight: '500' }}>{user.name}</span>
                                </div>
                                <button 
                                    onClick={logout}
                                    style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', color: '#fff', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500', padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>Login</Link>
                                <Link to="/register" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', padding: '8px 16px', background: 'var(--accent-aurora)', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,229,255,0.3)' }}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </header>

                <SearchBar />

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <div className="breathing-glow" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--accent-aurora)', margin: '0 auto', boxShadow: '0 0 30px rgba(0,229,255,0.5)' }}></div>
                        <p style={{ marginTop: '30px', fontSize: '18px', letterSpacing: '2px', color: 'var(--text-muted)' }}>ANALYZING ATMOSPHERE...</p>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <div className="glass-card" style={{ display: 'inline-block', border: '1px solid #ff5252', background: 'rgba(255, 82, 82, 0.1)' }}>
                            <h3 style={{ color: '#ff5252', marginBottom: '10px' }}>Oops!</h3>
                            <p>{error}</p>
                            <p style={{ marginTop: '15px', fontSize: '14px', color: 'var(--text-muted)' }}>
                                Note: If you haven't added your OpenWeatherMap API key yet,<br/>
                                please update it in backend/.env
                            </p>
                        </div>
                    </div>
                ) : currentWeather ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="dashboard-grid"
                    >
                        <div className="dashboard-hero">
                            {/* Main Hero Card */}
                            <div className="glass-card breathing-glow" style={{ position: 'relative', overflow: 'hidden', padding: '50px 40px' }}>
                                <FavoriteCities />
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '30px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '-2px', marginBottom: '5px' }}>
                                            {currentWeather.name}, {currentWeather.sys.country}
                                        </h2>
                                        <p style={{ fontSize: '22px', color: 'var(--text-muted)', textTransform: 'capitalize', letterSpacing: '1px' }}>
                                            {currentWeather.weather[0].description}
                                        </p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <img 
                                            src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`} 
                                            alt="weather icon" 
                                            style={{ width: '150px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <h1 className="neon-text" style={{ fontSize: '120px', lineHeight: 0.9, margin: 0, fontFamily: 'Cabinet Grotesk' }}>
                                                {currentWeather.main.temp.toFixed(1)}°
                                            </h1>
                                            <p style={{ fontSize: '20px', marginTop: '10px', color: '#00f0ff', textAlign: 'right', textShadow: '0 0 10px rgba(0,255,255,0.5)' }}>
                                                Feels like {currentWeather.main.feels_like.toFixed(1)}°
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <HourlyChart />
                            <ForecastRow />
                            <AQIWidget />
                        </div>

                        <div className="dashboard-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(79,195,247,0.2)', padding: '8px', borderRadius: '12px' }}>
                                            <Droplets size={24} color="var(--accent-blue)" />
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>Humidity</span>
                                    </div>
                                    <span className="mono" style={{ fontSize: '32px', fontWeight: 'bold' }}>{currentWeather.main.humidity}%</span>
                                </div>

                                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px' }}>
                                            <Wind size={24} color="var(--text-primary)" />
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>Wind</span>
                                    </div>
                                    <span className="mono" style={{ fontSize: '32px', fontWeight: 'bold' }}>{currentWeather.wind.speed} <span style={{fontSize: '16px'}}>m/s</span></span>
                                </div>

                                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(0,229,255,0.2)', padding: '8px', borderRadius: '12px' }}>
                                            <Eye size={24} color="var(--accent-aurora)" />
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>Visibility</span>
                                    </div>
                                    <span className="mono" style={{ fontSize: '32px', fontWeight: 'bold' }}>{(currentWeather.visibility / 1000).toFixed(1)} <span style={{fontSize: '16px'}}>km</span></span>
                                </div>

                                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                        <div style={{ background: 'rgba(255,152,0,0.2)', padding: '8px', borderRadius: '12px' }}>
                                            <Gauge size={24} color="var(--accent-warm)" />
                                        </div>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 'bold' }}>Pressure</span>
                                    </div>
                                    <span className="mono" style={{ fontSize: '32px', fontWeight: 'bold' }}>{currentWeather.main.pressure} <span style={{fontSize: '16px'}}>hPa</span></span>
                                </div>
                            </div>

                            <WeatherMap />
                        </div>
                    </motion.div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <p style={{ fontSize: '24px', color: 'var(--text-muted)', fontWeight: '300' }}>Search for a city to begin your atmospheric journey</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

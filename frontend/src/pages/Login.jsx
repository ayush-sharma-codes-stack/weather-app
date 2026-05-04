import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate('/');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card" 
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '30px', fontSize: '32px' }}>Welcome Back</h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-glass)',
                                background: 'rgba(0,0,0,0.2)',
                                color: '#fff',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                border: '1px solid var(--border-glass)',
                                background: 'rgba(0,0,0,0.2)',
                                color: '#fff',
                                fontSize: '16px'
                            }}
                        />
                    </div>
                    
                    <button type="submit" style={{
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'var(--accent-aurora)',
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}>
                        Login
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-aurora)', textDecoration: 'none' }}>Sign up</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;

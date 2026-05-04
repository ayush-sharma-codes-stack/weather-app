import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const api = axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchUser();
        } else {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching user', error);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            setToken(res.data.token);
            toast.success('Logged in successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            setToken(res.data.token);
            toast.success('Registered successfully');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, api }}>
            {children}
        </AuthContext.Provider>
    );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { socket, joinUserRoom } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kisan_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('kisan_token'));
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeAlert, setActiveAlert] = useState(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      joinUserRoom(user.id);
      fetchNotifications();
    }
  }, [user, token]);

  // Listen to live socket events for user notifications
  useEffect(() => {
    if (!socket) return;

    const handleTokenCalled = (data) => {
      setActiveAlert({
        title: '📢 YOUR TOKEN IS CALLED!',
        message: `Token #${data.tokenNumber} is now at the inspection desk. Please proceed immediately!`,
        type: 'alert'
      });
      fetchNotifications();
    };

    const handleProcurementDone = (data) => {
      setActiveAlert({
        title: '🌾 Procurement Verified & Payment Initiated!',
        message: `Your crop has been accepted! Payout of ₹${data.payment?.amount?.toLocaleString('en-IN')} is being processed.`,
        type: 'success'
      });
      fetchNotifications();
    };

    const handlePaymentDisbursed = (data) => {
      setActiveAlert({
        title: '💰 Payment Credited to Bank!',
        message: `₹${data.amount?.toLocaleString('en-IN')} has been disbursed to your account (Txn ID: ${data.transactionId}).`,
        type: 'success'
      });
      fetchNotifications();
    };

    socket.on('token_called', handleTokenCalled);
    socket.on('procurement_status_changed', handleProcurementDone);
    socket.on('payment_disbursed', handlePaymentDisbursed);

    return () => {
      socket.off('token_called', handleTokenCalled);
      socket.off('procurement_status_changed', handleProcurementDone);
      socket.off('payment_disbursed', handlePaymentDisbursed);
    };
  }, []);

  const login = async (phone, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { phone, password });
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('kisan_token', token);
        localStorage.setItem('kisan_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('kisan_token', token);
        localStorage.setItem('kisan_user', JSON.stringify(user));
        setToken(token);
        setUser(user);
        return { success: true, user };
      }
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role = 'farmer') => {
    const creds = {
      farmer: { phone: '9876543210', pass: 'farmer123' },
      officer: { phone: '9876543220', pass: 'officer123' },
      admin: { phone: '9999999999', pass: 'admin123' }
    };
    const target = creds[role] || creds.farmer;
    return await login(target.phone, target.pass);
  };

  const logout = () => {
    localStorage.removeItem('kisan_token');
    localStorage.removeItem('kisan_user');
    setToken(null);
    setUser(null);
    setNotifications([]);
    setUnreadCount(0);
  };

  const markNotificationRead = async (id = 'all') => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notifications,
        unreadCount,
        activeAlert,
        setActiveAlert,
        login,
        register,
        demoLogin,
        logout,
        fetchNotifications,
        markNotificationRead
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

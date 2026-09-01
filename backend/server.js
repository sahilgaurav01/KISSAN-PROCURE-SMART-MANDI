require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const { initializeDatabase } = require('./config/database');
const { seedDatabase } = require('./database/seed');
const { setupSocketIO } = require('./socket/queueSocket');

// Routes
const authRoutes = require('./routes/authRoutes');
const centreRoutes = require('./routes/centreRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const queueRoutes = require('./routes/queueRoutes');
const procurementRoutes = require('./routes/procurementRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
const server = http.createServer(app);

// Initialize DB and Seed Data
initializeDatabase();
seedDatabase();

// CORS & Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
app.set('socketio', io);
setupSocketIO(io);

// Mount API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/centres', centreRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/queue', queueRoutes);
app.use('/api/procurement', procurementRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'KisanProcure Core API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 KisanProcure Backend Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO initialized for real-time queue streaming.`);
  });
}

module.exports = { app, server };

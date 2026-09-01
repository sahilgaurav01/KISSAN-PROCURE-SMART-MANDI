function setupSocketIO(io) {
  io.on('connection', (socket) => {
    // console.log(`🔌 New client connected: ${socket.id}`);

    // Join centre-specific room for real-time queue synchronization
    socket.on('join_centre', (centreId) => {
      if (centreId) {
        const room = `centre_${centreId}`;
        socket.join(room);
        // console.log(`Socket ${socket.id} joined ${room}`);
      }
    });

    socket.on('leave_centre', (centreId) => {
      if (centreId) {
        const room = `centre_${centreId}`;
        socket.leave(room);
      }
    });

    // Join user-specific room for personal proximity notifications
    socket.on('join_user', (userId) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        // console.log(`Socket ${socket.id} joined personal room ${room}`);
      }
    });

    socket.on('disconnect', () => {
      // console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { setupSocketIO };

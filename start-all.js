const { spawn } = require('child_process');
const path = require('path');

console.log('🌾 ========================================================');
console.log('🌾   KISANPROCURE: SMART MANDI QUEUE & MSP PAYOUT SYSTEM    ');
console.log('🌾   Smart India Hackathon 2024-26 • Problem Statement 26032 ');
console.log('🌾 ========================================================\n');

// Start Backend
console.log('🚀 Starting Backend Server on http://localhost:5000 ...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'backend'),
  shell: true,
  stdio: 'inherit'
});

// Start Frontend
console.log('🌐 Starting Frontend Client on http://localhost:5173 ...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  shell: true,
  stdio: 'inherit'
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down KisanProcure services...');
  backend.kill();
  frontend.kill();
  process.exit();
});

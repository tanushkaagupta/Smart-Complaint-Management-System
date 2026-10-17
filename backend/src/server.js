import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` ComplaintHub Backend Server is running! `);
  console.log(` Port: ${PORT}                            `);
  console.log(` URL:  http://localhost:${PORT}          `);
  console.log(` API:  http://localhost:${PORT}/api      `);
  console.log(`=========================================`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

const Redis = require('ioredis');

// Create a Redis client
const redisClient = new Redis({
  port: 34938, // Your Upstash Redis port
  host: 'apn1-new-anteater-34938.upstash.io', // Your Upstash Redis hostname
  password: '4476c74d3fe645baa9dea82ae3873c21', // Your Upstash Redis password
  tls: {
    rejectUnauthorized: false // Skip SSL certificate validation for Upstash
  }
});

// Test the connection
redisClient.on('connect', () => {
  console.log('Connected to Upstash Redis');
});

redisClient.on('error', (err) => {
  console.error('Error connecting to Upstash Redis:', err);
});

module.exports = redisClient;

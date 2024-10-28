const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const axios = require('axios');
const redis = require('redis');

// const redisClient = redis.createClient({
//     url: "redis://localhost:6379", // Change this URL if Redis is hosted remotely
// });

// redisClient.connect();

router.post('/api/process', async (req, res) => {
  const { data, requestId } = req.body;

  // Define the callback URL with the unique request ID
  const callbackUrl = `http://localhost:5000/api/callback/${requestId}`;

  try {
    // Forward the request to Server 2 with data, requestId, and callbackUrl
    await axios.post('http://localhost:4000/api/handle', {
      data,
      callbackUrl,
    });

    res.status(200).json({ message: 'Request forwarded to Server 2, awaiting response.' });
  } catch (error) {
    console.error("Error forwarding request to Server 2:", error);
    res.status(500).json({ message: 'Error forwarding request to Server 2.' });
  }
});

module.exports = router;
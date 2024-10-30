const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const axios = require('axios');
const redis = require('redis');

const redisClient = redis.createClient({
    url: "redis://localhost:6379", // Change this URL if Redis is hosted remotely
});

redisClient.connect();

router.post('/api/send', async (req, res) => {
  const { data } = req.body;

  try {
    // Forward the request to Server 2
    const response = await axios.post('http://localhost:4000/api/process', { data });

    // Send the processed data received from Server 2 to the frontend
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error in forwarding request to Server 2:', error);
    res.status(500).json({ message: 'Error processing the request' });
  }
});

module.exports = router;
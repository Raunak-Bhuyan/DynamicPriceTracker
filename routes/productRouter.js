const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const redis = require('redis');

// In-memory store for processed data
const processedDataStore = {};

// Redis client setup
const redisClient = redis.createClient({
  url: 'redis://username:password@hostname:port', // Replace with your Redis URL
});

// Handle connection events
redisClient.on('connect', () => {
  console.log("Connected to Redis");
});
redisClient.on('error', (err) => {
  console.error("Redis error:", err);
});

// Search product endpoint
router.post('/search-product', async (req, res) => {
  const { productName } = req.body;

  // Check if product data exists in Redis cache
  redisClient.get(productName, async (err, cachedData) => {
    if (err) {
      console.error("Redis error:", err);
      return res.status(500).json({ message: 'Error accessing cache' });
    }

    if (cachedData) {
      res.json({ flag: 2, data: JSON.parse(cachedData), message: 'Product found in cache' });
    } else {
      const uniqueID = crypto.randomBytes(16).toString('hex');
      const callbackUrl = `http://localhost:5000/products/callback/${uniqueID}`;

      try {
        await axios.post('http://localhost:6000/process-product', {
          productName,
          callbackUrl,
        });
        
        res.json({ flag: 0, uniqueID, message: "Processing request. Check back later." });
      } catch (error) {
        console.error("Error forwarding to Server 2:", error);
        res.status(500).json({ message: 'Error forwarding request to Server 2' });
      }
    }
  });
});

// Callback endpoint to receive processed data from Server 2
router.post('/callback/:uniqueID', (req, res) => {
  const { uniqueID } = req.params;
  const processedData = req.body.processedData;

  // Store processed data only in memory
  processedDataStore[uniqueID] = processedData;

  console.log(`Received data for unique ID ${uniqueID}`, processedData);
  res.sendStatus(200);
});

// Endpoint for frontend to retrieve processed data by unique ID
router.get('/get-data/:uniqueID', (req, res) => {
  const { uniqueID } = req.params;
  if (processedDataStore[uniqueID]) {
    const data = processedDataStore[uniqueID];
    
    res.json({ flag: 1, data });
    delete processedDataStore[uniqueID];
  } else {
    res.json({ flag: 0, message: 'Processing, please check again soon' });
  }
});

module.exports = router;

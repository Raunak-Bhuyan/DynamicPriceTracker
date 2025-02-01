const express = require("express");
const router = express.Router();
const axios = require("axios"); // for scraping the server
const { Product } = require("../models/Product.js"); // Assuming you have a Product model in your database

// This route handles the product request
router.get("/", async (req, res) => {
    const {product_name ,  amazon_url , flipkart_url} = req.body();

    try {
        // Step 1: Check if product is already in the database
        let productDetails = await Product.findOne({ product_name });

        if (productDetails) {
            // Step 2: If product is found in the database, return it
            return res.json(productDetails)
        } else {
            // Step 3: If product is not found, scrape data from another server
            const scraperServer = `https://scraping-server.com/api/scrape?product_name=${product_name}&amazon_url=${amazon_url}&flipkart_url=${flipkart_url}`;

            try {
                // Send request to scraping server
                const response = await axios.get(scraperServer);

                // Assuming the response contains the scraped product \
                console.log(response)
                const scrapedProduct = response.data;

                // Step 5: Return the scraped product details
                return res.json(scrapedProduct);
            } catch (scrapingError) {
                console.error("Error scraping data:", scrapingError);
                return res.status(500).json({ message: "Failed to scrape product data." });
            }
        }
    } catch (error) {
        console.error("Database or general error:", error);
        return res.status(500).json({ message: "An error occurred while fetching product details." });
    }
});

module.exports = router;

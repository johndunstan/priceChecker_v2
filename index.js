require('dotenv').config();
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

const checkPrice = require('./statusChecks/checkPrice');
const checkInventory = require('./statusChecks/checkInventory');

const priceData = require('./data/priceData.json');
const inventoryData = require('./data/inventoryData.json');

// Basic route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

priceData.forEach(product => {
  checkPrice(product);
});

// inventoryData.forEach(product => {
//   checkInventory(product);
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

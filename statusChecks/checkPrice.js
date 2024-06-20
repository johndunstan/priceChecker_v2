const sendPriceDropEmail = require('../sendingAlerts/sendPriceDropEmail');
const preloadLocationData = require('../utilities/preloadLocationData');

const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
const receiverEmailAddress = process.env.RECEIVER_EMAIL_ADDRESS;

async function checkPrice(product) {
  let currentPrice;
  const targetPrice = product.targetPrice;

  console.log('Starting price check...');

  await preloadLocationData();

  try {
    console.log('Fetching price...');
    const response = await fetch(product.checkPriceUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
      },
      // You might need to include cookies or other credentials
      // credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Data received:', data);
    currentPrice = data.finalOnlinePrice;
  } catch (error) {
    console.error('Error fetching price:', error);
  }

  if (!product.alertSent && currentPrice <= targetPrice) {
    console.log(
      `Price of ${product.name} dropped to $${currentPrice}! Consider buying it! 💸`
    );
    product.alertSent = true;
    sendPriceDropEmail(
      currentPrice,
      senderEmailAddress,
      receiverEmailAddress,
      product.name,
      product.listingUrl
    );
  } else {
    console.log(
      `No price drop detected for ${product.name}. 🙅‍♂️ Current price is $${currentPrice}.`
    );
  }
}

module.exports = checkPrice;

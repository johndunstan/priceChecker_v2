const sendNowInStockEmail = require('../sendingAlerts/sendNowInStockEmail');
const preloadLocationData = require('../utilities/preloadLocationData');

const senderEmailAddress = process.env.SENDER_EMAIL_ADDRESS;
const receiverEmailAddress = process.env.RECEIVER_EMAIL_ADDRESS;

async function loadBaseSite() {
  try {
    console.log('Loading base product site in background...');
    const response = await fetch(
      'https://www.costco.com/intense-951-xc-bike.product.100691780.html',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
        },
        // You might need to include cookies or other credentials
        // credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Site loaded...');
  } catch (error) {
    console.error('Error loading site:', error);
  }
}

async function getMembershipMetaData() {
  try {
    console.log('Getting Member meta data...');
    const response = await fetch(
      'https://www.costco.com/MembershipMetaDataJS?langId=-1&storeId=10301&citiCardRequest=true',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
        },
        // You might need to include cookies or other credentials
        // credentials: 'include',
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Log the raw response text
    const text = await response.text();
    console.log('Raw response text:', text);

    const data = await response.json();
    console.log('Data received:', data);
  } catch (error) {
    console.error('Error fetching meta data:', error);
  }
}

async function checkInventory(product) {
  console.log('Starting inventory check...');

  // await preloadLocationData();
  // await getMembershipMetaData();
  await loadBaseSite();

  let inventoryAvailable;

  try {
    console.log('Checking inventory...');
    const response = await fetch(product.checkInventoryUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
        'X-ZIP-CODE': 83704,
      },
      // You might need to include cookies or other credentials
      // credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Data received:', data);
    inventoryAvailable = data.invAvailable;
  } catch (error) {
    console.error('Error fetching price:', error);
  }

  if (inventoryAvailable) {
    console.log(`Huzzah! ${product.name} now has inventory available! 👏`);
    sendNowInStockEmail(
      senderEmailAddress,
      receiverEmailAddress,
      product.name,
      product.listingUrl
    );
  } else {
    console.log(`No inventory for ${product.name} is available. 😿`);
  }
}

module.exports = checkInventory;

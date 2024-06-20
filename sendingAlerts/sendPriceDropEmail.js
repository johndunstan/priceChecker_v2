const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

async function sendPriceDropEmail(
  currentPrice,
  senderEmailAddress,
  receiverEmailAddress,
  productName,
  productSite
) {
  const request = mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: senderEmailAddress,
          Name: 'Price Checker',
        },
        To: [
          {
            Email: receiverEmailAddress,
            Name: 'John Dunstan',
          },
        ],
        Subject: `Price Drop Alert! 🚨 ${productName} now $${currentPrice}! 💸`,
        TextPart: `The price of ${productName} dropped to $${currentPrice}!`,
        HTMLPart: `<h4>The price of <strong>${productName}</strong> dropped to <strong>$${currentPrice}</strong>! 🎉</h4><br /><a href="${productSite}"><button>Check it out now!</button></a>`,
      },
    ],
  });

  try {
    const result = await request;
    console.log('Email sent:', result.body);
  } catch (err) {
    console.error('Error sending email:', err.statusCode, err.message);
  }
}

module.exports = sendPriceDropEmail;

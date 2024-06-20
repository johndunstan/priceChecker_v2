const mailjet = require('node-mailjet').apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

async function sendNowInStockEmail(
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
        Subject: `In stock alert! 🚨 ${productName} now available! 🎉`,
        TextPart: `${productName} is available again!`,
        HTMLPart: `<p><strong>${productName}</strong> is available again! 🎉</p><br /><a href="${productSite}"><button>Check it out now!</button></a>`,
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

module.exports = sendNowInStockEmail;

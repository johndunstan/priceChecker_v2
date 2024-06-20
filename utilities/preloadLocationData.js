async function preloadLocationData() {
  const locationCheckUrl =
    'https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location';

  console.log('Preloading location data...');
  try {
    const response = await fetch(locationCheckUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:126.0) Gecko/20100101 Firefox/126.0',
      },
      // Include credentials if necessary
      // credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(
        `HTTP error during location preload! status: ${response.status}`
      );
    }

    // Log the raw response text
    const text = await response.text();
    console.log('Raw response text:', text);

    // Extract JSON data from JSONP response
    const jsonpPrefix = 'jsonFeed(';
    const jsonpSuffix = ');';

    if (text.startsWith(jsonpPrefix) && text.endsWith(jsonpSuffix)) {
      const jsonString = text.slice(jsonpPrefix.length, -jsonpSuffix.length);
      const data = JSON.parse(jsonString);
      console.log('Location data preloaded successfully.');
      console.log('Data received:', data);
      return data;
    } else {
      throw new Error('Response is not valid JSONP');
    }
  } catch (error) {
    console.error('Error preloading location data:', error);
  }
}

module.exports = preloadLocationData;

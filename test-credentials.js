// ===== TEST PESAPAL CREDENTIALS =====
// Run this function in Google Apps Script to test your credentials

function testCredentialsDirectly() {
  const PESAPAL_CONSUMER_KEY = '7m/evrPDOt+pop1hRmHOi3Eyt05uGfK1';
  const PESAPAL_CONSUMER_SECRET = '2v5EeEaUu5AXlYsU90GqcaPf5w0=';
  const PESAPAL_BASE_URL = 'https://cybqa.pesapal.com/pesapalv3';

  Logger.log('��� Testing Pesapal credentials...');
  Logger.log('Consumer Key: ' + PESAPAL_CONSUMER_KEY.substring(0, 10) + '...');
  Logger.log('Consumer Secret: ' + PESAPAL_CONSUMER_SECRET.substring(0, 10) + '...');
  Logger.log('Base URL: ' + PESAPAL_BASE_URL);

  const credentials = Utilities.base64Encode(PESAPAL_CONSUMER_KEY + ':' + PESAPAL_CONSUMER_SECRET);
  Logger.log('Base64 Credentials: ' + credentials.substring(0, 20) + '...');

  const payload = {
    consumer_key: PESAPAL_CONSUMER_KEY,
    consumer_secret: PESAPAL_CONSUMER_SECRET
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Basic ' + credentials,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    Logger.log('��� Making API call to Pesapal...');
    const response = UrlFetchApp.fetch(PESAPAL_BASE_URL + '/api/Auth/RequestToken', options);
    const statusCode = response.getResponseCode();
    const responseText = response.getContentText();

    Logger.log('Response Status: ' + statusCode);
    Logger.log('Response Body: ' + responseText);

    if (statusCode === 200) {
      const result = JSON.parse(responseText);
      if (result.token) {
        Logger.log('✅ SUCCESS: Token obtained!');
        Logger.log('Token: ' + result.token.substring(0, 20) + '...');
        return true;
      } else {
        Logger.log('❌ FAILED: No token in response');
        return false;
      }
    } else {
      Logger.log('❌ FAILED: HTTP ' + statusCode);
      Logger.log('Error details: ' + responseText);
      return false;
    }

  } catch (error) {
    Logger.log('❌ ERROR: ' + error.toString());
    return false;
  }
}

// ===== MANUAL CREDENTIAL TEST =====
// If the above doesn't work, try these exact credentials from your Pesapal dashboard

function testWithManualCredentials() {
  // Replace these with EXACT values from Pesapal dashboard
  const manualKey = 'YOUR_EXACT_CONSUMER_KEY_HERE';
  const manualSecret = 'YOUR_EXACT_CONSUMER_SECRET_HERE';

  Logger.log('Testing with manual credentials...');
  Logger.log('Key: ' + manualKey);
  Logger.log('Secret: ' + manualSecret);

  // Copy the testCredentialsDirectly function and replace the constants above
  // Then run this function
}

// ===== USAGE =====
// 1. Copy this entire code into a new Google Apps Script
// 2. Run testCredentialsDirectly()
// 3. Check the logs for results
// 4. If it fails, run testWithManualCredentials() with exact dashboard values

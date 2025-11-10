require('dotenv').config();

async function testNewsletterAPI() {
  const BASE_URL = 'http://localhost:3001';

  try {
    console.log('Testing newsletter subscription...');

    const response = await fetch(`${BASE_URL}/api/admin/newsletters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
      }),
    });

    const data = await response.json();
    console.log('Newsletter API response:', data);

    if (data.success) {
      console.log('✅ Newsletter subscription successful');
    } else {
      console.log('❌ Newsletter subscription failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Newsletter test error:', error.message);
  }
}

testNewsletterAPI();
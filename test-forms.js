require('dotenv').config();

const BASE_URL = 'http://localhost:3001';

async function testContactForm() {
  try {
    console.log('Testing contact form submission...');

    const response = await fetch(`${BASE_URL}/api/admin/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        subject: 'Test Inquiry',
        message: 'This is a test message from the automated test script.',
      }),
    });

    const data = await response.json();
    console.log('Contact form response:', data);

    if (data.success) {
      console.log('✅ Contact form submission successful');
    } else {
      console.log('❌ Contact form submission failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Contact form test error:', error.message);
  }
}

async function testVisitRequestForm() {
  try {
    console.log('Testing visit request form submission...');

    const response = await fetch(`${BASE_URL}/api/admin/visit-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        preferredDate: '2024-12-15',
        preferredTime: '10:00',
        groupSize: 2,
        interests: ['Visit Type: individual', 'Program: engineering'],
        specialRequests: 'Looking forward to seeing the engineering facilities.',
      }),
    });

    const data = await response.json();
    console.log('Visit request form response:', data);

    if (data.success) {
      console.log('✅ Visit request form submission successful');
    } else {
      console.log('❌ Visit request form submission failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Visit request form test error:', error.message);
  }
}

async function runTests() {
  console.log('Starting form submission tests...\n');

  await testContactForm();
  console.log('');
  await testVisitRequestForm();

  console.log('\nForm submission tests completed.');
}

runTests();
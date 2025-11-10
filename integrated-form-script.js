// ===== PESAPAL INTEGRATION FOR GOOGLE FORMS =====
// Integrated Payment Dialog with Pesapal API
// Supports MTN Mobile Money and Airtel Money for Uganda

// ===== CONFIGURATION =====
const PESAPAL_CONSUMER_KEY = '7m/evrPDOt+pop1hRmHOi3Eyt05uGfK1';
const PESAPAL_CONSUMER_SECRET = '2v5EeEaUu5AXlYsU90GqcaPf5w0=';
const PESAPAL_BASE_URL = 'https://cybqa.pesapal.com/pesapalv3'; // Test environment
const PESAPAL_NOTIFICATION_ID = 'your-notification-id'; // Get from Pesapal dashboard

// Application fee
const APPLICATION_FEE = 50000; // UGX 50,000

// Google Sheet for tracking (update with your sheet ID)
const sheetId = '1FDJBLYAtYGt6vgWhUYFOLM6lnNsNRCCFf2Y9tZ-KDrQ'; // Your Google Sheet ID
const callbackUrl = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // Replace with your deployed URL

// ===== PESAPAL API FUNCTIONS =====

/**
 * Get Pesapal access token
 */
function getPesapalAccessToken() {
  const credentials = Utilities.base64Encode(PESAPAL_CONSUMER_KEY + ':' + PESAPAL_CONSUMER_SECRET);
  
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
    const response = UrlFetchApp.fetch(PESAPAL_BASE_URL + '/api/Auth/RequestToken', options);
    const result = JSON.parse(response.getContentText());
    
    if (result.token) {
      return result.token;
    } else {
      Logger.log('Pesapal token error: ' + JSON.stringify(result));
      return null;
    }
  } catch (error) {
    Logger.log('Pesapal token request error: ' + error.toString());
    return null;
  }
}

/**
 * Register IPN (Instant Payment Notification)
 */
function registerPesapalIPN() {
  const token = getPesapalAccessToken();
  if (!token) return null;

  const payload = {
    url: callbackUrl,
    ipn_notification_type: 'POST'
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(PESAPAL_BASE_URL + '/api/URLRegistration/RegisterIPN', options);
    const result = JSON.parse(response.getContentText());
    
    if (result.ipn_id) {
      return result.ipn_id;
    } else {
      Logger.log('IPN registration error: ' + JSON.stringify(result));
      return null;
    }
  } catch (error) {
    Logger.log('IPN registration request error: ' + error.toString());
    return null;
  }
}

/**
 * Submit Pesapal order
 */
function submitPesapalOrder(email, phone, amount, reference, name, paymentMethod) {
  const token = getPesapalAccessToken();
  if (!token) return null;

  const ipnId = registerPesapalIPN();
  if (!ipnId) return null;

  const payload = {
    id: reference,
    currency: 'UGX',
    amount: amount,
    description: 'University Application Fee - Eyecab International University',
    callback_url: callbackUrl,
    redirect_url: callbackUrl,
    notification_id: ipnId,
    billing_address: {
      email_address: email,
      phone_number: phone,
      country_code: 'UG',
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ').slice(1).join(' ') || name,
      line_1: 'University Application',
      city: 'Kampala',
      state: 'Central',
      postal_code: '00000'
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(PESAPAL_BASE_URL + '/api/Transactions/SubmitOrderRequest', options);
    const result = JSON.parse(response.getContentText());
    
    if (result.order_tracking_id) {
      return {
        trackingId: result.order_tracking_id,
        redirectUrl: result.redirect_url || null,
        status: 'success'
      };
    } else {
      Logger.log('Pesapal order submission error: ' + JSON.stringify(result));
      return null;
    }
  } catch (error) {
    Logger.log('Pesapal order submission error: ' + error.toString());
    return null;
  }
}

// ===== PAYMENT DIALOG HTML =====
function getPaymentDialogHtml() {
  return `
<!DOCTYPE html>
<html>
<head>
    <base target="_top">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .payment-container {
            max-width: 500px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
        }
        .header h2 {
            margin: 0;
            font-size: 24px;
        }
        .fee-info {
            background: #e8f4fd;
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
        }
        .fee-amount {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin: 10px 0;
        }
        .payment-methods {
            padding: 20px;
        }
        .method-group {
            margin-bottom: 20px;
        }
        .method-group h3 {
            margin: 0 0 15px 0;
            color: #333;
            font-size: 16px;
        }
        .payment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .payment-method {
            border: 2px solid #e1e8ed;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            background: white;
        }
        .payment-method:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .payment-method.selected {
            border-color: #667eea;
            background: #f8f9ff;
        }
        .method-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
        .method-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
        }
        .method-desc {
            font-size: 12px;
            color: #666;
        }
        .mobile-money-input {
            margin-top: 15px;
            display: none;
        }
        .mobile-money-input.show {
            display: block;
        }
        .input-group {
            margin-bottom: 15px;
        }
        .input-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
        }
        .input-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .actions {
            padding: 20px;
            background: #f8f9fa;
            text-align: center;
        }
        .pay-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            max-width: 200px;
        }
        .pay-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
        }
        .pay-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
            transform: none;
        }
        .cancel-btn {
            background: transparent;
            color: #666;
            border: 1px solid #ddd;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            margin-top: 10px;
        }
        .cancel-btn:hover {
            background: #f5f5f5;
        }
        .loading {
            display: none;
            text-align: center;
            color: #666;
            margin-top: 10px;
        }
        .success {
            display: none;
            text-align: center;
            color: #28a745;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="payment-container">
        <div class="header">
            <h2>Complete Your Payment</h2>
            <p>Application Fee Payment</p>
        </div>

        <div class="fee-info">
            <div>Application Fee</div>
            <div class="fee-amount">UGX 50,000</div>
            <div style="font-size: 14px; color: #666;">Required to process your application</div>
        </div>

        <div class="payment-methods">
            <div class="method-group">
                <h3>Select Payment Method</h3>
                <div class="payment-grid">
                    <div class="payment-method" data-method="mtn">
                        <div class="method-icon">���</div>
                        <div class="method-name">MTN Mobile Money</div>
                        <div class="method-desc">Pay with MTN MoMo</div>
                    </div>
                    <div class="payment-method" data-method="airtel">
                        <div class="method-icon">���</div>
                        <div class="method-name">Airtel Money</div>
                        <div class="method-desc">Pay with Airtel Money</div>
                    </div>
                </div>
            </div>

            <div class="mobile-money-input" id="mobileInput">
                <div class="input-group">
                    <label for="mobileNumber">Mobile Money Number</label>
                    <input type="tel" id="mobileNumber" placeholder="Enter mobile number (e.g., 256700000000)" required>
                </div>
            </div>
        </div>

        <div class="actions">
            <button class="pay-btn" id="payBtn" disabled>Pay UGX 50,000</button>
            <div class="loading" id="loading">Processing payment...</div>
            <div class="success" id="success">Payment successful! Redirecting...</div>
            <button class="cancel-btn" onclick="google.script.host.close()">Cancel</button>
        </div>
    </div>

    <script>
        let selectedMethod = null;

        // Payment method selection
        document.querySelectorAll('.payment-method').forEach(method => {
            method.addEventListener('click', function() {
                // Remove selected class from all methods
                document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
                // Add selected class to clicked method
                this.classList.add('selected');

                selectedMethod = this.dataset.method;

                // Show mobile input for mobile money payments
                const mobileInput = document.getElementById('mobileInput');
                if (selectedMethod === 'mtn' || selectedMethod === 'airtel') {
                    mobileInput.classList.add('show');
                } else {
                    mobileInput.classList.remove('show');
                }

                // Enable pay button
                document.getElementById('payBtn').disabled = false;
            });
        });

        // Pay button click
        document.getElementById('payBtn').addEventListener('click', function() {
            if (!selectedMethod) return;

            const payBtn = document.getElementById('payBtn');
            const loading = document.getElementById('loading');
            const success = document.getElementById('success');

            // Show loading
            payBtn.disabled = true;
            loading.style.display = 'block';

            // Get mobile number for mobile money payments
            let mobileNumber = null;
            if (selectedMethod === 'mtn' || selectedMethod === 'airtel') {
                mobileNumber = document.getElementById('mobileNumber').value;
                if (!mobileNumber) {
                    alert('Please enter your mobile money number');
                    payBtn.disabled = false;
                    loading.style.display = 'none';
                    return;
                }
            }

            // Call server-side function to process payment
            google.script.run
                .withSuccessHandler(function(result) {
                    loading.style.display = 'none';
                    if (result.success) {
                        success.textContent = result.message;
                        success.style.display = 'block';
                        setTimeout(() => {
                            google.script.host.close();
                        }, 3000);
                    } else {
                        alert('Payment failed: ' + result.message);
                        payBtn.disabled = false;
                    }
                })
                .withFailureHandler(function(error) {
                    loading.style.display = 'none';
                    alert('Payment error: ' + error.message);
                    payBtn.disabled = false;
                })
                .processPesapalPayment(selectedMethod, mobileNumber);
        });
    </script>
</body>
</html>`;
}

// ===== PESAPAL PAYMENT PROCESSING =====
function processPesapalPayment(paymentMethod, mobileNumber) {
  try {
    console.log('Processing Pesapal payment with method:', paymentMethod, 'mobile:', mobileNumber);

    // Get form data from the current form submission
    const form = FormApp.getActiveForm();
    const responses = form.getResponses();
    const latestResponse = responses[responses.length - 1];
    const itemResponses = latestResponse.getItemResponses();

    // Extract applicant data
    let applicantName = '';
    let applicantEmail = '';
    let applicantPhone = '';

    itemResponses.forEach(itemResponse => {
      const title = itemResponse.getItem().getTitle().toLowerCase();
      const response = itemResponse.getResponse();

      if (title.includes('full name') || title.includes('name')) {
        applicantName = response;
      } else if (title.includes('email')) {
        applicantEmail = response;
      } else if (title.includes('phone') && !title.includes('alternative')) {
        applicantPhone = response;
      }
    });

    // Use provided mobile number if different from form phone
    if (mobileNumber && mobileNumber !== applicantPhone) {
      applicantPhone = mobileNumber;
    }

    // Generate unique reference
    const reference = 'APP_' + new Date().getTime() + '_' + Math.random().toString(36).substr(2, 9);

    // Submit order to Pesapal
    const orderResult = submitPesapalOrder(
      applicantEmail,
      applicantPhone,
      APPLICATION_FEE,
      reference,
      applicantName,
      paymentMethod
    );

    if (orderResult) {
      // Log to Google Sheet
      logPaymentToSheet({
        timestamp: new Date().toISOString(),
        reference: reference,
        name: applicantName,
        email: applicantEmail,
        phone: applicantPhone,
        amount: APPLICATION_FEE,
        status: 'Pending',
        provider: paymentMethod.toUpperCase(),
        trackingId: orderResult.trackingId
      });

      // Send payment email
      sendPaymentEmail(applicantEmail, applicantName, reference, orderResult.redirectUrl);

      return {
        success: true,
        message: 'Payment initiated successfully. Check your email for payment instructions.',
        transactionId: reference,
        paymentLink: orderResult.redirectUrl
      };
    } else {
      return {
        success: false,
        message: 'Failed to initiate payment. Please try again or contact support.'
      };
    }

  } catch (error) {
    console.error('Pesapal payment processing error:', error);
    return {
      success: false,
      message: 'Payment processing failed: ' + error.message
    };
  }
}

// ===== GOOGLE SHEETS LOGGING =====
function logPaymentToSheet(paymentData) {
  try {
    if (!sheetId || sheetId === 'YOUR_ACTUAL_SHEET_ID_HERE') {
      console.log('Sheet ID not configured - skipping logging');
      return;
    }

    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheets()[0]; // First sheet

    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Reference', 'Name', 'Email', 'Phone', 'Amount', 'Status', 'Provider', 'TrackingID']);
    }

    // Add payment data
    sheet.appendRow([
      paymentData.timestamp,
      paymentData.reference,
      paymentData.name,
      paymentData.email,
      paymentData.phone,
      paymentData.amount,
      paymentData.status,
      paymentData.provider,
      paymentData.trackingId
    ]);

    console.log('Payment logged to sheet successfully');
  } catch (error) {
    console.error('Sheet logging error:', error);
  }
}

// ===== EMAIL FUNCTIONS =====
function sendPaymentEmail(email, name, reference, paymentUrl) {
  try {
    const subject = 'Eyecab International University - Payment Required';

    let paymentInstructions = '';
    if (paymentUrl) {
      paymentInstructions = `
Click here to complete your payment: ${paymentUrl}

Or use the payment link above to complete your mobile money payment.`;
    } else {
      paymentInstructions = `
Your payment request has been created. You will receive a mobile money prompt shortly.

If you don't receive the prompt within 2 minutes, please contact our admissions office.`;
    }

    const body = `
Dear ${name},

Thank you for submitting your application to Eyecab International University.

To complete your application process, please complete the payment of UGX 50,000 using Mobile Money.

Payment Reference: ${reference}

${paymentInstructions}

Payment Methods:
- MTN Mobile Money
- Airtel Money

Your application will be processed once payment is confirmed.

If you have any questions, please contact our admissions office.

Best regards,
Admissions Office
Eyecab International University
    `;

    MailApp.sendEmail(email, subject, body);
    console.log('Payment email sent successfully to:', email);
  } catch (error) {
    console.error('Email sending error:', error);
  }
}

// ===== FORM TRIGGER FUNCTIONS =====
function showPaymentDialog() {
  const html = HtmlService
    .createHtmlOutput(getPaymentDialogHtml())
    .setWidth(550)
    .setHeight(700);

  FormApp.getUi().showModalDialog(html, 'Complete Payment');
}

function onFormSubmit(e) {
  try {
    console.log('Form submitted - showing payment dialog');

    // Show payment dialog immediately
    showPaymentDialog();

    // Optional: Send initial confirmation email
    const response = e.response;
    const itemResponses = response.getItemResponses();

    let applicantEmail = '';
    itemResponses.forEach(itemResponse => {
      if (itemResponse.getItem().getTitle().toLowerCase().includes('email')) {
        applicantEmail = itemResponse.getResponse();
      }
    });

    if (applicantEmail) {
      // Send initial confirmation
      const subject = 'Eyecab International University - Application Received';
      const body = `
Dear Applicant,

Thank you for submitting your application to Eyecab International University.

Your application has been received and is being processed. You will now be prompted to complete the application fee payment.

If you have any questions, please contact our admissions office.

Best regards,
Admissions Office
Eyecab International University
      `;
      MailApp.sendEmail(applicantEmail, subject, body);
    }

  } catch (error) {
    console.error('Form submit trigger error:', error);
  }
}

// ===== WEBHOOK HANDLER =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    console.log('Webhook received:', data);

    // Update payment status in sheet
    if (data.OrderTrackingId && data.OrderNotificationType) {
      updatePaymentStatus(data.OrderTrackingId, data.OrderNotificationType);
    }

    return ContentService
      .createTextOutput('OK')
      .setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    console.error('Webhook processing error:', error);
    return ContentService
      .createTextOutput('ERROR')
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function updatePaymentStatus(trackingId, status) {
  try {
    if (!sheetId || sheetId === 'YOUR_ACTUAL_SHEET_ID_HERE') {
      console.log('Sheet ID not configured - skipping status update');
      return;
    }

    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheets()[0];
    const data = sheet.getDataRange().getValues();

    // Find row with matching tracking ID
    for (let i = 1; i < data.length; i++) { // Start from row 1 (skip headers)
      if (data[i][8] === trackingId) { // TrackingID is in column I (index 8)
        const statusCell = sheet.getRange(i + 1, 7); // Status is in column G (index 6)
        statusCell.setValue(status === 'COMPLETED' ? 'Completed' : 'Failed');

        // Send confirmation email if payment completed
        if (status === 'COMPLETED') {
          const email = data[i][3]; // Email is in column D (index 3)
          const name = data[i][2]; // Name is in column C (index 2)
          sendConfirmationEmail(email, name);
        }
        break;
      }
    }
  } catch (error) {
    console.error('Status update error:', error);
  }
}

function sendConfirmationEmail(email, name) {
  try {
    const subject = 'Eyecab International University - Payment Confirmed';

    const body = `
Dear ${name},

Congratulations! Your payment has been successfully processed.

Your application to Eyecab International University is now complete and will be reviewed by our admissions committee.

Payment Amount: UGX 50,000
Status: Confirmed

You will receive further communication regarding your application status within 2-3 business days.

If you have any questions, please contact our admissions office.

Best regards,
Admissions Office
Eyecab International University
    `;

    MailApp.sendEmail(email, subject, body);
    console.log('Confirmation email sent successfully to:', email);
  } catch (error) {
    console.error('Confirmation email error:', error);
  }
}

// ===== SETUP FUNCTIONS =====
function setupFormTrigger() {
  const form = FormApp.openById("1FAIpQLScdO3jfZagNU2g5qZpoy9wsM2bvuY_8rcyJSgMDIEA120gJDA");

  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onFormSubmit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create new trigger
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('✅ Form submit trigger created successfully!');
}

// ===== TEST FUNCTIONS =====
function testPesapalConnection() {
  try {
    Logger.log('��� Testing Pesapal connection...');

    const token = getPesapalAccessToken();
    if (token) {
      Logger.log('✅ Pesapal token obtained successfully');
      Logger.log('Token preview: ' + token.substring(0, 20) + '...');

      const ipnId = registerPesapalIPN();
      if (ipnId) {
        Logger.log('✅ IPN registered successfully: ' + ipnId);
      } else {
        Logger.log('❌ IPN registration failed');
      }
    } else {
      Logger.log('❌ Failed to get Pesapal token');
    }

  } catch (error) {
    Logger.log('❌ Pesapal connection test failed: ' + error.message);
  }
}

function testPaymentPopup() {
  try {
    Logger.log('��� Testing payment popup...');
    showPaymentDialog();
    Logger.log('✅ Payment dialog triggered successfully');
  } catch (error) {
    Logger.log('❌ Payment dialog test failed: ' + error.message);
  }
}

// ===== DEBUG FUNCTION =====
function debugFormSetup() {
  try {
    Logger.log('��� Debugging form setup...');

    // Check form access
    const form = FormApp.openById("1FAIpQLScdO3jfZagNU2g5qZpoy9wsM2bvuY_8rcyJSgMDIEA120gJDA");
    Logger.log('✅ Form accessible: ' + form.getTitle());
    Logger.log('Form ID: ' + form.getId());
    Logger.log('Form URL: https://docs.google.com/forms/d/' + form.getId());

    // Check triggers
    const triggers = ScriptApp.getProjectTriggers();
    const formTrigger = triggers.find(trigger =>
      trigger.getHandlerFunction() === 'onFormSubmit'
    );

    if (formTrigger) {
      Logger.log('✅ Form submit trigger found');
      Logger.log('Trigger ID: ' + formTrigger.getUniqueId());
    } else {
      Logger.log('❌ No form submit trigger found - run setupFormTrigger()');
    }

    // Check permissions
    try {
      MailApp.sendEmail(Session.getActiveUser().getEmail(), 'Test', 'Test');
      Logger.log('✅ Email permissions working');
    } catch (emailError) {
      Logger.log('⚠️ Email permissions may need setup: ' + emailError.message);
    }

    Logger.log('��� Debug complete - check logs above for issues');

  } catch (error) {
    Logger.log('❌ Debug failed: ' + error.message);
  }
}

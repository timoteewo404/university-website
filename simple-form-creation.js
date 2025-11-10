// ===== SIMPLE GOOGLE FORM CREATION FOR PESAPAL INTEGRATION =====

/**
 * Create a basic application form for payment integration
 * Run this function in Google Apps Script to create your form
 */
function createApplicationForm() {
  // Create new form
  const form = FormApp.create('Eyecab International University Application Form');
  form.setDescription('Complete your application and make payment');
  
  // Add basic required fields
  form.addTextItem()
    .setTitle('Full Name')
    .setRequired(true);
    
  form.addTextItem()
    .setTitle('Email Address')
    .setRequired(true)
    .setValidation(FormApp.createTextValidation()
      .requireTextIsEmail()
      .build());
    
  form.addTextItem()
    .setTitle('Phone Number')
    .setRequired(true)
    .setHelpText('Enter Uganda number: +256XXXXXXXXX or 07XXXXXXXX');
    
  // Add more sections as needed
  form.addPageBreakItem().setTitle('Additional Information');
  
  form.addTextItem()
    .setTitle('Program of Interest')
    .setRequired(true);
    
  form.addParagraphTextItem()
    .setTitle('Why do you want to study at our university?')
    .setRequired(false);
    
  // Enable email collection
  form.setCollectEmail(true);
  
  // Create linked spreadsheet for responses
  const spreadsheet = SpreadsheetApp.create('Application Form Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
  
  Logger.log('✅ Form created successfully!');
  Logger.log('Form URL: ' + form.getPublishedUrl());
  Logger.log('Form Edit URL: ' + form.getEditUrl());
  Logger.log('Spreadsheet URL: ' + spreadsheet.getUrl());
  
  return form;
}

/**
 * Alternative: Use your existing form
 * If you already have a form, just get its ID and set up the trigger
 */
function setupExistingForm() {
  // Replace with your existing form ID
  const formId = '1FAIpQLScdO3jfZagNU2g5qZpoy9wsM2bvuY_8rcyJSgMDIEA120gJDA';
  
  try {
    const form = FormApp.openById(formId);
    Logger.log('✅ Connected to existing form: ' + form.getTitle());
    Logger.log('Form URL: ' + form.getPublishedUrl());
    
    // Set up the trigger for payment integration
    setupPaymentTrigger(form);
    
    return form;
  } catch (error) {
    Logger.log('❌ Error accessing form: ' + error.message);
    return null;
  }
}

/**
 * Set up the payment trigger for form submission
 */
function setupPaymentTrigger(form) {
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
    
  Logger.log('✅ Payment trigger set up successfully!');
}

// ===== USAGE =====
// To create a new form, run: createApplicationForm()
// To use existing form, run: setupExistingForm()

// Your existing form ID: 1FAIpQLScdO3jfZagNU2g5qZpoy9wsM2bvuY_8rcyJSgMDIEA120gJDA
// If you want to use your existing comprehensive form, just run setupExistingForm()

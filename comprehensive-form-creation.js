// ===== COMPREHENSIVE FORM CREATION =====
// Based on your original Makerere University form structure

function createEyecabApplicationForm() {
  const form = FormApp.create("Eyecab International University Online Application Form");
  form.setTitle("Eyecab International University Online Application Form")
      .setDescription("Apply for admission to Eyecab International University. Fill out all required sections carefully.");

  // --- SECTION 1: Personal Information ---
  form.addPageBreakItem().setTitle("Section 1: Personal Information");

  form.addTextItem().setTitle("Full Name (as it appears on your ID)").setRequired(true);
  form.addTextItem().setTitle("Email Address").setRequired(true);
  form.addTextItem().setTitle("Phone Number").setRequired(true);
  form.addTextItem().setTitle("Alternative Phone Number").setRequired(false);
  form.addTextItem().setTitle("Nationality").setRequired(true);
  form.addTextItem().setTitle("Country of Birth").setRequired(true);
  form.addTextItem().setTitle("District of Birth").setRequired(true);
  form.addTextItem().setTitle("Sub-county/Town of Birth").setRequired(false);
  form.addTextItem().setTitle("Gender").setRequired(true);
  form.addDateItem().setTitle("Date of Birth").setRequired(true);
  form.addTextItem().setTitle("Marital Status").setRequired(true);
  form.addTextItem().setTitle("Religion").setRequired(false);

  // Contact Information
  form.addTextItem().setTitle("Permanent Home Address").setRequired(true);
  form.addTextItem().setTitle("Current Residence Address").setRequired(false);

  // Next of Kin Information
  form.addTextItem().setTitle("Next of Kin Full Name").setRequired(true);
  form.addTextItem().setTitle("Next of Kin Relationship").setRequired(true);
  form.addTextItem().setTitle("Next of Kin Phone Number").setRequired(true);
  form.addTextItem().setTitle("Next of Kin Email Address").setRequired(false);

  // --- SECTION 2: Academic Background ---
  form.addPageBreakItem().setTitle("Section 2: Academic Background");

  form.addTextItem().setTitle("Highest Qualification Attained").setRequired(true);
  form.addTextItem().setTitle("Year of Completion").setRequired(true);
  form.addTextItem().setTitle("Previous Institution Attended").setRequired(true);
  form.addTextItem().setTitle("Institution Address").setRequired(false);
  form.addTextItem().setTitle("Index Number / Registration Number").setRequired(true);
  form.addTextItem().setTitle("Overall Grade/Aggregate").setRequired(true);

  // O-Level Results
  form.addParagraphTextItem().setTitle("O-Level Subjects and Grades")
      .setHelpText("List your O-Level subjects and corresponding grades (e.g., Mathematics: A, English: B, etc.)")
      .setRequired(true);

  // A-Level Results (if applicable)
  form.addParagraphTextItem().setTitle("A-Level Subjects and Grades (if applicable)")
      .setHelpText("List your A-Level subjects and corresponding grades")
      .setRequired(false);

  // --- SECTION 3: Program Selection ---
  form.addPageBreakItem().setTitle("Section 3: Program Selection");

  // Study Mode
  form.addMultipleChoiceItem()
      .setTitle("Preferred Study Mode")
      .setChoiceValues(["Full-time", "Part-time", "Distance Learning", "Evening Classes"])
      .setRequired(true);

  // Program List (comprehensive)
  const allPrograms = [
    // CHS Programs
    "CHS - Bachelor of Medicine and Surgery",
    "CHS - Bachelor of Dental Surgery",
    "CHS - Bachelor of Pharmacy",
    "CHS - Bachelor of Nursing Science",
    "CHS - Bachelor of Environmental Health Sciences",
    "CHS - Bachelor of Biomedical Engineering",
    "CHS - Bachelor of Optometry",
    "CHS - Bachelor of Medical Radiography",
    "CHS - Bachelor of Science in Speech and Language Therapy",
    "CHS - Bachelor of Cytotechnology",

    // CAES Programs
    "CAES - Bachelor of Science in Agriculture",
    "CAES - Bachelor of Food Science and Technology",
    "CAES - Bachelor of Agribusiness Management",
    "CAES - Bachelor of Agricultural Engineering",
    "CAES - Bachelor of Human Nutrition and Dietetics",
    "CAES - Bachelor of Forestry",
    "CAES - Bachelor of Environmental Science",
    "CAES - Bachelor of Tourism and Hospitality Management",
    "CAES - Bachelor of Bioprocessing Engineering",
    "CAES - Bachelor of Water and Irrigation Engineering",

    // COBAMS Programs
    "COBAMS - Bachelor of Commerce",
    "COBAMS - Bachelor of Business Administration",
    "COBAMS - Bachelor of Statistics",
    "COBAMS - Bachelor of Arts in Economics",
    "COBAMS - Bachelor of Quantitative Economics",
    "COBAMS - Bachelor of Population Studies",
    "COBAMS - Bachelor of Actuarial Science",

    // CHUSS Programs
    "CHUSS - Bachelor of Social Work and Social Administration",
    "CHUSS - Bachelor of Arts in Social Sciences",
    "CHUSS - Bachelor of Journalism and Communication",
    "CHUSS - Bachelor of Arts",
    "CHUSS - Bachelor of Arts in Music",
    "CHUSS - Bachelor of Applied Psychology",
    "CHUSS - Bachelor of Chinese and Asian Studies",
    "CHUSS - Bachelor of Applied Psychology",
    "CHUSS - Bachelor of Chinese and Asian Studies",
    "CHUSS - Diploma in Performing Arts",

    // CEES Programs
    "CEES - Bachelor of Arts with Education",
    "CEES - Bachelor of Science with Education",
    "CEES - Bachelor of Adult and Community Education",
    "CEES - Bachelor of Early Childhood Care and Education",
    "CEES - Bachelor of Youth in Development Work (External)",
    "CEES - Bachelor of Education (for Diploma holders)",

    // CONAS Programs
    "CONAS - Bachelor of Science in Fisheries and Aquaculture",
    "CONAS - Bachelor of Sports Science",
    "CONAS - Bachelor of Science (Biological)",
    "CONAS - Bachelor of Science (Physical)",
    "CONAS - Bachelor of Science in Petroleum Geoscience & Production",
    "CONAS - Bachelor of Science in Conservation Biology",
    "CONAS - Bachelor of Science in Biotechnology",

    // COCIS Programs
    "COCIS - Bachelor of Science in Computer Science",
    "COCIS - Bachelor of Information Systems and Technology",
    "COCIS - Bachelor of Software Engineering",
    "COCIS - Bachelor of Library and Information Science",

    // COVAB Programs
    "COVAB - Bachelor of Veterinary Medicine",
    "COVAB - Bachelor of Biomedical Laboratory Technology",
    "COVAB - Bachelor of Animal Production Technology and Management",
    "COVAB - Bachelor of Medical Laboratory Technology",
    "COVAB - Bachelor of Industrial Livestock and Business"
  ];

  form.addListItem()
    .setTitle("Select Your Desired Programme")
    .setChoiceValues(allPrograms)
    .setRequired(true);

  // Alternative Program Choice
  form.addListItem()
    .setTitle("Alternative Programme Choice (Optional)")
    .setChoiceValues(allPrograms)
    .setRequired(false);

  // --- SECTION 4: Financial Information ---
  form.addPageBreakItem().setTitle("Section 4: Financial Information");

  form.addMultipleChoiceItem()
      .setTitle("How will you finance your studies?")
      .setChoiceValues([
        "Self-sponsored",
        "Government sponsorship",
        "Private sponsorship",
        "Scholarship",
        "Student loan",
        "Other"
      ])
      .setRequired(true);

  form.addTextItem().setTitle("If sponsored, please provide sponsor details").setRequired(false);

  // --- SECTION 5: Medical Information ---
  form.addPageBreakItem().setTitle("Section 5: Medical Information");

  form.addMultipleChoiceItem()
      .setTitle("Do you have any medical conditions we should be aware of?")
      .setChoiceValues(["Yes", "No"])
      .setRequired(true);

  form.addParagraphTextItem()
      .setTitle("If yes, please provide details")
      .setRequired(false);

  form.addMultipleChoiceItem()
      .setTitle("Do you have any disabilities?")
      .setChoiceValues(["Yes", "No"])
      .setRequired(true);

  form.addParagraphTextItem()
      .setTitle("If yes, please specify the nature of disability and any support needs")
      .setRequired(false);

  // --- SECTION 6: Supporting Documents ---
  form.addPageBreakItem().setTitle("Section 6: Supporting Documents");

  form.addParagraphTextItem().setTitle("Document Upload Instructions")
      .setHelpText("Please prepare the following documents for upload after form submission:\\n\\nREQUIRED DOCUMENTS:\\n• Academic certificates/transcripts (O-Level and A-Level)\\n• National ID/Passport\\n• Birth certificate\\n• Recent passport-size photos (2 copies)\\n• Medical certificate\\n\\nOPTIONAL DOCUMENTS:\\n• Recommendation letters\\n• Awards/certificates\\n• Proof of sponsorship\\n\\nYou will receive a confirmation email with secure upload instructions after submitting this form.");

  form.addMultipleChoiceItem()
      .setTitle("Do you understand that document uploads will be requested after form submission?")
      .setChoiceValues(["Yes, I understand and will prepare the documents"])
      .setRequired(true);

  // --- SECTION 7: Declaration and Consent ---
  form.addPageBreakItem().setTitle("Section 7: Declaration and Consent");

  form.addParagraphTextItem()
      .setTitle("Declaration")
      .setHelpText("I hereby declare that:\\n\\n1. The information given above is true and correct to the best of my knowledge.\\n2. I understand that providing false information may result in disqualification from admission.\\n3. I agree to abide by the rules and regulations of Eyecab International University.\\n4. I authorize the University to verify the information provided.\\n5. I understand that admission is subject to meeting all requirements and availability of space.");

  form.addMultipleChoiceItem()
      .setTitle("Do you agree to the declaration above?")
      .setChoiceValues(["Yes, I Agree"])
      .setRequired(true);

  // Data Protection Consent
  form.addParagraphTextItem()
      .setTitle("Data Protection Consent")
      .setHelpText("I consent to the collection, processing, and storage of my personal data for admission purposes in accordance with data protection laws.");

  form.addMultipleChoiceItem()
      .setTitle("Do you consent to data processing?")
      .setChoiceValues(["Yes, I Consent"])
      .setRequired(true);

  // Enable email collection
  form.setCollectEmail(true);

  // Create linked spreadsheet
  const spreadsheet = SpreadsheetApp.create('Eyecab Application Form Responses');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());

  Logger.log("✅ Eyecab International University Application Form created successfully!");
  Logger.log('Form URL: ' + form.getPublishedUrl());
  Logger.log('Form Edit URL: ' + form.getEditUrl());
  Logger.log('Spreadsheet URL: ' + spreadsheet.getUrl());

  return form;
}

// ===== SETUP FUNCTION =====
function setupComprehensiveFormWithPayment() {
  // Create the comprehensive form
  const form = createEyecabApplicationForm();

  // Set up the payment trigger
  setupPaymentTrigger(form);

  Logger.log('✅ Comprehensive form with payment integration created successfully!');
}

// ===== TRIGGER SETUP =====
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
// Run this function to create the comprehensive form:
// createEyecabApplicationForm()

// Or run this to create form + setup trigger:
// setupComprehensiveFormWithPayment()

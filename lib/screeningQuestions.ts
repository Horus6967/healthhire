export type ScreeningQuestion = { id: string; question: string; type: "text" };

const questionSets: Record<string, string[]> = {
  "Registered Nurse (RN)": [
    "A med-surg patient has a potassium of 2.9 mmol/L and is on telemetry. What do you do first, and why?",
    "You have four patients: new chest pain, a scheduled IV antibiotic, discharge teaching, and a pain request. How do you prioritize?",
    "A family member asks you to skip a medication because the patient is \"allergic to everything.\" How do you respond?",
    "How would you recognize early sepsis in a post-op patient?",
    "You realize you gave a medication 30 minutes late. What do you do?",
  ],
  "Licensed Practical Nurse (LPN)": [
    "A patient's glucose is 52 mg/dL and they're drowsy, and the RN is busy. What do you do?",
    "Which tasks can you delegate to a CNA, and which must stay with the RN?",
    "A patient refuses a scheduled dose. How do you document it?",
    "A post-op incision shows increasing redness and drainage. What do you check and report?",
    "How does a controlled-substance count discrepancy differ from a documentation error?",
  ],
  "Physician / MD": [
    "A 68-year-old has chest pain radiating to the left arm. Walk through your first 10 minutes.",
    "When would you order a CT with contrast for suspected PE, and what do you check first?",
    "How do you counsel a new type 2 diabetes patient about starting metformin?",
    "A warfarin patient has an INR of 6.5 with no bleeding. How do you manage it?",
    "How do you disclose a medical error to a patient and family?",
  ],
  "Physician Assistant (PA)": [
    "A patient on lisinopril develops a dry cough and facial swelling. What is your management?",
    "When do you manage new hypertension in primary care versus refer to a specialist?",
    "How do you decide whether a febrile child needs antibiotics?",
    "Your supervising physician is unreachable and a patient needs antibiotics for pneumonia. What is your plan?",
    "How do you document a patient who declines recommended care?",
  ],
  "Nurse Practitioner (NP)": [
    "A 45-year-old with BP 160/100 and no symptoms: what is your workup and first-line treatment?",
    "How do you screen for postpartum depression at a 6-week visit?",
    "When does your state's scope of practice require physician collaboration?",
    "A patient wants antibiotics for a viral sore throat. How do you respond?",
    "How do you manage a child with suspected meningitis in an outpatient clinic?",
  ],
  "Physical Therapist (PT)": [
    "A knee replacement patient can't reach 90 degrees of flexion at week 3. What is your plan?",
    "How do you assess and document fall risk in an older adult?",
    "When do you refer a low back pain patient for imaging?",
    "A patient has leg numbness and ankle weakness. What red flags do you check?",
    "How do you set realistic goals with a patient who wants to return to heavy lifting?",
  ],
  "Occupational Therapist (OT)": [
    "A stroke patient can't button a shirt or hold utensils. What is your assessment and plan?",
    "What home modifications would you recommend for someone with mild cognitive impairment?",
    "How do you adapt daily tasks for a patient with hand arthritis?",
    "What do you check before recommending a wheelchair?",
    "How do you coordinate with PT and nursing on a discharge plan?",
  ],
  "Pharmacist": [
    "A patient brings prescriptions for warfarin and a new antibiotic. What do you check?",
    "A prescription appears to exceed the maximum dose. What do you do?",
    "A patient's brand-name medication is out of stock. How do you proceed?",
    "How do you counsel a patient starting an SSRI about side effects and adherence?",
    "A physician's order conflicts with a documented allergy. What do you do?",
  ],
  "Medical Assistant (MA)": [
    "How do you prepare a patient and room for a routine blood draw?",
    "A patient's blood pressure reads 185/120. What do you do?",
    "A patient is upset about a long wait. How do you respond?",
    "How do you room a patient with a suspected contagious illness?",
    "What do you verify before a patient receives a vaccine?",
  ],
  "Radiologic Technologist": [
    "How do you verify patient identity and the correct exam before imaging?",
    "A pregnant patient is scheduled for an X-ray. What do you check and do?",
    "How do you keep radiation dose low while still getting diagnostic images?",
    "A patient can't stay still for an MRI. What options do you consider?",
    "You notice a possible critical finding on an image. What do you do?",
  ],
  "Respiratory Therapist": [
    "A COPD patient's SpO2 drops to 84% on 2 L nasal cannula. What do you do?",
    "How do you assess readiness to wean from a ventilator?",
    "How do you set up a nebulizer treatment and what do you monitor afterward?",
    "A patient on BiPAP becomes agitated. What is your immediate response?",
    "How do you document a patient's response to a bronchodilator?",
  ],
  "Emergency Medical Technician (EMT)": [
    "At a car accident, a conscious patient reports neck pain. What is your spinal precaution approach?",
    "How do you triage multiple patients at a mass-casualty scene?",
    "A patient's glucose reads 48 mg/dL. What do you give?",
    "When can you refuse transport, and what must you document?",
    "What are your steps for a cardiac arrest before ALS arrives?",
  ],
  "Surgical Technologist": [
    "How do you set up the sterile field before a procedure?",
    "The surgeon asks for an instrument you can't find. What do you do?",
    "How do you count sponges and sharps at the end of a case, and what if a count is off?",
    "You accidentally touch a non-sterile surface. What do you do?",
    "How do you anticipate the surgeon's next instrument needs?",
  ],
  "Dentist": [
    "A patient has a cracked molar with cold sensitivity. What is your diagnosis and plan?",
    "How do you confirm medical history before a procedure?",
    "How do you treat a patient with dental anxiety?",
    "When do you refer a patient for oral surgery?",
    "How do you manage uncontrolled bleeding after an extraction?",
  ],
  "Other Healthcare Professional": [
    "Describe your role and how it fits into patient care.",
    "How do you verify a colleague's credentials?",
    "A patient asks something outside your scope. How do you respond?",
    "How do you protect patient information in a shared workspace?",
    "Describe a time you disagreed with a teammate about patient care.",
  ],
};

export function getScreeningQuestions(specialty: string): ScreeningQuestion[] {
  const texts = questionSets[specialty] ?? questionSets["Other Healthcare Professional"];
  return texts.map((question, i) => ({ id: `q${i + 1}`, question, type: "text" as const }));
}

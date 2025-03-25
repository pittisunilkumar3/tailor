
export interface ValidationError {
  field: string;
  message: string;
}

// Sanitize input to prevent XSS
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};

export const validateMeasurementForm = (formData: Record<string, any>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate personal information
  const sanitizedName = sanitizeInput(formData.name || '');
  if (!sanitizedName) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (sanitizedName.length < 3) {
    errors.push({ field: 'name', message: 'Name must be at least 3 characters' });
  } else if (sanitizedName.length > 50) {
    errors.push({ field: 'name', message: 'Name must not exceed 50 characters' });
  } else if (!/^[A-Za-z\s.'-]+$/.test(sanitizedName)) {
    errors.push({ field: 'name', message: 'Name contains invalid characters' });
  }

  const sanitizedRegNumber = sanitizeInput(formData.registerNumber || '');
  if (!sanitizedRegNumber) {
    errors.push({ field: 'registerNumber', message: 'Register number is required' });
  } else if (!/^[A-Z0-9]{6,12}$/i.test(sanitizedRegNumber)) {
    errors.push({ field: 'registerNumber', message: 'Register number must be 6-12 characters long and contain only letters and numbers' });
  }

  const sanitizedPhone = sanitizeInput(formData.phoneNumber || '');
  const phoneDigits = sanitizedPhone.replace(/\D/g, '');
  if (!sanitizedPhone) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  } else if (!/^(\+91)?[6-9]\d{9}$/.test(phoneDigits)) {
    errors.push({ field: 'phoneNumber', message: 'Please enter a valid Indian mobile number' });
  }

  // Validate child information
  const sanitizedChildName = sanitizeInput(formData.childName || '');
  if (!sanitizedChildName) {
    errors.push({ field: 'childName', message: 'Child\'s name is required' });
  } else if (sanitizedChildName.length < 2) {
    errors.push({ field: 'childName', message: 'Child\'s name must be at least 2 characters' });
  } else if (sanitizedChildName.length > 50) {
    errors.push({ field: 'childName', message: 'Child\'s name must not exceed 50 characters' });
  } else if (!/^[A-Za-z\s.'-]+$/.test(sanitizedChildName)) {
    errors.push({ field: 'childName', message: 'Child\'s name contains invalid characters' });
  }

  if (!formData.childAge || formData.childAge.trim() === '') {
    errors.push({ field: 'childAge', message: 'Child\'s age is required' });
  } else {
    const age = Number(formData.childAge);
    if (isNaN(age) || !Number.isInteger(age)) {
      errors.push({ field: 'childAge', message: 'Age must be a whole number' });
    } else if (age < 0 || age > 18) {
      errors.push({ field: 'childAge', message: 'Age must be between 0 and 18 years' });
    }
  }

  const validGenders = ['male', 'female', 'other'];
  const sanitizedGender = sanitizeInput(formData.childGender || '').toLowerCase();
  if (!sanitizedGender) {
    errors.push({ field: 'childGender', message: 'Please select child\'s gender' });
  } else if (!validGenders.includes(sanitizedGender)) {
    errors.push({ field: 'childGender', message: 'Please select a valid gender' });
  }

  // Validate city
  const validCities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Vizag'
  ];
  
  const sanitizedCity = sanitizeInput(formData.city || '');
  if (!sanitizedCity) {
    errors.push({ field: 'city', message: 'Please select a city' });
  } else if (!validCities.includes(sanitizedCity)) {
    errors.push({ field: 'city', message: 'Please select a valid city' });
  }

  // Validate measurements with realistic ranges (in inches)
  const measurementFields = [
    { key: 'fullLengthShoulderToToe', label: 'Full Length (Shoulder to Toe)' },
    { key: 'shoulderToShoulder', label: 'Shoulder to Shoulder' },
    { key: 'neckRound', label: 'Neck Round' },
    { key: 'upperChestRound', label: 'Upper Chest Round' },
    { key: 'middleChestRound', label: 'Middle Chest Round' },
    { key: 'waistRound', label: 'Waist Round' },
    { key: 'hipRound', label: 'Hip Round' },
    { key: 'fullSleeveLength', label: 'Full Sleeve Length' },
    { key: 'wristRound', label: 'Wrist Round' },
    { key: 'elbowRound', label: 'Elbow Round' },
    { key: 'elbowSleeveLength', label: 'Elbow Sleeve Length' },
    { key: 'shortSleeveLength', label: 'Short Sleeve Length' },
    { key: 'armRound', label: 'Arm Round' },
    { key: 'armWholeRound', label: 'Arm Whole Round' },
    { key: 'waistToToeLength', label: 'Waist to Toe Length' },
    { key: 'waistToKneeLength', label: 'Waist to Knee Length' },
    { key: 'thighRound', label: 'Thigh Round' },
    { key: 'ankleRound', label: 'Ankle Round' }
  ];

  const measurementRanges = {
    fullLengthShoulderToToe: { min: 20, max: 60 },
    shoulderToShoulder: { min: 8, max: 20 },
    neckRound: { min: 8, max: 20 },
    upperChestRound: { min: 20, max: 40 },
    middleChestRound: { min: 20, max: 40 },
    waistRound: { min: 16, max: 40 },
    hipRound: { min: 20, max: 45 },
    fullSleeveLength: { min: 12, max: 25 },
    wristRound: { min: 4, max: 10 },
    elbowRound: { min: 6, max: 15 },
    elbowSleeveLength: { min: 8, max: 20 },
    shortSleeveLength: { min: 4, max: 12 },
    armRound: { min: 6, max: 18 },
    armWholeRound: { min: 8, max: 20 },
    waistToToeLength: { min: 20, max: 45 },
    waistToKneeLength: { min: 12, max: 25 },
    thighRound: { min: 12, max: 30 },
    ankleRound: { min: 6, max: 15 }
  };

  measurementFields.forEach(({ key, label }) => {
    const value = formData[key];
    if (value !== undefined && value !== '') {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        errors.push({ field: key, message: `${label} must be a valid number` });
      } else {
        const range = measurementRanges[key as keyof typeof measurementRanges];
        if (numValue < range.min || numValue > range.max) {
          errors.push({ 
            field: key, 
            message: `${label} must be between ${range.min} and ${range.max} inches` 
          });
        }
      }
    }
  });

  return errors;
};

export const getFieldError = (errors: ValidationError[], fieldName: string): string | undefined => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : undefined;
};

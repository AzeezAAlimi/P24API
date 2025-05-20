export const healthProfileData = {
  validHealthProfile: {
    medication: 'Pills',
    surgery: 'Back surgery',
    diagnoses: 'Chronic sleep',
    allergies: 'Peanuts',
    height: 100,
    weight: 100,
  },

  resetHealthProfile: {
    medication: 'medication',
    surgery: 'surgery',
    diagnoses: 'diagnoses',
    allergies: 'allergies',
    height: 100,
    weight: 100,
  },

  overLimitHealthProfile: {
    height: 99999999999999999,
    weight: 9999999999999999999999999999999999999999999,
  },

  stringInsteadOfNumber: {
    height: {},
    weight: [],
  },
};

export const healthProfileDataSet = [
  {
    testName: 'Valid height and weight',
    data: { height: 100, weight: 100 },
    expectedStatus: 200,
  },
  {
    testName: 'Too high height and weight',
    data: {
      height: 99999999999999999,
      weight: 9999999999999999999999999999999999999999999,
    },
    expectedStatus: 400,
  },
  {
    testName: 'Height and weight as strings',
    data: { height: 'fish', weight: 'rice' },
    expectedStatus: 400,
  },
];

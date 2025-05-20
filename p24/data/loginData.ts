import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.personalId;

export const loginData = {
  validlogin: {
    surname: 'Hansson',
    givenName: 'Alex',
    nationalPersonalId: personalId,
    personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
  },

  invalidlogin: {
    surname: 'Hansson',
    givenName: 'Alex',
    nationalPersonalId: '1994',
    personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
  },

  emptyLogin: {
    surname: 'Hansson',
    givenName: 'Alex',
    nationalPersonalId: '',
    personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
  },
};

export const loginDataSet = [
  {
    testName: 'Valid login',
    data: {
      surname: 'Hansson',
      givenName: 'Alex',
      nationalPersonalId: personalId,
      personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
    },
    expectedStatus: 200,
  },
  {
    testName: 'Invalid login',
    data: {
      surname: 'Hansson',
      givenName: 'Alex',
      nationalPersonalId: '1994',
      personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
    },
    expectedStatus: 500,
  },
  {
    testName: 'Empty login',
    data: {
      surname: 'Hansson',
      givenName: 'Alex',
      nationalPersonalId: '',
      personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
    },
    expectedStatus: 400,
  },
];

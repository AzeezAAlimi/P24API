import dotenv from 'dotenv';
dotenv.config();
const mobileNumberTest1 = process.env.mobileNumberTest1;
const mobileNumberTest2 = process.env.mobileNumberTest2;
const emailTest1 = process.env.emailTest1;
const emailTest2 = process.env.emailTest2;

export const contactData = {
  validContacts: {
    userContactInformation: {
      email: emailTest1,
      mobileNumber: mobileNumberTest1,
    },
  },

  resetContacts: {
    userContactInformation: {
      email: emailTest2,
      mobileNumber: mobileNumberTest2,
    },
  },
  incorrectContactType: {
    userContactInformation: {
      email: '2345678',
      mobileNumber: 'asdfghjkl',
    },
  },
  emptyContact: {
    userContactInformation: {
      email: 'null',
      mobileNumber: 'null',
    },
  },
};

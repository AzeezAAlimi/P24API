import dotenv from 'dotenv';
dotenv.config();
const mobileNumberTest1 = process.env.MOBILENUMBERTEST1;
const mobileNumberTest2 = process.env.MOBILENUMBERTEST2;
const emailTest1 = process.env.EMAILTEST1;
const emailTest2 = process.env.EMAILTEST2;

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

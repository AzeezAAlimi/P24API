export const healthProfileSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
    },
    height: { type: 'number' },
    weight: { type: 'number' },
    allergies: { type: ['string', 'null'] },
    medication: { type: ['string', 'null'] },
    surgery: { type: ['string', 'null'] },
    diagnoses: { type: ['string', 'null'] },
    interviewId: { type: ['string', 'null'], format: 'uuid' },
  },
  required: [
    'id',
    'height',
    'weight',
    'allergies',
    'diagnoses',
    'medication',
    'surgery',
  ],
  additionalProperties: false,
};

import mongoose from 'mongoose';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      indexed: false,
      description: 'User created this Contact',
    },
    email: {
      type: String,
      indexed: true,
      description: 'Email this Contact',
    },
    type: {
      type: String,
      indexed: true,
      description: 'Type of the onwer of this Contact',
      required: true,
    },
    phone: { type: String, description: 'Phone of user' },
  },
  {
    collection: 'contact',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

Schema.index({
  name: 'text',
  email: 'text',
  type: 'text',
  phone: 'text',
});

export default mongoose.model('Contact', Schema);

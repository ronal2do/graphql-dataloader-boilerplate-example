import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';
import { schema } from '../../schema';
import { setupTest } from '../../../test/helper';

import User from '../model/User';
import Contact from '../model/Contact';

beforeEach(async () => await setupTest());

it('should not allow anonymous user', async () => {
  // TODO: specify fields to create a new Contact
  const contact = new Contact({
    name: 'Example value',
    email: 'Example value',
    type: 'Example value',
    phone: 'Example value',
  });

  await contact.save();

  const contactId = toGlobalId('Contact', contact._id);

  const query = `
    mutation M {
      ContactEdit(input: {
        id: "${contactId}"
        example: "Example Field to Update"
      }) {
        contact {
          name
          email
          type
          phone
        }
      }
    }
  `;

  const rootValue = {};
  // No user should be passed to context since we are testing an anonymous session
  const context = {};

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});

it('should edit a record on database', async () => {
  const user = new User({
    name: 'user',
    email: 'user@example.com',
  });

  await user.save();

  // TODO: specify fields to create a new Contact
  const contact = new Contact({
    name: 'Example value',
    email: 'Example value',
    type: 'Example value',
    phone: 'Example value',
  });

  await contact.save();

  const contactId = toGlobalId('Contact', contact._id);

  const query = `
    mutation M {
      ContactEdit(input: {
        id: "${contactId}"
        example: "Example Field to Update"
      }) {
        contact {
          name
          email
          type
          phone
        }
      }
    }
  `;

  const rootValue = {};
  const context = { user };

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});

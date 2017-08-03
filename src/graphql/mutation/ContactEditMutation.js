// @flow

import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import { Contact } from '../../model';

import ContactType from '../type/ContactType';
import ContactLoader from '../loader/ContactLoader';

export default mutationWithClientMutationId({
  name: 'ContactEdit',
  inputFields: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
    phone: {
      type: GraphQLString,
    },
  },
  mutateAndGetPayload: async (args, { user }) => {
    // Verify if user is authorized
    if (!user) {
      throw new Error('Unauthorized user');
    }

    const { id, name, email, type, phone } = args;

    // Check if the provided ID is valid
    const contact = await Contact.findOne({
      _id: fromGlobalId(id).id,
    });

    // If not, throw an error
    if (!contact) {
      throw new Error('Invalid contactId');
    }

    // Edit record
    await contact.update({
      name,
      email,
      type,
      phone,
    });

    // TODO: mutation logic

    // Clear dataloader cache
    ContactLoader.clearCache(contact._id);

    return {
      id: contact._id,
      error: null,
    };
  },
  outputFields: {
    contact: {
      type: ContactType,
      resolve: (obj, args, { user }) => ContactLoader.load(user, obj.id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

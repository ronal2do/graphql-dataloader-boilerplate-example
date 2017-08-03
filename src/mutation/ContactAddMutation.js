// @flow

import { GraphQLString, GraphQLNonNull } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import Contact from '../model/Contact';

import ContactLoader from '../loader/ContactLoader';
import ContactConnection from '../connection/ContactConnection';

import ViewerType from '../type/ViewerType';

export default mutationWithClientMutationId({
  name: 'ContactAdd',
  inputFields: {
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
    // if (!user) {
    //   throw new Error('Unauthorized user');
    // }

    const { name, email, type, phone } = args;

    // Create new record
    const contact = await new Contact({
      name,
      email,
      type,
      phone,
    }).save();

    // TODO: mutation logic

    return {
      id: contact._id,
      error: null,
    };
  },
  outputFields: {
    contactEdge: {
      type: ContactConnection.edgeType,
      resolve: async ({ id }, args, { user }) => {
        // Load new edge from loader
        const contact = await ContactLoader.load(user, id);

        // Returns null if no node was loaded
        if (!contact) {
          return null;
        }

        return {
          cursor: toGlobalId('Contact', contact),
          node: contact,
        };
      },
    },
    viewer: {
      type: ViewerType,
      resolve: async (obj, args, { user }) => user,
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});

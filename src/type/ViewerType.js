// @flow

import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { globalIdField, connectionArgs, fromGlobalId } from 'graphql-relay';
import { NodeInterface } from '../interface/NodeInterface';

import UserType from './UserType';
import { UserLoader } from '../loader';
import UserConnection from '../connection/UserConnection';

import ContactType from './ContactType';
import { ContactLoader } from '../loader';
import ContactConnection from '../connection/ContactConnection';

export default new GraphQLObjectType({
  name: 'Viewer',
  description: '...',
  fields: () => ({
    id: globalIdField('Viewer'),
    me: {
      type: UserType,
      resolve: (root, args, context) => UserLoader.load(context, context.user._id),
    },
    user: {
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return UserLoader.load(context, id);
      },
    },
    users: {
      type: UserConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => UserLoader.loadUsers(context, args),
    },
    contact: {
      type: ContactType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: (obj, args, context) => {
        const { id } = fromGlobalId(args.id);
        return ContactLoader.load(context, id);
      },
    },
    contacts: {
      type: ContactConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => ContactLoader.loadContacts(context, args),
    },
    contactsSearch: {
      type: ContactConnection.connectionType,
      args: {
        ...connectionArgs,
        search: {
          type: GraphQLString,
        },
      },
      resolve: (obj, args, context) => ContactLoader.loadContactsSearch(context, args),
    },
  }),
  interfaces: () => [NodeInterface],
});

// @flow

import { GraphQLObjectType, GraphQLString } from 'graphql';
import { globalIdField } from 'graphql-relay';

import { NodeInterface } from '../interface/NodeInterface';

export default new GraphQLObjectType({
  name: 'Contact',
  description: 'Represents Contact',
  fields: () => ({
    id: globalIdField('Contact'),
    name: {
      type: GraphQLString,
      description: 'User created this Contact',
      resolve: obj => obj.name,
    },
    email: {
      type: GraphQLString,
      description: 'Email this Contact',
      resolve: obj => obj.email,
    },
    type: {
      type: GraphQLString,
      description: 'Type of the onwer of this Contact',
      resolve: obj => obj.type,
    },
    phone: {
      type: GraphQLString,
      description: 'Phone of user',
      resolve: obj => obj.phone,
    },
    createdAt: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.createdAt.toISOString(),
    },
    updatedAt: {
      type: GraphQLString,
      description: '',
      resolve: obj => obj.updatedAt.toISOString(),
    },
  }),
  interfaces: () => [NodeInterface],
});

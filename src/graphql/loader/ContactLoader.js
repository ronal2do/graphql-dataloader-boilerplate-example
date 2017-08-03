// @flow

import DataLoader from 'dataloader';
import { Contact as ContactModel } from '../../model';
import connectionFromMongoCursor from './ConnectionFromMongoCursor';
import mongooseLoader from './mongooseLoader';

import type { ConnectionArguments } from 'graphql-relay';
import type { GraphQLContext } from '../TypeDefinition';

type ContactType = {
  id: string,
  _id: string,
  name: string,
  email: string,
  type: string,
  phone: string,
  createdAt: string,
  updatedAt: string,
};

export default class Contact {
  id: string;
  _id: string;
  name: string;
  email: string;
  type: string;
  phone: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: ContactType, { contact }: GraphQLContext) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.email = data.email;
    this.type = data.type;
    this.phone = data.phone;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(ContactModel, ids));

const viewerCanSee = (viewer, data) => {
  // Anyone can se another user
  return true;
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: string) => {
  return dataloaders.ContactLoader.clear(id.toString());
};

const load = async (context: GraphQLContext, id: string): Promise<?User> => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.ContactLoader.load(id);
  } catch (err) {
    return null;
  }
  return viewerCanSee(context, data) ? new Contact(data, context) : null;
};

export const loadContacts = async (context: GraphQLContext) => {
  const contacts = ContactModel.find({}).sort({ createdAt: 1 });

  return connectionFromMongoCursor({
    cursor: contacts,
    context,
    loader: load,
  });
};
// add here custom loaders
export const loadContactsSearch = async (context: GraphQLContext, args: ConnectionArguments) => {
  if (!args.search) return null;

  const contacts = ContactModel.find(
    {
      disabled: { $ne: true },
      $text: { $search: args.search },
    },
    {
      score: { $meta: 'textScore' },
    },
  );

  return connectionFromMongoCursor({
    cursor: contacts,
    context,
    args,
    loader: load,
  });
};

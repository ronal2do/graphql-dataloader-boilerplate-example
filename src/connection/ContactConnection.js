// @flow

import { connectionDefinitions } from 'graphql-relay';

import ContactType from '../type/ContactType';

export default connectionDefinitions({
  name: 'Contact',
  nodeType: ContactType,
});

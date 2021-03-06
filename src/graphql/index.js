// @flow
import 'babel-polyfill';
import app from './app';
import connectDatabase from '../common/database';
import { graphqlPort } from '../common/config';

(async () => {
  try {
    const info = await connectDatabase();
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  } catch (error) {
    console.error('Unable to connect to database');
    process.exit(1);
  }

  await app.listen(graphqlPort);
  console.log(`Server started on port ${graphqlPort}`);
})();

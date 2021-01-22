import * as envLoader from 'load-env-var';

export default {
  jwt: {
    secret: envLoader.loadString('JWT_SECRET'),
  },
};

import * as dotenv from 'dotenv';
import * as envLoader from 'load-env-var';

dotenv.config({
  path: process.env.NODE_ENV === 'production' ? '.env' : '.dev.env',
});

export default {
  port: envLoader.loadNumber('PORT', { defaultValue: 5000 }),

  isProduction: process.env.NODE_ENV === 'production',
};

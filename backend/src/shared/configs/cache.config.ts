import * as envLoader from 'load-env-var';

import { RedisModuleOptions } from 'nestjs-redis';

export default {
  host: envLoader.loadString('CACHE_HOST'),
  port: envLoader.loadNumber('CACHE_PORT', { defaultValue: 6379 }),
} as RedisModuleOptions;

import * as envLoader from 'load-env-var';

import { SequelizeModuleOptions } from '@nestjs/sequelize';

export default {
  dialect: 'postgres',
  host: envLoader.loadString('DATABASE_HOST'),
  port: envLoader.loadNumber('DATABASE_PORT', { defaultValue: 5432 }),
  logging: false,
  native: true,
  pool: {
    max: 5,
    idle: 30000,
    acquire: 60000,
  },
  define: {
    underscored: false,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
  database: envLoader.loadString('DATABASE_NAME'),
  username: envLoader.loadString('DATABASE_USER'),
  password: envLoader.loadString('DATABASE_PASS'),
  models: ['modules/**/entities/*{.js,.ts}'],
  sync: {
    force: false,
    alter: true,
  },
  synchronize: true,
  autoLoadModels: true,
} as SequelizeModuleOptions;

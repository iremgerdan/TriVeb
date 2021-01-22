import pino from 'pino';

import envConfig from 'src/shared/configs/env.config';

export default pino(
  {
    level: envConfig.isProduction ? 'warn' : 'info',
    formatters: {
      level: (label: string) => ({ level: label }),
    },
    prettyPrint: envConfig.isProduction ? false : { translateTime: true, levelFirst: true },
  },
  envConfig.isProduction
    ? pino.destination(`logs/${new Date().toISOString()}_${process.pid}.log`)
    : null,
);

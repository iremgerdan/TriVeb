import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationError as ClassValidatorError } from 'class-validator';

import envConfig from 'src/shared/configs/env.config';
import serverLogger from 'src/shared/loggers/server.logger';

import { ValidationError, ValidationErrorType } from 'src/shared/errors/validation.error';
import { GlobalExceptionFilter } from 'src/shared/filters/global-exception.filter';

import { AppModule } from 'src/app.module';

(async () => {
  const fastify = new FastifyAdapter({
    logger: serverLogger,
  });

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastify);

  app.enableCors({
    origin: '*',
    methods: '*',
  });

  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ClassValidatorError[]) => {
        const errors: string[] = validationErrors
          .map((error: ClassValidatorError) =>
            Object.keys(error.constraints).map((key: string) => error.constraints[key]),
          )
          .flat();
        return new ValidationError(ValidationErrorType.INVALID_INPUT, errors.join(','));
      },
    }),
  );

  await app.listen(envConfig.port, envConfig.isProduction ? '0.0.0.0' : '127.0.0.1');
})();

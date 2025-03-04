export const backend = {
  'node-express': {
    name: 'Node.js Express Backend Stack',
    packages: [
      'express',
      'mongoose',
      'sequelize',
      'passport',
      'jsonwebtoken',
      'bcrypt',
      'cors',
      'helmet',
      'winston',
    ],
  },
  'nest-prisma': {
    name: 'NestJS Prisma Backend Stack',
    packages: [
      '@nestjs/core',
      '@nestjs/passport',
      'prisma',
      '@prisma/client',
      'class-validator',
      'class-transformer',
      'rxjs',
      'swagger-ui-express',
    ],
  },
};

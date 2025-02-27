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
  'django-python': {
    name: 'Django Python Backend Stack',
    packages: [
      'django',
      'djangorestframework',
      'django-cors-headers',
      'django-filter',
      'psycopg2-binary',
      'gunicorn',
      'drf-yasg',
    ],
  },
  'fastapi-python': {
    name: 'FastAPI Python Backend Stack',
    packages: [
      'fastapi',
      'uvicorn',
      'sqlalchemy',
      'pydantic',
      'alembic',
      'passlib',
      'python-jose',
      'httpx',
    ],
  },
};

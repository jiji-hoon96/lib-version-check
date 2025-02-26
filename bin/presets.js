export const PRESETS = {
    frontend: {
        'react-stack': {
            name: 'React Frontend Stack',
            packages: [
                'react',
                'react-dom',
                'next',
                'tailwindcss',
                'zustand',
                '@tanstack/react-query',
                'axios',
                'framer-motion',
                'react-router-dom'
            ]
        },
        'vue-stack': {
            name: 'Vue Frontend Stack',
            packages: [
                'vue',
                'vue-router',
                'pinia',
                'nuxt',
                'tailwindcss',
                'axios',
                '@vueuse/core',
                'vuex'
            ]
        },
        'svelte-stack': {
            name: 'Svelte Frontend Stack',
            packages: [
                'svelte',
                'sveltekit',
                'svelte-routing',
                'tailwindcss',
                'axios',
                'svelte-store'
            ]
        },
        'angular-stack': {
            name: 'Angular Frontend Stack',
            packages: [
                '@angular/core',
                '@angular/router',
                '@ngrx/store',
                'tailwindcss',
                'axios',
                'rxjs'
            ]
        }
    },


    backend: {
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
                'winston'
            ]
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
                'swagger-ui-express'
            ]
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
                'drf-yasg'
            ]
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
                'httpx'
            ]
        }
    },


    infra: {
        'docker-compose': {
            name: 'Docker & Container Management',
            packages: [
                'docker',
                'docker-compose',
                'kubernetes',
                'helm',
                'k3s',
                'minikube'
            ]
        },
        'cloud-aws': {
            name: 'AWS Cloud Infrastructure',
            packages: [
                'aws-sdk',
                'aws-amplify',
                'serverless',
                'aws-cdk',
                'dynamodb-local'
            ]
        },
        'cloud-gcp': {
            name: 'Google Cloud Platform Stack',
            packages: [
                '@google-cloud/storage',
                '@google-cloud/pubsub',
                'firebase-admin',
                'firebase',
                'gcloud'
            ]
        }
    },


    testing: {
        'frontend-testing': {
            name: 'Frontend Testing Stack',
            packages: [
                'jest',
                '@testing-library/react',
                '@testing-library/jest-dom',
                'cypress',
                'playwright',
                'vitest',
                'storybook',
                '@storybook/react'
            ]
        },
        'backend-testing': {
            name: 'Backend Testing Stack',
            packages: [
                'mocha',
                'chai',
                'sinon',
                'supertest',
                'testcontainers',
                'faker',
                'istanbul'
            ]
        }
    },


    styling: {
        'css-frameworks': {
            name: 'CSS Frameworks and Styling Libraries',
            packages: [
                'tailwindcss',
                'sass',
                'styled-components',
                '@emotion/react',
                '@emotion/styled',
                'postcss',
                'autoprefixer',
                'bootstrap',
                'bulma'
            ]
        },
        'design-system': {
            name: 'Design System and Component Libraries',
            packages: [
                '@chakra-ui/react',
                'antd',
                'material-ui',
                '@headlessui/react',
                'radix-ui',
                'react-bootstrap'
            ]
        }
    },


    state: {
        'react-state': {
            name: 'React State Management',
            packages: [
                'zustand',
                'recoil',
                'jotai',
                'mobx',
                'redux',
                'redux-toolkit',
                'context'
            ]
        },
        'vue-state': {
            name: 'Vue State Management',
            packages: [
                'pinia',
                'vuex',
                'vuex-persist',
                'vue-rx'
            ]
        }
    }
};
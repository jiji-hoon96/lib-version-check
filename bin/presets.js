export const PRESETS = {
    'frontend-react': {
        name: 'React Frontend Stack',
        packages: [
            'react',
            'react-dom',
            'next',
            'tailwindcss',
            'zustand',
            '@tanstack/react-query',
            'axios',
            'framer-motion'
        ]
    },
    'frontend-vue': {
        name: 'Vue Frontend Stack',
        packages: [
            'vue',
            'vue-router',
            'pinia',
            'nuxt',
            'tailwindcss',
            'axios',
            '@vueuse/core'
        ]
    },
    'frontend-testing': {
        name: 'Frontend Testing Stack',
        packages: [
            'jest',
            '@testing-library/react',
            '@testing-library/jest-dom',
            'cypress',
            'playwright',
            'vitest'
        ]
    },
    'styling': {
        name: 'Styling Libraries',
        packages: [
            'tailwindcss',
            'sass',
            'styled-components',
            '@emotion/react',
            '@emotion/styled',
            'postcss',
            'autoprefixer'
        ]
    }
};
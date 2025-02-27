export const frontend = {
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
      'react-router-dom',
    ],
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
      'vuex',
    ],
  },
  'svelte-stack': {
    name: 'Svelte Frontend Stack',
    packages: ['svelte', 'sveltekit', 'svelte-routing', 'tailwindcss', 'axios', 'svelte-store'],
  },
  'angular-stack': {
    name: 'Angular Frontend Stack',
    packages: ['@angular/core', '@angular/router', '@ngrx/store', 'tailwindcss', 'axios', 'rxjs'],
  },
};

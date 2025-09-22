import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 5s linear infinite alternate',
        'gradient-y': 'gradient-y 5s linear infinite alternate',
      },
      backgroundSize: {
        '500%': '500% 100%',
      }
    },
  },
  plugins: [],
};

export default config;
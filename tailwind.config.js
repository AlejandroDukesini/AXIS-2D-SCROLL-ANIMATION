/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta premium
        obsidian: '#0B0C10', // negro obsidiana (fondo principal)
        panel: '#101218',
        panel2: '#15171F',
        chrome: '#C9CED6', // plata cromada
        chromeDim: '#8A9098',
        champagne: '#E7C98A', // dorado champán (alta gama)
        champagneDeep: '#B8912F',
        electric: '#22D3EE', // azul eléctrico cian (tech / interacción)
        electricDeep: '#0891B2',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Oswald', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        mega: '0.12em',
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(34,211,238,0.35), 0 0 25px -2px rgba(34,211,238,0.55)',
        gold: '0 0 0 1px rgba(231,201,138,0.35), 0 0 30px -4px rgba(231,201,138,0.5)',
        card: '0 30px 60px -20px rgba(0,0,0,0.85)',
        floaty: '0 40px 80px -30px rgba(0,0,0,0.9)',
      },
      backgroundImage: {
        'radial-glow':
          'radial-gradient(circle at 50% 40%, rgba(34,211,238,0.20), transparent 60%)',
        'chrome-text':
          'linear-gradient(180deg, #ffffff 0%, #C9CED6 45%, #6b7280 55%, #C9CED6 100%)',
        'gold-text':
          'linear-gradient(180deg, #fff4d6 0%, #E7C98A 45%, #8a6d22 60%, #E7C98A 100%)',
      },
      keyframes: {
        dash: {
          '0%': { backgroundPositionY: '0px' },
          '100%': { backgroundPositionY: '-160px' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%,100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        dash: 'dash 0.6s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      colors: {
        app: {
          text: 'var(--text)',
          'text-heading': 'var(--text-h)',
          surface: 'var(--bg)',
          border: 'var(--border)',
          code: 'var(--code-bg)',
          accent: 'var(--accent)',
          'on-accent': '#ffffff',
          'accent-bg': 'var(--accent-bg)',
          'accent-border': 'var(--accent-border)',
          social: 'var(--social-bg)',
          danger: 'var(--danger)',
        },
      },
    },
  },
}

export default config

// Design tokens exported for JS/TS usage
export const DESIGN_TOKENS = {
  colors: {
    // Primary brand palette
    primaryBlue: '#0366FF',
    brandPurple: '#8B5CF6',
    brandTeal: '#06B6D4',

    // Surface tones
    deepNavy: '#0B1220',
    darkSlate: '#0F1724',
    surfaceSoft: '#0D1117',
    editorSurface: '#0F1724',

    // Accents & semantic
    accentEmerald: '#10B981',
    mutedSlate: '#94A3B8',
    lightText: '#0B2338',
    lightTextMuted: '#334155',
    success: '#10B981',
    error: '#EF4444',
    overlay: 'rgba(2,6,23,0.6)'
  },
  typography: {
    body: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    code: '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
    sizes: {
      h1: '40px',
      h2: '28px',
      h3: '20px',
      body: '16px',
      small: '13px'
    },
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  tokens: {
    '--bg': '#ffffff',
    '--surface': '#f8fafc',
    '--editor-bg': '#0F1724',
    '--accent-1': '#0366FF',
    '--accent-2': '#8B5CF6',
    '--accent-3': '#06B6D4',
    '--muted-text': '#64748b',
    '--text': '#0B2338'
  }
};

export default DESIGN_TOKENS;

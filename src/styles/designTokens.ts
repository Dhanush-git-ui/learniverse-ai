// Design tokens exported for JS/TS usage
export const DESIGN_TOKENS = {
  colors: {
    // Primary brand palette
    primaryBlue: '#2563EB',
    brandRoyal: '#1D4ED8',
    brandSky: '#0EA5E9',
    brandIndigo: '#4F46E5',

    // Surface tones
    surfaceWhite: '#ffffff',
    surfaceSlate: '#f8fafc',
    surfaceSoft: '#f1f5f9',
    editorSurface: '#0F172A',

    // Accents & semantic
    accentEmerald: '#10B981',
    mutedSlate: '#64748b',
    lightText: '#0F172A',
    lightTextMuted: '#475569',
    success: '#10B981',
    error: '#EF4444',
    overlay: 'rgba(15,23,42,0.6)'
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
    '--editor-bg': '#0F172A',
    '--accent-1': '#2563EB',
    '--accent-2': '#1D4ED8',
    '--accent-3': '#0EA5E9',
    '--muted-text': '#64748b',
    '--text': '#0F172A'
  }
};

export default DESIGN_TOKENS;

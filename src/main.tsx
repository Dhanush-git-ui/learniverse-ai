import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Auto-recover from stale chunks after a new deployment
window.addEventListener('vite:preloadError', (event) => {
  console.warn('Deployment update detected (chunk load error). Refreshing application...', event);
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(<App />);

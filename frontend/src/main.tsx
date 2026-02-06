import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/SupabaseAuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Apply theme before React renders (Tailwind uses .dark on html only)
const savedTheme = localStorage.getItem('pothole-app-theme') || 'light';
if (savedTheme === 'dark') document.documentElement.classList.add('dark');
else document.documentElement.classList.remove('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
)

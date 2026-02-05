import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { PredictionsProvider } from './context/PredictionsContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { PredictionPage } from './pages/PredictionPage';
import { ReportPage } from './pages/ReportPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  return (
    <ThemeProvider>
      <PredictionsProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prediction" element={<PredictionPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </PredictionsProvider>
    </ThemeProvider>
  );
}

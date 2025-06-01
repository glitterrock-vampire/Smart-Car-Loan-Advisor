
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import FullRecommendationDetailView from './components/FullRecommendationDetailView';
import { Recommendation } from './types';
import { ThemeProvider, CssBaseline, Typography, Box, Button } from '@mui/material';
import { createAppTheme } from './theme'; // Import shared theme

const DetailPageWrapper: React.FC = () => {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDark ? 'dark' : 'light');

    try {
      const storedData = sessionStorage.getItem('selectedLoanRecommendationDetails');
      if (storedData) {
        const parsedData = JSON.parse(storedData) as Recommendation;
        // Basic validation
        if (parsedData && parsedData.rank && parsedData.bankName && parsedData.loanDetails) {
            setRecommendation(parsedData);
        } else {
            console.error("Parsed data is not a valid Recommendation object:", parsedData);
            setError("Invalid loan recommendation data found.");
        }
      } else {
        setError("No loan recommendation data found to display. Please return to the main app and try again.");
      }
    } catch (e) {
      console.error("Error parsing recommendation from sessionStorage:", e);
      setError("Failed to load loan recommendation details due to a data error.");
    }
  }, []);

  const activeTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  if (error) {
    return (
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
          <Typography variant="h5" color="error.main" gutterBottom>Error Displaying Details</Typography>
          <Typography>{error}</Typography>
          <Button variant="outlined" sx={{mt: 2}} onClick={() => window.close()}>Close Tab</Button>
        </Box>
      </ThemeProvider>
    );
  }
  
  if (!recommendation) {
    return (
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
         <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
          <Typography>Loading recommendation details...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{bgcolor: 'background.default', minHeight: '100vh'}}>
        <FullRecommendationDetailView recommendation={recommendation} />
      </Box>
    </ThemeProvider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element for details page.");
}
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <DetailPageWrapper />
  </React.StrictMode>
);

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Typography, Paper, List, ListItem,ListItemIcon, ListItemText, Grow } from '@mui/material';
// Removed Dialog related imports for yearly breakdown modal
import Header from './components/Header'; // Import Header
import CarLoanForm from './components/CarLoanForm';
import RecommendationsDisplay from './components/RecommendationsDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import HeroSection from './components/HeroSection';
import ThemeToggleButton from './components/ThemeToggleButton';
// YearlyBreakdownChart is no longer imported here for a modal
import { UserInput, GeminiApiResponse } from './types'; // Recommendation type is still needed
import { fetchLoanRecommendations, getApiKeyStatus } from './services/geminiService';
import { APP_TITLE } from './constants';
import { createAppTheme } from './theme'; // Import shared theme creation function
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [apiKeyPresent, setApiKeyPresent] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<GeminiApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Removed state and handlers for YearlyBreakdownModal
  // const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  // const [selectedRecommendationForModal, setSelectedRecommendationForModal] = useState<Recommendation | null>(null);

  useEffect(() => {
    setApiKeyPresent(getApiKeyStatus());
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(prefersDark ? 'dark' : 'light');
  }, []);
  
  const activeTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  }, []);

  const handleFormSubmit = async (data: UserInput) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    console.log("Form Submitted:", data);
    try {
      const result = await fetchLoanRecommendations(data);
      setRecommendations(result);
      if (result.messages && result.messages.length > 0) {
          console.log("AI Messages:", result.messages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Removed handleOpenYearlyBreakdownModal and handleCloseYearlyBreakdownModal

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline enableColorScheme />
      <ThemeToggleButton currentMode={themeMode} toggleTheme={toggleTheme} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header /> {/* Render Header */}
        <HeroSection /> 
        <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 }, flexGrow: 1 }}>
          <CarLoanForm onSubmit={handleFormSubmit} loading={loading} apiKeyPresent={apiKeyPresent} />
          
          {loading && <LoadingSpinner />}
          
          {error && !loading && (
            <Box mt={4}>
              <ErrorDisplay message={error} />
            </Box>
          )}
          
          {!loading && !error && recommendations && recommendations.recommendations && recommendations.recommendations.length > 0 && (
            <Grow in={true} timeout={500}>
              <Box mt={5}>
                <Typography variant="h2" component="h2" align="center" sx={{fontSize: {xs: '1.6rem', sm: '1.8rem', md: '2rem'}, mb:4}}>
                  Your Loan Recommendations
                </Typography>
                <RecommendationsDisplay 
                    recommendations={recommendations.recommendations} 
                    // onOpenYearlyBreakdownModal prop is removed
                />
              </Box>
            </Grow>
          )}

          {!loading && !error && recommendations && recommendations.recommendations && recommendations.recommendations.length === 0 && (
            <Box mt={4} component={Paper} elevation={2} sx={{p:3, textAlign: 'center', borderRadius: 2}}>
              <Typography variant="h6" color="text.secondary">No specific loan recommendations could be generated based on your input.</Typography>
              <Typography variant="body2" color="text.secondary" sx={{mt:1}}>Please try adjusting your criteria or check back later.</Typography>
              {recommendations.messages && recommendations.messages.length > 0 && (
                <List sx={{mt:2, textAlign:'left', maxWidth: 'sm', mx:'auto'}}>
                    {recommendations.messages.map((msg, idx) => (
                        <ListItem key={idx} dense disableGutters>
                            <ListItemIcon sx={{minWidth: '30px'}}><CheckCircleOutlineIcon fontSize="small" color="disabled" /></ListItemIcon>
                            <ListItemText primary={msg} primaryTypographyProps={{variant: 'caption', color: 'text.disabled'}}/>
                        </ListItem>
                    ))}
                </List>
              )}
            </Box>
          )}

        </Container>
        <Box component="footer" sx={{ py: 3, textAlign: 'center', bgcolor: 'background.paper', borderTop: `1px solid ${activeTheme.palette.divider}` }}>
          <Typography variant="caption" color="text.secondary">
            {APP_TITLE} &copy; {new Date().getFullYear()} | Financial advice provided is for illustrative purposes only.
          </Typography>
        </Box>
      </Box>
      {/* Removed YearlyBreakdownChart Dialog */}
    </ThemeProvider>
  );
};

export default App;

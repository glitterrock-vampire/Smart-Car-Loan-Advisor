import React, { useState, useEffect } from 'react';
import { Recommendation } from '../types';
import CompactLoanCard from './CompactLoanCard';
import { Box, Slide, useTheme, Button } from '@mui/material';


interface RecommendationsDisplayProps {
  recommendations: Recommendation[];
}

const RecommendationsDisplay: React.FC<RecommendationsDisplayProps> = ({ recommendations }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('left');
  const [slideIn, setSlideIn] = useState(true);
  const maxSteps = recommendations.length;

  useEffect(() => {
    setActiveStep(0); 
    setSlideIn(true); 
  }, [recommendations]);

  const handleSlideChange = (newStep: number) => {
    if (newStep === activeStep) return;
    
    setSlideDirection(newStep > activeStep ? 'left' : 'right');
    setSlideIn(false);

    setTimeout(() => {
      setActiveStep(newStep);
      setSlideIn(true); 
    }, 250); 
  };
  
  const handleNext = () => {
    handleSlideChange(Math.min(activeStep + 1, maxSteps - 1));
  };

  const handleBack = () => {
    handleSlideChange(Math.max(activeStep - 1, 0));
  };

  const handleDotClick = (step: number) => {
    handleSlideChange(step);
  };

  if (!recommendations || maxSteps === 0) {
    return null;
  }

  if (maxSteps === 1) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        p: {xs: theme.spacing(1), sm: theme.spacing(2)}, 
        mt: theme.spacing(1) 
      }}>
        <Box sx={{ maxWidth: {xs: '100%', sm: '480px', md: '460px'}, width: '100%'}}>
          <CompactLoanCard 
            recommendation={recommendations[0]} 
            showNavigation={false}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: theme.spacing(1), width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        maxWidth: { xs: '100%', sm: '620px', md: '600px' }, 
        position: 'relative',
        minHeight: {xs: '520px', sm: '540px'}, 
        px: { xs: theme.spacing(2), sm: theme.spacing(3) } 
      }}>
        <Box sx={{ 
            width: '100%', 
            maxWidth: { xs: '100%', sm: '480px', md: '460px' }, 
            mx: 'auto', 
            overflow: 'hidden', 
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center'
        }}>
          {recommendations[activeStep] && (
            <Slide
              direction={slideDirection}
              in={slideIn}
              mountOnEnter
              unmountOnExit
              timeout={{ enter: 300, exit: 250 }}
            >
              <Box sx={{width: '100%'}}>
                <CompactLoanCard 
                  recommendation={recommendations[activeStep]} 
                  onPrev={activeStep > 0 ? handleBack : undefined}
                  onNext={activeStep < maxSteps - 1 ? handleNext : undefined}
                  showNavigation={true}
                />
              </Box>
            </Slide>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: `-${theme.spacing(4)}`, mb: theme.spacing(0.5), height: theme.spacing(3), zIndex: 2, position:'relative' }}>
        {Array.from({ length: maxSteps }).map((_, index) => (
          <Button
            key={`dot-click-${index}`}
            onClick={() => handleDotClick(index)}
            sx={{ minWidth: theme.spacing(3), width: theme.spacing(3), height: theme.spacing(3), borderRadius: '50%', padding: 0, margin: theme.spacing(0, 0.375), opacity: 0 }}
            aria-label={`go to recommendation ${index + 1}`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RecommendationsDisplay;

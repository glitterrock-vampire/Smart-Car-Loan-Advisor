
import React, { useState, useEffect } from 'react';
import { Recommendation } from '../types';
import CompactLoanCard from './CompactLoanCard';
import { Box, IconButton, Slide, Typography, MobileStepper, Button, useTheme } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface RecommendationsDisplayProps {
  recommendations: Recommendation[];
  // onOpenYearlyBreakdownModal prop removed
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
            // onOpenYearlyBreakdownModal prop removed
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
        minHeight: {xs: '560px', sm: '580px'}, 
        px: { xs: theme.spacing(4), sm: theme.spacing(5) } 
      }}>
        <IconButton
          onClick={handleBack}
          disabled={activeStep === 0}
          aria-label="previous recommendation"
          sx={{ 
            position: 'absolute', 
            left: { xs: theme.spacing(0.5), sm: theme.spacing(1) }, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
            '&:disabled': { color: theme.palette.action.disabled }
          }}
        >
          <ArrowBackIosNewIcon fontSize="medium" />
        </IconButton>

        <Box sx={{ 
            width: '100%', 
            maxWidth: { xs: '100%', sm: '480px', md: '460px' }, 
            mx: 'auto', 
            overflow: 'hidden', 
            position: 'relative', 
            // minHeight removed to allow card to grow
            display: 'flex', // Added for centering card if it's smaller than container
            alignItems: 'flex-start', // Align card to top
            justifyContent: 'center' // Center card horizontally
        }}>
           {/* Render only the active card */}
          {recommendations[activeStep] && (
            <Slide
              direction={slideDirection}
              in={slideIn}
              mountOnEnter
              unmountOnExit
              timeout={{ enter: 300, exit: 250 }}
            >
              <Box sx={{width: '100%'}}> {/* Ensure card takes full width of its designated area */}
                <CompactLoanCard
                  recommendation={recommendations[activeStep]}
                  // onOpenYearlyBreakdownModal prop removed
                />
              </Box>
            </Slide>
          )}
        </Box>

        <IconButton
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
          aria-label="next recommendation"
          sx={{ 
            position: 'absolute', 
            right: { xs: theme.spacing(0.5), sm: theme.spacing(1) }, 
            top: '50%', 
            transform: 'translateY(-50%)',
            zIndex: 1,
            color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
            '&:disabled': { color: theme.palette.action.disabled }
          }}
        >
          <ArrowForwardIosIcon fontSize="medium" />
        </IconButton>
      </Box>

      <MobileStepper
        steps={maxSteps}
        position="static" 
        activeStep={activeStep}
        variant="dots"
        backButton={<Box sx={{ width: theme.spacing(5) }} />} 
        nextButton={<Box sx={{ width: theme.spacing(5) }} />} 
        sx={{ mt: theme.spacing(1), width: 'auto' }}
      />
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

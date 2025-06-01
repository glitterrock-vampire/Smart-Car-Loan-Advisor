
import React from 'react';
import { Box, Typography, Container, useTheme } from '@mui/material';
import CarCityscapeIllustration from './CarCityscapeIllustration';
import CarIcon from './CarIcon'; // For the app icon
import { APP_TITLE } from '../constants';

const HeroSection: React.FC = () => {
  const theme = useTheme();
  return (
    <Box 
      sx={{ 
        backgroundColor: 'background.default', 
        color: 'text.primary', 
        pt: { xs: 3, sm: 4, md: 5 }, 
        pb: { xs: 4, sm: 5, md: 6 },
        textAlign: 'center',
        overflow: 'hidden', 
        position: 'relative',
        borderBottom: `1px solid ${theme.palette.divider}`, 
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: {xs: 3, sm: 4} }}>
          <CarIcon sx={{ fontSize: {xs: '2.8rem', sm: '3.5rem'}, mr: 1.5, color: 'primary.main', animation: 'driveIn 0.8s ease-out forwards' }} />
          <Box textAlign="left"> {/* Ensures text within this box is left-aligned */}
            <Typography variant="h1" component="h1" sx={{ 
              fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, 
              fontWeight: 'bold', 
              color: 'text.primary',
              letterSpacing: '-0.5px'
            }}>
              {APP_TITLE}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: {xs: '0.8rem', sm: '0.9rem'} }}>
              Your smart guide to car financing.
            </Typography>
          </Box>
        </Box>

        <Typography 
          variant="h2" 
          component="p" 
          gutterBottom 
          sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
            fontWeight: 700,
            color: 'text.primary',
            letterSpacing: '-0.5px',
            mb: {xs: 1.5, sm: 2},
          }}
        >
          Drive Your Dream, Wisely.
        </Typography>
        <Typography 
          variant="h5" 
          component="p" 
          sx={{ 
            mb: { xs: 2.5, sm: 3, md: 4 }, 
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem'},
            lineHeight: 1.6,
            maxWidth: '700px',
            mx: 'auto',
          }}
        >
          Unlock the best car loan options tailored to your needs. Our smart advisor simplifies your journey to owning your perfect vehicle.
        </Typography>
        <Box sx={{ maxWidth: {xs: '90%', sm: '550px', md: '600px'}, mx: 'auto', mt: {xs: 2, sm: 3} }}>
          <CarCityscapeIllustration />
        </Box>
      </Container>
      <style>
        {`
          @keyframes driveIn {
            0% {
              transform: translateX(-50px) scale(0.8);
              opacity: 0;
            }
            100% {
              transform: translateX(0) scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default HeroSection;

import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const LoadingSpinner: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        py: 5, 
        my: 3,
        textAlign: 'center' 
      }}
    >
      <CircularProgress color="primary" size={50} sx={{ mb: 2 }} />
      <Typography variant="subtitle1" color="primary.light" fontWeight="medium">
        Finding the best loans for you...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait a moment.
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;

import React from 'react';
import { AppBar, Toolbar, Typography, Box, useTheme } from '@mui/material';
import CarIcon from './CarIcon'; // Assuming CarIcon is appropriate for the header
import { APP_TITLE } from '../constants';

const Header: React.FC = () => {
  const theme = useTheme();
  return (
    <AppBar 
        position="static" 
        elevation={1} 
        sx={{ 
            backgroundColor: theme.palette.background.paper, // Or 'primary.main' if you prefer colored header
            color: theme.palette.text.primary, // Ensures text is readable on paper bg
            borderBottom: `1px solid ${theme.palette.divider}`
        }}
    >
      <Toolbar sx={{ minHeight: {xs: 56, sm: 64} }}>
        <CarIcon sx={{ mr: 1.5, fontSize: {xs: '1.8rem', sm: '2rem'}, color: 'primary.main' }} />
        <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                fontSize: {xs: '1.1rem', sm: '1.25rem'}
            }}
        >
          {APP_TITLE}
        </Typography>
        {/* Add any other header elements like navigation or action buttons here */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;


import React from 'react';
import { Fab, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon for dark mode
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun for light mode

interface ThemeToggleButtonProps {
  currentMode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ currentMode, toggleTheme }) => {
  const theme = useTheme();
  return (
    <Fab
      color="secondary" 
      aria-label="toggle theme"
      onClick={toggleTheme}
      size="medium"
      sx={{
        position: 'fixed',
        bottom: theme.spacing(3),
        left: theme.spacing(3),
        zIndex: theme.zIndex.modal + 1, // Ensure it's above modals
        boxShadow: theme.shadows[6],
      }}
    >
      {currentMode === 'dark' ? <Brightness7Icon sx={{ color: theme.palette.mode === 'dark' ? theme.palette.getContrastText(theme.palette.secondary.main) : undefined }} /> : <Brightness4Icon sx={{ color: theme.palette.mode === 'light' ? theme.palette.getContrastText(theme.palette.secondary.main) : undefined }} />}
    </Fab>
  );
};

export default ThemeToggleButton;

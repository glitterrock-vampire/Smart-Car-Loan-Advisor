import React from 'react';
import { Alert, AlertTitle, AlertProps } from '@mui/material';

interface ErrorDisplayProps {
  message: string;
  title?: string;
  severity?: AlertProps['severity'];
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  message, 
  title = "Oops! Something went wrong.", 
  severity = "error" 
}) => {
  if (!message) return null;

  return (
    <Alert severity={severity} sx={{ my: 2, '& .MuiAlert-message': {width: '100%'} }}>
      <AlertTitle sx={{fontWeight: '600'}}>{title}</AlertTitle> {/* Increased font weight for dark theme */}
      {message}
    </Alert>
  );
};

export default ErrorDisplay;
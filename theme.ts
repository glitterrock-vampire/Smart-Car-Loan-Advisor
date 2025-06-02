
// Module augmentation for custom theme properties
// These MUST be at the top of the file, before any imports, to ensure they are correctly processed.
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
    lighterAlpha?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    lighterAlpha?: string;
  }
  // interface TypographyVariants { // Removed for h3 as it's a standard variant
  //   h3: React.CSSProperties;
  // }
  // interface TypographyVariantsOptions { // Removed for h3
  //   h3?: React.CSSProperties;
  // }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h3: true; // Kept: Allows 'variant="h3"'
  }
}

import { createTheme, PaletteOptions, alpha } from '@mui/material/styles';


export const commonTypography = {
  fontFamily: 'Roboto, Arial, sans-serif',
  h1: { fontSize: '2.2rem', fontWeight: 700 },
  h2: { fontSize: '1.8rem', fontWeight: 600, marginBottom: '1rem' },
  h3: { fontSize: '1.5rem', fontWeight: 600 }, // Used for card titles / section headers
  h4: { fontSize: '1.25rem', fontWeight: 600 },
  h5: { fontSize: '1.1rem', fontWeight: 500 }, // Used for recommendation card bank name
  h6: { // For form section titles and detail page section titles
    fontSize: '1.2rem',
    fontWeight: 600,
    paddingBottom: '0.5rem',
    borderBottom: '1px solid', // Will be theme specific via borderColor
    marginTop: '2rem', 
    marginBottom: '1.25rem',
  },
  subtitle1: { fontSize: '1rem' }, // Used for recommendation card product name
  body1: { fontSize: '1rem' },
  body2: { fontSize: '0.875rem' }, // Good for secondary text
  caption: { fontSize: '0.75rem' },
  button: { textTransform: 'none' as 'none', fontWeight: 500 }
};

export const lightThemeOptions: PaletteOptions = {
  mode: 'light',
  primary: { main: '#007BFF', light: '#409CFF', dark: '#0056B3', contrastText: '#FFFFFF', lighter: '#E6F2FF', lighterAlpha: alpha('#007BFF', 0.08) },
  secondary: { main: '#6F42C1', light: '#8A5FD6', dark: '#5A359E', contrastText: '#FFFFFF', lighter: alpha('#6F42C1', 0.08), lighterAlpha: alpha('#6F42C1', 0.08) },
  background: { default: '#F4F6F8', paper: '#FFFFFF' },
  text: { primary: '#212529', secondary: '#6C757D', disabled: '#ADB5BD' },
};

export const darkThemeOptions: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#00D1FF', light: '#66E3FF', dark: '#00A3CC', contrastText: '#081425', lighter: 'rgba(0, 209, 255, 0.1)', lighterAlpha: 'rgba(0, 209, 255, 0.1)' },
  secondary: { main: '#C300FF', light: '#D866FF', dark: '#A100CC', contrastText: '#FFFFFF', lighter: alpha('#C300FF', 0.1), lighterAlpha: alpha('#C300FF', 0.1) },
  background: { default: '#101024', paper: '#1C1D3A' },
  text: { primary: '#E0E0E0', secondary: '#A0A0B8', disabled: '#606078' },
};

export const createAppTheme = (mode: 'light' | 'dark') => {
  const baseOptions = mode === 'dark' ? darkThemeOptions : lightThemeOptions;
  return createTheme({
    palette: baseOptions,
    typography: {
      ...commonTypography,
      h6: {
        ...commonTypography.h6,
        borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: { styleOverrides: { root: ({ theme }) => ({ borderRadius: theme.shape.borderRadius, padding: theme.spacing(1, 2.5) }) } },
      MuiPaper: { defaultProps: { elevation: mode === 'dark' ? 3 : 2 }, styleOverrides: { root: { transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out' } } },
      MuiCard: { styleOverrides: { root: ({ theme }) => ({ transition: 'background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out', backgroundColor: theme.palette.background.paper, border: `1px solid ${theme.palette.divider}`, borderRadius: theme.shape.borderRadius * 1.5 }) } },
      MuiFormControl: { defaultProps: { margin: 'normal' } },
      MuiTextField: { defaultProps: { variant: 'outlined', InputLabelProps: { shrink: true } }, styleOverrides: { root: ({ theme }) => ({ '& .MuiOutlinedInput-root': { borderRadius: theme.shape.borderRadius } }) } },
      MuiSelect: { defaultProps: { variant: 'outlined' }, styleOverrides: { root: ({ theme }) => ({ borderRadius: theme.shape.borderRadius, '& .MuiSelect-select': { paddingTop: theme.spacing(1.75), paddingBottom: theme.spacing(1.75) }, '& .MuiOutlinedInput-notchedOutline': { borderRadius: theme.shape.borderRadius } }) } },
      MuiAccordion: { styleOverrides: { root: ({ theme }) => ({ '&:before': { display: 'none' }, border: `1px solid ${theme.palette.divider}`, borderRadius: `${theme.shape.borderRadius}px`, boxShadow: 'none', '&.Mui-expanded': { margin: 0 } }) } },
      MuiAccordionSummary: { styleOverrides: { root: ({ theme }) => ({ minHeight: '48px', padding: theme.spacing(0, 2), '&.Mui-expanded': { minHeight: '48px' } }), content: ({ theme }) => ({ margin: theme.spacing(1.5, 0), '&.Mui-expanded': { margin: theme.spacing(1.5, 0) } }) } },
      MuiAccordionDetails: { styleOverrides: { root: ({ theme }) => ({ padding: theme.spacing(2, 2.5, 2.5) }) } },
      MuiDialog: { styleOverrides: { paper: ({ theme }) => ({ backgroundImage: 'none', borderRadius: theme.shape.borderRadius * 1.5 }) } },
      MuiAlert: {
        styleOverrides: {
          root: ({ theme }) => ({ borderRadius: theme.shape.borderRadius, padding: theme.spacing(1.5, 2) }),
          standardError: ({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 100, 100, 0.2)' : 'rgba(211, 47, 47, 0.08)', color: theme.palette.mode === 'dark' ? '#ffcdd2' : theme.palette.error.dark, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 100, 100, 0.4)' : 'rgba(211, 47, 47, 0.4)'}` }),
          standardWarning: ({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 167, 38, 0.08)', color: theme.palette.mode === 'dark' ? '#ffe082' : theme.palette.warning.dark, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 193, 7, 0.4)' : 'rgba(255, 167, 38, 0.4)'}` }),
          standardInfo: ({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 209, 255, 0.15)' : 'rgba(2, 136, 209, 0.08)', color: theme.palette.mode === 'dark' ? '#81d4fa' : theme.palette.info.dark, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 209, 255, 0.3)' : 'rgba(2, 136, 209, 0.3)'}` }),
          standardSuccess: ({ theme }) => ({ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(102, 187, 106, 0.2)' : 'rgba(46, 125, 50, 0.08)', color: theme.palette.mode === 'dark' ? '#c8e6c9' : theme.palette.success.dark, border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(102, 187, 106, 0.4)' : 'rgba(46, 125, 50, 0.4)'}` })
        }
      },
      MuiMobileStepper: { styleOverrides: { root: ({ theme }) => ({ backgroundColor: 'transparent', justifyContent: 'center', padding: theme.spacing(1, 0) }), dot: ({ theme }) => ({ backgroundColor: theme.palette.action.disabledBackground, width: theme.spacing(1.25), height: theme.spacing(1.25), margin: theme.spacing(0, 1) }), dotActive: ({ theme }) => ({ backgroundColor: theme.palette.primary.main }) } },
      MuiLink: { defaultProps: { target: '_blank', rel: 'noopener noreferrer', underline: 'hover' } }
    }
  });
};



import React, { useState, useCallback, useEffect } from 'react';
import {
  UserInput, Vehicle, UserLocation, UserProfile, UserPreferences,
  SupportedCarType, CreditScoreTier, IncomeRange, LoanPrioritization, CarLoanFormProps
} from '../types';
import {
  SUPPORTED_CAR_TYPES_OPTIONS, CREDIT_SCORE_TIER_OPTIONS,
  INCOME_TIER_CURRENCY_EXAMPLES, LOAN_PRIORITIZATION_OPTIONS, LOAN_TERM_OPTIONS,
  YEAR_OPTIONS, DEFAULT_COUNTRY_CODE, SUPPORTED_COUNTRIES_OPTIONS,
  COUNTRY_CURRENCY_MAP, COUNTRY_CITY_MAP
} from '../constants';
import { getCurrentLocation, Coordinates } from '../services/locationService';
import ErrorDisplay from './ErrorDisplay';

import {
  Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid,
  Paper, Typography, Slider, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Autocomplete, Alert, useTheme, FormHelperText, CircularProgress, InputAdornment
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TuneIcon from '@mui/icons-material/Tune';

const CarLoanForm: React.FC<CarLoanFormProps> = ({ onSubmit, loading, apiKeyPresent }) => {
  const theme = useTheme();
  // const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Unused

  const [vehicle, setVehicle] = useState<Partial<Vehicle>>({ year: YEAR_OPTIONS[0], type: SupportedCarType.SEDAN, cost: undefined, model: '' });
  const [userLocation, setUserLocation] = useState<Partial<UserLocation>>({ city_region: '' });
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>({
    desiredDownPaymentPercent: 10,
    creditScoreTier: CreditScoreTier.UNKNOWN,
    annualIncome: undefined,
    annualIncomeRange: IncomeRange.UNSPECIFIED,
    driversLicenseAgeYears: undefined,
    desiredLoanTermYears: 5,
  });
  const [userPreferences, setUserPreferences] = useState<Partial<UserPreferences>>({ prioritize: LoanPrioritization.NONE });
  const [country, setCountry] = useState<string>(DEFAULT_COUNTRY_CODE);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'denied' | 'manual'>('idle');
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [dialogCountry, setDialogCountry] = useState<string>('');
  const [dialogCityInput, setDialogCityInput] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isFetchingGPS, setIsFetchingGPS] = useState(false);


  const openLocationDialog = useCallback(() => {
    setDialogCountry(country || DEFAULT_COUNTRY_CODE);
    const currentCity = userLocation.city_region && !userLocation.city_region.startsWith("GPS:") ? userLocation.city_region : '';
    setDialogCityInput(currentCity || '');
    setIsLocationDialogOpen(true);
  }, [country, userLocation.city_region]);

  const attemptAutoGPS = useCallback(async (currentCountryForDialog: string) => {
    setLocationStatus('loading');
    setLocationError(null);
    setIsFetchingGPS(true);
    try {
      const coords: Coordinates = await getCurrentLocation();
      if (currentCountryForDialog) setCountry(currentCountryForDialog);
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        city_region: `GPS: ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`
      });
      setLocationStatus('success');
      setIsLocationDialogOpen(false);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "An unknown error occurred trying to get GPS.";
      setLocationError(errMsg);
      setUserLocation(prev => ({ ...prev, latitude: undefined, longitude: undefined }));
      if (errMsg.includes("denied") || errMsg.includes("PERMISSION_DENIED")) {
        setLocationStatus('denied');
      } else {
        setLocationStatus('error');
      }
      setDialogCountry(currentCountryForDialog || country || DEFAULT_COUNTRY_CODE);
    } finally {
      setIsFetchingGPS(false);
    }
  }, [country]);

   useEffect(() => {
    if (!apiKeyPresent || isLocationDialogOpen) return;

    const hasGPS = userLocation.latitude && userLocation.longitude;
    const hasValidManualCity = userLocation.city_region && userLocation.city_region.trim() !== '' && !userLocation.city_region.startsWith("GPS:");
    
    if (!country && apiKeyPresent) {
        openLocationDialog();
    } else if (country && !hasGPS && !hasValidManualCity && locationStatus !== 'loading' && locationStatus !== 'denied' && locationStatus !== 'error' && locationStatus !== 'manual') {
      // User can explicitly click "Use My GPS" in dialog.
    }
  }, [country, userLocation.latitude, userLocation.longitude, userLocation.city_region, locationStatus, apiKeyPresent, isLocationDialogOpen, openLocationDialog]);


  const handleDialogCityChange = (_event: React.SyntheticEvent, newValue: { value: string; label: string } | string | null) => {
    if (newValue && dialogCountry) {
      let cityToSet = '';
      if (typeof newValue === 'string') {
        cityToSet = newValue;
      } else if (typeof newValue === 'object' && newValue !== null) {
        cityToSet = newValue.value;
      }

      if (cityToSet) {
        setCountry(dialogCountry); // Ensure country is set from dialog
        setUserLocation({
          city_region: cityToSet,
          latitude: undefined,
          longitude: undefined,
        });
        setLocationStatus('manual');
        setLocationError(null);
        setIsLocationDialogOpen(false);
      }
    } else if (!newValue) { // User cleared the selection or newValue is null
       setUserLocation(prev => ({ ...prev, city_region: ''}));
    }
  };

  const parseRangeString = (rangeStr: string | undefined): { min: number; max: number } | null => {
    if (!rangeStr) return null;
    const cleanedStr = rangeStr.replace(/e\.g\.,?\s*/i, '').replace(/[A-Z]{3}$/i, '').trim();
    
    const plusMatch = cleanedStr.match(/^([\d,]+)\+$/);
    if (plusMatch) {
      return { min: parseFloat(plusMatch[1].replace(/,/g, '')), max: Infinity };
    }
    
    const rangeMatch = cleanedStr.match(/^([\d,]+)\s*-\s*([\d,]+)$/);
    if (rangeMatch) {
      return {
        min: parseFloat(rangeMatch[1].replace(/,/g, '')),
        max: parseFloat(rangeMatch[2].replace(/,/g, ''))
      };
    }
    return null;
  };

  const deriveIncomeTier = useCallback((income: number | undefined, countryCode: string): IncomeRange => {
    if (income === undefined || income <= 0) return IncomeRange.UNSPECIFIED;
    const currency = COUNTRY_CURRENCY_MAP[countryCode];
    if (!currency) return IncomeRange.UNSPECIFIED;

    const lowRange = parseRangeString(INCOME_TIER_CURRENCY_EXAMPLES[IncomeRange.LOW]?.[currency]);
    if (lowRange && income >= lowRange.min && income <= lowRange.max) return IncomeRange.LOW;

    const mediumRange = parseRangeString(INCOME_TIER_CURRENCY_EXAMPLES[IncomeRange.MEDIUM]?.[currency]);
    if (mediumRange && income >= mediumRange.min && income <= mediumRange.max) return IncomeRange.MEDIUM;
    
    const highRange = parseRangeString(INCOME_TIER_CURRENCY_EXAMPLES[IncomeRange.HIGH]?.[currency]);
    if (highRange && income >= highRange.min && income <= highRange.max) return IncomeRange.HIGH;
    
    return IncomeRange.UNSPECIFIED; // Default if no range matches, or if income is very high
  }, []);

  useEffect(() => {
    if (country && userProfile.annualIncome !== undefined) {
      setUserProfile(prev => ({
        ...prev,
        annualIncomeRange: deriveIncomeTier(prev.annualIncome, country)
      }));
    } else if (userProfile.annualIncome === undefined) { // If income cleared
       setUserProfile(prev => ({ ...prev, annualIncomeRange: IncomeRange.UNSPECIFIED}));
    }
  }, [userProfile.annualIncome, country, deriveIncomeTier]);


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!country) {
      setFormError("Please select your country and set your location details.");
      openLocationDialog();
      return;
    }

    const hasGPS = userLocation.latitude && userLocation.longitude;
    const hasValidManualCity = userLocation.city_region && userLocation.city_region.trim() !== '' && !userLocation.city_region.startsWith("GPS:");

    if (!hasGPS && !hasValidManualCity) {
      setLocationError("Location is required. Please use GPS or select your country/city.");
      setFormError("Location is required. Please complete location setup via the 'Set/Update Location' button.");
      openLocationDialog();
      return;
    }
    
    if (!vehicle.type || !vehicle.year || vehicle.cost === undefined || vehicle.cost <= 0 || !vehicle.model || !vehicle.model.trim()) {
      setFormError("Please fill in all required vehicle details, including a valid cost (greater than 0) and model name.");
      return;
    }
        
    const finalLocation: UserLocation = {
      city_region: userLocation.city_region!,
      ...(hasGPS && { latitude: userLocation.latitude, longitude: userLocation.longitude }),
    };
    
    const profileToSend: UserProfile = { ...userProfile };
    if (userProfile.annualIncome === undefined || userProfile.annualIncome <= 0) {
        profileToSend.annualIncomeRange = IncomeRange.UNSPECIFIED; // Ensure this is set if income is not provided
        delete profileToSend.annualIncome; // Remove if 0 or undefined
    }

    if (userProfile.driversLicenseAgeYears === undefined || isNaN(userProfile.driversLicenseAgeYears) || userProfile.driversLicenseAgeYears < 0) {
        delete profileToSend.driversLicenseAgeYears; // Remove if invalid or not set
    }
    if (profileToSend.desiredLoanTermYears !== undefined) profileToSend.desiredLoanTermYears = Number(profileToSend.desiredLoanTermYears);

    const fullUserInput: UserInput = {
      vehicle: vehicle as Vehicle,
      userContext: { country, location: finalLocation, profile: profileToSend },
      preferences: userPreferences as UserPreferences,
    };
    onSubmit(fullUserInput);
  };
  
  const selectedCurrency = country ? (COUNTRY_CURRENCY_MAP[country] || "CUR") : "CUR";
  const cityOptionsForDialog = dialogCountry ? (COUNTRY_CITY_MAP[dialogCountry] || []) : [];

  let locationDisplay = { text: 'Click to set location', color: theme.palette.warning.main, icon: <EditLocationIcon sx={{fontSize: '1.2rem'}} /> };
  if (userLocation.latitude && userLocation.longitude && userLocation.city_region?.startsWith("GPS:")) {
    locationDisplay = { text: `GPS: ${userLocation.latitude.toFixed(2)}, ${userLocation.longitude.toFixed(2)}`, color: theme.palette.primary.main, icon: <GpsFixedIcon sx={{fontSize: '1.2rem'}} /> };
  } else if (userLocation.city_region && !userLocation.city_region.startsWith("GPS:") && userLocation.city_region.trim() !== '') {
    const countryName = SUPPORTED_COUNTRIES_OPTIONS.find(c => c.value === country)?.label || country;
    locationDisplay = { text: `${userLocation.city_region}, ${countryName}`, color: theme.palette.text.primary, icon: <LocationOnIcon sx={{fontSize: '1.2rem'}} /> };
  } else if (country) { // Country selected, but no city/GPS
     locationDisplay = { text: `Set city for ${SUPPORTED_COUNTRIES_OPTIONS.find(c => c.value === country)?.label || country}`, color: theme.palette.text.secondary, icon: <EditLocationIcon sx={{fontSize: '1.2rem'}} />};
  }


  if (!apiKeyPresent) {
    return (
      <Box sx={{ maxWidth: 'md', mx: 'auto', p: {xs: 2, sm: 3} }}>
         <ErrorDisplay message="API Key for the recommendation service is not configured. Please set the API_KEY environment variable. The application cannot function without it." title="Configuration Error" />
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={theme.shape.borderRadius > 0 ? 2 : 0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: theme.shape.borderRadius * 1.5 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: { xs: 2, sm: 3 },           // Less margin on mobile
              p: { xs: 1, sm: 1.5 },          // Less padding on mobile
              minHeight: { xs: 36, sm: 48 },  // Smaller height on mobile
              borderRadius: 1.5,
              cursor: 'pointer',
              backgroundColor: theme.palette.background.paper,
              boxShadow: 1,
              transition: 'box-shadow 0.2s',
              '&:hover': { boxShadow: 3 },
              maxWidth: { xs: 320, sm: 420 }, // <--- Limit width on mobile and desktop
              mx: 'auto',                     // <--- Center horizontally
              width: '100%',
            }}
            onClick={openLocationDialog}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {React.cloneElement(locationDisplay.icon, {
                sx: { mr: { xs: 1, sm: 1.5 }, color: locationDisplay.color, fontSize: { xs: '1.1rem', sm: '1.4rem' } },
               })}
            <Typography
              variant="subtitle1"
              sx={{
                color: locationDisplay.color,
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.25rem' }, // Smaller text on mobile
              }}
            >
              {locationDisplay.text}
            </Typography>
            </Box>
          </Box>
          {locationError && !isLocationDialogOpen && <Alert severity="warning" sx={{mb:2}}>{locationError}</Alert>}


          <Typography variant="h6" component="h2" sx={{display: 'flex', alignItems: 'center', mt: 3, mb: 1.5, borderBottom: 'none', pb: 0}}>
            <DriveEtaIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Vehicle Information
          </Typography>
          <Grid container spacing={{xs: 1.5, sm: 2}}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="vehicle-type-label">Vehicle Type*</InputLabel>
                <Select
                  labelId="vehicle-type-label"
                  id="vehicle-type"
                  label="Vehicle Type*"
                  value={vehicle.type || ''}
                  onChange={e => setVehicle(v => ({ ...v, type: e.target.value as SupportedCarType }))}
                  required
                >
                  {SUPPORTED_CAR_TYPES_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="vehicle-year-label">Year of Manufacture*</InputLabel>
                <Select
                  labelId="vehicle-year-label"
                  id="vehicle-year"
                  label="Year of Manufacture*"
                  value={vehicle.year || ''}
                  onChange={e => setVehicle(v => ({ ...v, year: Number(e.target.value) }))}
                  required
                >
                  {YEAR_OPTIONS.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="vehicle-model"
                label="Vehicle Model*"
                value={vehicle.model || ''}
                onChange={e => setVehicle(v => ({ ...v, model: e.target.value }))}
                required
                helperText="E.g., Honda Civic, Toyota RAV4"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="vehicle-cost"
                label="Estimated Vehicle Cost*"
                type="number"
                value={vehicle.cost === undefined ? '' : vehicle.cost}
                onChange={e => setVehicle(v => ({ ...v, cost: e.target.value === '' ? undefined : parseFloat(e.target.value) }))}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">{selectedCurrency}</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                helperText="Total price of the vehicle"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" component="h2" sx={{display: 'flex', alignItems: 'center', mt: 3, mb: 1.5, borderBottom: 'none', pb: 0}}>
            <AccountCircleIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Your Financial Profile
          </Typography>
          <Grid container spacing={{xs: 1.5, sm: 2}}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="credit-score-label">Credit Score Tier</InputLabel>
                <Select
                  labelId="credit-score-label"
                  id="credit-score"
                  label="Credit Score Tier"
                  value={userProfile.creditScoreTier || CreditScoreTier.UNKNOWN}
                  onChange={e => setUserProfile(p => ({ ...p, creditScoreTier: e.target.value as CreditScoreTier }))}
                >
                  {CREDIT_SCORE_TIER_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="annual-income"
                label="Annual Income (Gross)"
                type="number"
                value={userProfile.annualIncome === undefined ? '' : userProfile.annualIncome}
                onChange={e => setUserProfile(p => ({ ...p, annualIncome: e.target.value === '' ? undefined : parseFloat(e.target.value) }))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{selectedCurrency}</InputAdornment>,
                  inputProps: { min: 0 }
                }}
                helperText={country && userProfile.annualIncomeRange && userProfile.annualIncomeRange !== IncomeRange.UNSPECIFIED ? `Tier: ${userProfile.annualIncomeRange}` : `Enter your pre-tax annual income`}
              />
            </Grid>
            <Grid item xs={12}>
                <Typography gutterBottom id="down-payment-slider-label">
                    Desired Down Payment ({userProfile.desiredDownPaymentPercent || 0}%)
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8} sm={9}>
                        <Slider
                            value={userProfile.desiredDownPaymentPercent || 0}
                            onChange={(_e, newValue) => setUserProfile(p => ({ ...p, desiredDownPaymentPercent: newValue as number }))}
                            aria-labelledby="down-payment-slider-label"
                            valueLabelDisplay="auto"
                            min={0}
                            max={50} // Max 50% down payment via slider
                            step={1}
                        />
                    </Grid>
                    <Grid item xs={4} sm={3}>
                        <TextField
                            value={userProfile.desiredDownPaymentPercent || 0}
                            onChange={e => setUserProfile(p => ({ ...p, desiredDownPaymentPercent: Number(e.target.value) > 100 ? 100 : Number(e.target.value) < 0 ? 0 : Number(e.target.value) }))}
                            type="number"
                            size="small"
                            InputProps={{ inputProps: { min: 0, max: 100 }, endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                        />
                    </Grid>
                </Grid>
                {vehicle.cost && userProfile.desiredDownPaymentPercent !== undefined && (
                    <FormHelperText sx={{textAlign: 'right', mt:0.5}}>
                        Est. Amount: {selectedCurrency} {((userProfile.desiredDownPaymentPercent / 100) * vehicle.cost).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                    </FormHelperText>
                )}
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    id="drivers-license-age"
                    label="Driver's License Age (Years)"
                    type="number"
                    value={userProfile.driversLicenseAgeYears === undefined ? '' : userProfile.driversLicenseAgeYears}
                    onChange={e => setUserProfile(p => ({ ...p, driversLicenseAgeYears: e.target.value === '' ? undefined : parseInt(e.target.value, 10) }))}
                    InputProps={{ inputProps: { min: 0, max: 80 } }}
                    helperText="Years since you first got your license"
                />
            </Grid>
             <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel id="desired-loan-term-label">Desired Loan Term</InputLabel>
                    <Select
                        labelId="desired-loan-term-label"
                        id="desired-loan-term"
                        label="Desired Loan Term"
                        value={userProfile.desiredLoanTermYears || ''}
                        onChange={e => setUserProfile(p => ({ ...p, desiredLoanTermYears: Number(e.target.value) }))}
                    >
                        {LOAN_TERM_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                    </Select>
                </FormControl>
            </Grid>
          </Grid>

          <Typography variant="h6" component="h2" sx={{display: 'flex', alignItems: 'center', mt: 3, mb: 1.5, borderBottom: 'none', pb: 0}}>
            <TuneIcon sx={{ mr: 1.5, color: 'primary.main' }} />
            Loan Preferences
          </Typography>
          <Grid container spacing={{xs: 1.5, sm: 2}}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="loan-prioritization-label">Prioritize</InputLabel>
                <Select
                  labelId="loan-prioritization-label"
                  id="loan-prioritization"
                  label="Prioritize"
                  value={userPreferences.prioritize || LoanPrioritization.NONE}
                  onChange={e => setUserPreferences(pref => ({ ...pref, prioritize: e.target.value as LoanPrioritization }))}
                >
                  {LOAN_PRIORITIZATION_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
                </Select>
                <FormHelperText>Tell us what's most important for your loan (optional).</FormHelperText>
              </FormControl>
            </Grid>
          </Grid>

          {formError && (
            <Box mt={3}>
              <ErrorDisplay message={formError} title="Form Error" />
            </Box>
          )}

          {/* <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !country || (!userLocation.latitude && !userLocation.city_region)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{ minWidth: {xs: '100%', sm: '250px'}, py: 1.5, fontSize: '1.1rem' }}
            >
              {loading ? "Analyzing..." : "Get Loan Recommendations"}
            </Button>
          </Box> */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              px: { xs: 2, sm: 0 }, // margin on mobile so it doesn't touch the edge
            }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading || !country || (!userLocation.latitude && !userLocation.city_region)}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                maxWidth: '400px', // Optional: cap max width on desktop for aesthetics
                mx: { xs: 2, sm: 0 }, // margin on mobile so it doesn't touch the edge
                borderRadius: 2, // match your Paper/card for rounded corners
                py: 1.5,
                px: { xs: 0, sm: 4 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                whiteSpace: 'normal',
                textAlign: 'center',
                boxSizing: 'border-box',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                alignSelf: 'center',

              }}
            >
              {loading ? "Analyzing..." : "Get Loan Recommendations"}
            </Button>
          </Box>

        </Box>
      </Paper>

      {/* Location Dialog */}
      <Dialog open={isLocationDialogOpen} onClose={() => { if(!isFetchingGPS) setIsLocationDialogOpen(false); }} aria-labelledby="location-dialog-title" maxWidth="sm" fullWidth>
        <DialogTitle id="location-dialog-title">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} /> Set Your Location
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide your country and city/region to find relevant loan options. You can use your device's GPS or enter manually.
          </DialogContentText>

          <FormControl fullWidth sx={{mb:2}}>
            <InputLabel id="dialog-country-label">Country*</InputLabel>
            <Select
              labelId="dialog-country-label"
              id="dialog-country"
              label="Country*"
              value={dialogCountry}
              onChange={e => {
                setDialogCountry(e.target.value as string);
                setDialogCityInput(''); // Reset city when country changes
              }}
              required
            >
              {SUPPORTED_COUNTRIES_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </Select>
          </FormControl>

          {dialogCountry && (
            <Autocomplete
              id="dialog-city-autocomplete"
              freeSolo
              options={cityOptionsForDialog}
              getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
              value={dialogCityInput ? cityOptionsForDialog.find(opt => opt.value === dialogCityInput) || dialogCityInput : null}
              onInputChange={(_event, newInputValue) => {
                setDialogCityInput(newInputValue);
              }}
              onChange={handleDialogCityChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City/Region*"
                  placeholder="Type or select your city/region"
                  helperText="If your city is not listed, type it and press Enter."
                />
              )}
              sx={{mb:2}}
            />
          )}
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={isFetchingGPS ? <CircularProgress size={20} /> : <MyLocationIcon />}
            onClick={() => attemptAutoGPS(dialogCountry)} 
            disabled={isFetchingGPS || !dialogCountry}
            fullWidth
            sx={{py: 1.25}}
          >
            {isFetchingGPS ? "Fetching GPS..." : "Use My Current GPS Location"}
          </Button>
          {locationError && isLocationDialogOpen && <Alert severity={locationStatus === 'denied' ? "error" : "warning"} sx={{mt:2}}>{locationError}</Alert>}
        </DialogContent>
        <DialogActions sx={{p: {xs:2, sm:3}}}>
          <Button onClick={() => setIsLocationDialogOpen(false)} color="inherit" disabled={isFetchingGPS}>Cancel</Button>
          {/* Save button is implicitly handled by Autocomplete onChange or GPS success */}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CarLoanForm;

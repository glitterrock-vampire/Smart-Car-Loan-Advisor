

import React, { useState } from 'react';
import { Recommendation, CompactLoanCardProps } from '../types';
import FullRecommendationDetailView from './FullRecommendationDetailView'; // To render detailed content
import {
  Card, CardContent, Typography, Button, Box, Grid, Paper, Chip, Link, useTheme, alpha,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import PercentIcon from '@mui/icons-material/Percent';
import EventIcon from '@mui/icons-material/Event';
import CalculateIcon from '@mui/icons-material/Calculate';


const InfoItem: React.FC<{ label: string; value: string | number | React.ReactNode; currency?: string; small?: boolean; noMarginBottom?: boolean; icon?: React.ReactNode; valueColor?: string }> = ({ label, value, currency, small, noMarginBottom, icon, valueColor }) => {
  const theme = useTheme();
  const displayValue = typeof value === 'number' && currency ? new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) : value;
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: small || noMarginBottom ? (noMarginBottom ? theme.spacing(0.5) : theme.spacing(1)) : theme.spacing(1.5) }}>
      {icon && <Box sx={{ mr: 1.5, mt: small ? '2px' : '4px', color: 'primary.main' }}>{icon}</Box>}
      <Box sx={{ minWidth: 0 }}>
        <Typography variant={small ? "caption" : "body2"} color="text.secondary" component="span" sx={{ display: 'block', lineHeight: 1.3, fontWeight: small ? 400 : 500 }}>{label}:</Typography>
        <Typography variant={small ? "body1" : "subtitle1"} component="span" sx={{ fontWeight: small ? 500 : 600, display: 'block', lineHeight: 1.4, color: valueColor || 'text.primary' }}>
          {displayValue}
        </Typography>
      </Box>
    </Box>
  );
};


const CompactLoanCard: React.FC<CompactLoanCardProps> = ({ recommendation }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const {
    rank, bankName, productName, loanDetails, applyLink,
    ownershipBreakdown, insuranceRecommendation 
  } = recommendation;

  const totalEstimatedMonthlyCommitment =
    (loanDetails.estimatedMonthlyPayment || 0) +
    ((insuranceRecommendation?.estimatedAnnualPremium || 0) / 12) +
    ((ownershipBreakdown?.estimatedAnnualRecurringFeesTotal || 0) / 12);


  const formatCurrency = (amount: number | undefined, currencyCode: string | undefined) => {
    if (amount === undefined || !currencyCode) return 'N/A';
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };
  
  const cardKeyColor = theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main;

  return (
    <Card sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        width: '100%', 
        boxShadow: theme.shadows[3],
        border: `1px solid ${theme.palette.divider}`,
        transition: 'box-shadow 0.3s ease-in-out',
        ...(expanded && { boxShadow: theme.shadows[8] })
    }}>
      <CardContent sx={{ flexGrow: 1, p: {xs: theme.spacing(2), sm: theme.spacing(2.5)}, pb: expanded ? theme.spacing(1) : {xs: theme.spacing(2), sm: theme.spacing(2.5)}  }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', color: 'text.primary', flexGrow: 1, pr:1 }}>
            {bankName}
          </Typography>
          <Chip label={`Rank #${rank}`} color="primary" variant="filled" size="small" sx={{ backgroundColor: cardKeyColor, color: theme.palette.getContrastText(cardKeyColor), fontWeight:'bold' }}/>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2.5, fontWeight: 500 }}>
          {productName}
        </Typography>

        <Paper elevation={0} sx={{ p: {xs: 1.5, sm:2}, mb: 2.5, borderRadius: 1.5, backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.15) : theme.palette.primary.lighter }}>
          <InfoItem
            icon={<PaymentsIcon fontSize="small"/>}
            label="Est. Monthly Payment"
            value={formatCurrency(loanDetails.estimatedMonthlyPayment, loanDetails.currency)}
            valueColor={cardKeyColor}
          />
        </Paper>
        
        <Grid container spacing={{xs:1, sm:1.5}} sx={{mb: 1.5}}>
            <Grid item xs={6}>
                 <InfoItem small icon={<PercentIcon fontSize="inherit" />} label="Interest Rate" value={`${loanDetails.interestRate.toFixed(2)}%`} />
            </Grid>
            <Grid item xs={6}>
                 <InfoItem small icon={<EventIcon fontSize="inherit" />} label="Loan Term" value={`${loanDetails.loanTerm} Years`} />
            </Grid>
            <Grid item xs={12}>
                 <InfoItem small icon={<AccountBalanceWalletIcon fontSize="inherit" />} label="Loan Amount" value={formatCurrency(loanDetails.loanAmount, loanDetails.currency)} />
            </Grid>
        </Grid>
        
         {totalEstimatedMonthlyCommitment > loanDetails.estimatedMonthlyPayment && (
          <Paper elevation={0} sx={{ p: {xs: 1.5, sm: 2}, mt: 2, mb: 2.5, borderRadius: 1.5, backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.secondary.main, 0.15) : theme.palette.secondary.lighter }}>
            <InfoItem
              icon={<CalculateIcon fontSize="small" />}
              label="Total Estimated Monthly Commitment"
              value={formatCurrency(totalEstimatedMonthlyCommitment, loanDetails.currency)}
              valueColor={theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.dark}
              small={false}
            />
            <Typography variant="caption" display="block" sx={{ mt: -1, ml:4.5, color: theme.palette.text.secondary }}>
                (Loan + Est. Insurance + Est. Other Recurring Fees)
            </Typography>
          </Paper>
        )}
        
        <Box sx={{mt: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5}}>
            {applyLink && (
              <Button variant="contained" color="primary" fullWidth href={applyLink} target="_blank" rel="noopener noreferrer" sx={{ py: 1.25, fontWeight: 'bold' }}>
                Apply Now
              </Button>
            )}
             <Button 
                variant="outlined" 
                color="inherit" 
                fullWidth 
                onClick={handleAccordionChange} 
                startIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />}
                sx={{ fontWeight: 500 }}
                aria-expanded={expanded}
                aria-controls={`panel${rank}-content`}
                id={`panel${rank}-header`}
            >
                {expanded ? 'Hide Full Details' : 'View Full Details'}
            </Button>
        </Box>
      </CardContent>
      
      <Accordion 
        expanded={expanded} 
        onChange={handleAccordionChange} 
        sx={{ 
            boxShadow: 'none', 
            borderTop: expanded ? `1px solid ${theme.palette.divider}`: 'none',
            '&:before': { display: 'none' }, 
            '&.Mui-expanded': { marginTop: 0, marginBottom: 0},
            borderBottomLeftRadius: theme.shape.borderRadius * 1.5, // Match card border radius
            borderBottomRightRadius: theme.shape.borderRadius * 1.5,
        }}
        id={`panel${rank}-content`}
        aria-labelledby={`panel${rank}-header`}
      >
        <AccordionSummary sx={{display: 'none'}} /> 
        <AccordionDetails sx={{ p: {xs: 0, sm: 0}, pt: {xs:1, sm:1} }}> 
          {/* FullRecommendationDetailView expects a "recommendation" prop.
              It's designed to be self-contained and can be used directly.
              The container/paper within FullRecommendationDetailView might need adjustment
              if we want it to blend seamlessly into the accordion details area.
              For now, let's render it directly. We might need to pass a flag
              to FullRecommendationDetailView to adjust its top-level Paper elevation/padding if needed.
           */}
           <Box sx={{px: {xs: 2, sm: 2.5}, pb: {xs: 2, sm: 2.5} }}>
             <FullRecommendationDetailView recommendation={recommendation} isEmbedded />
           </Box>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};

export default CompactLoanCard;
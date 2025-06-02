

import React from 'react';
import { FullRecommendationDetailViewProps as OriginalFullRecommendationDetailViewProps, RecurringFeeDetail } from '../types';
import OwnershipCostDonutChart from './OwnershipCostDonutChart';
import YearlyBreakdownChart from './YearlyBreakdownChart';
import {
  Container, Paper, Typography, Box, Grid, List, ListItem, ListItemIcon, ListItemText, Divider, Button, Chip, useTheme, Alert, TypographyProps, SvgIconProps, useMediaQuery
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PaymentsIcon from '@mui/icons-material/Payments';
import PercentIcon from '@mui/icons-material/Percent';
import EventIcon from '@mui/icons-material/Event';
import InfoIcon from '@mui/icons-material/Info';
import ShieldIcon from '@mui/icons-material/Shield';
import ArticleIcon from '@mui/icons-material/Article';
// import SpeedIcon from '@mui/icons-material/Speed'; // Not used, can remove
import BusinessIcon from '@mui/icons-material/Business';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
// import CarCrashIcon from '@mui/icons-material/CarCrash'; // Not used for insurance section icon, ShieldIcon is used
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotesIcon from '@mui/icons-material/Notes';

interface FullRecommendationDetailViewProps extends OriginalFullRecommendationDetailViewProps {
  isEmbedded?: boolean;
}

const InfoRow: React.FC<{ label: string; value: string | number | React.ReactNode; icon?: React.ReactNode; currency?: string; typographyVariant?: TypographyProps['variant']; valueColor?: string }> = ({ label, value, icon, currency, typographyVariant = "body1", valueColor }) => {
  // const theme = useTheme(); // Not needed here, theme is used in parent
  const displayValue = typeof value === 'number' && currency ? new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value) : value;
  return (
    <Grid container spacing={1} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
      <Grid item xs={12} sm={4} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
        {icon && <Box sx={{ mr: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>{React.cloneElement(icon as React.ReactElement<SvgIconProps>, { fontSize: "small" })}</Box>}
        <Typography variant="body2" color="text.secondary">{label}:</Typography>
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <Typography variant={typographyVariant} sx={{ fontWeight: 500, color: valueColor || 'text.primary', wordBreak: 'break-word' }}>{displayValue}</Typography>
      </Grid>
    </Grid>
  );
};

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => {
    const theme = useTheme();
    return (
        <Box sx={{ mb: 3 }}>
             <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', color: 'text.primary', mb: 2, mt:0, borderBottom: `1px solid ${theme.palette.divider}`, pb: 1 }}>
                {icon && React.cloneElement(icon as React.ReactElement<SvgIconProps>, { sx: { mr: 1.5, color: 'primary.main' }})}
                {title}
            </Typography>
            {children}
        </Box>
    );
};


const FullRecommendationDetailView: React.FC<FullRecommendationDetailViewProps> = ({ recommendation, isEmbedded }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!recommendation) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Alert severity="warning">No recommendation data to display.</Alert>
      </Container>
    );
  }

  const {
    rank,
    bankName,
    productName,
    loanDetails,
    vehicleInfo,
    requiredDocuments,
    rationale,
    applyLink,
    ownershipBreakdown,
    insuranceRecommendation,
  } = recommendation;

  const content = (
    <>
      {!isEmbedded && (
        <Box sx={{ textAlign: 'center', mb: 3, mt: 2 }}>
            <Chip label={`Rank #${rank}`} color="primary" sx={{ fontSize: '1rem', p: 1.5, fontWeight: 'bold', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }} />
            <Typography variant="h4" component="h1" sx={{ mt: 1, fontWeight: 'bold' }}>{bankName}</Typography>
            <Typography variant="h6" color="text.secondary">{productName}</Typography>
        </Box>
      )}

      <Section title="Loan Details" icon={<AccountBalanceWalletIcon />}>
        <InfoRow label="Loan Amount" value={loanDetails.loanAmount} currency={loanDetails.currency} icon={<PaidIcon />} />
        <InfoRow label="Interest Rate" value={`${loanDetails.interestRate.toFixed(2)}%`} icon={<PercentIcon />} />
        <InfoRow label="Loan Term" value={`${loanDetails.loanTerm} Years`} icon={<EventIcon />} />
        <InfoRow label="Est. Monthly Payment" value={loanDetails.estimatedMonthlyPayment} currency={loanDetails.currency} icon={<PaymentsIcon />} valueColor={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main}/>
        {vehicleInfo?.fuelEfficiency && (
            <InfoRow label="Est. Fuel Efficiency" value={vehicleInfo.fuelEfficiency} icon={<LocalGasStationIcon />} />
        )}
      </Section>

      {ownershipBreakdown && (
        <Section title="Ownership Cost Breakdown" icon={<ShoppingCartIcon />}>
          <Grid container spacing={isSmallScreen ? 2 : 3}>
            <Grid item xs={12} md={5} sx={{ display: 'flex', flexDirection: 'column', justifyContent:'center', alignItems: 'center',  minHeight: {xs: 280, md: 'auto'}, mb: {xs: 2, md:0} }}>
              <OwnershipCostDonutChart breakdown={ownershipBreakdown} />
            </Grid>
            <Grid item xs={12} md={7}>
                <InfoRow label="Vehicle Full Cost" value={ownershipBreakdown.vehicleFullCost} currency={ownershipBreakdown.currency} icon={<PaidIcon />}/>
                <InfoRow label="Est. Down Payment" value={ownershipBreakdown.estimatedDownPaymentAmount} currency={ownershipBreakdown.currency} icon={<PaymentsIcon />} />
                <InfoRow label="Total Loan Principal" value={ownershipBreakdown.totalLoanPrincipal} currency={ownershipBreakdown.currency} icon={<AccountBalanceWalletIcon />} />
                <InfoRow label="Total Est. Interest" value={ownershipBreakdown.totalEstimatedInterestPaid} currency={ownershipBreakdown.currency} icon={<PercentIcon />} />
                <InfoRow label="Total Est. Loan Cost" value={ownershipBreakdown.totalEstimatedLoanCost} currency={ownershipBreakdown.currency} icon={<PaymentsIcon />} valueColor={theme.palette.mode === 'dark' ? theme.palette.secondary.light : theme.palette.secondary.main} />
                <InfoRow label="Total Out-of-Pocket (Vehicle)" value={ownershipBreakdown.totalOutOfPocketForVehicle} currency={ownershipBreakdown.currency} icon={<ShoppingCartIcon />} valueColor={theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main} />
            </Grid>
          </Grid>

          {ownershipBreakdown.yearlyBreakdown && ownershipBreakdown.yearlyBreakdown.length > 0 && (
            <Box sx={{ mt: 3 }}>
                <Divider sx={{mb:2.5}}><Chip label="Yearly Payment Schedule" icon={<QueryStatsIcon/>} /></Divider>
                <YearlyBreakdownChart data={ownershipBreakdown.yearlyBreakdown} currency={ownershipBreakdown.currency} loanTerm={loanDetails.loanTerm} />
            </Box>
          )}

          {ownershipBreakdown.recurringFeeDetails && ownershipBreakdown.recurringFeeDetails.length > 0 && (
            <Box sx={{ mt: 3.5 }}>
              <Divider sx={{mb:2.5}}><Chip label="Estimated Annual Recurring Fees (Excluding Loan & Primary Insurance)" icon={<ReceiptLongIcon/>} /></Divider>
              <List dense disablePadding>
                {ownershipBreakdown.recurringFeeDetails.map((fee: RecurringFeeDetail, index: number) => (
                  <ListItem key={index} disableGutters sx={{flexDirection: 'column', alignItems: 'flex-start', mb: 1, p:1.5, border: `1px dashed ${theme.palette.divider}`, borderRadius:1 }}>
                     <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                        <ListItemText
                            primary={fee.name}
                            secondary={fee.notes}
                            primaryTypographyProps={{ fontWeight: '500' }}
                        />
                        <Typography variant="body1" sx={{ fontWeight: '500' }}>
                            {new Intl.NumberFormat(undefined, { style: 'currency', currency: fee.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(fee.estimatedAnnualAmount)}
                        </Typography>
                    </Box>
                  </ListItem>
                ))}
              </List>
              {ownershipBreakdown.estimatedAnnualRecurringFeesTotal !== undefined && (
                <Typography variant="h6" sx={{ textAlign: 'right', mt: 1, fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Total Est. Annual Recurring Fees: {new Intl.NumberFormat(undefined, { style: 'currency', currency: ownershipBreakdown.currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(ownershipBreakdown.estimatedAnnualRecurringFeesTotal)}
                </Typography>
              )}
            </Box>
          )}
        </Section>
      )}

      {insuranceRecommendation && (
        <Section title="Insurance Suggestion" icon={<ShieldIcon />}>
            <InfoRow label="Provider" value={insuranceRecommendation.providerName} icon={<BusinessIcon />} />
            <InfoRow label="Policy Type" value={insuranceRecommendation.policyType} icon={<ArticleIcon />} />
            <InfoRow label="Est. Annual Premium" value={insuranceRecommendation.estimatedAnnualPremium} currency={insuranceRecommendation.currency} icon={<PaymentsIcon />} />
            <InfoRow label="Rationale" value={insuranceRecommendation.rationale} icon={<NotesIcon />} typographyVariant="body2" />
        </Section>
      )}

      <Section title="Advisor's Rationale" icon={<InfoIcon />}>
        <Paper elevation={0} sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[100], borderRadius: 1 }}>
            <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{rationale || "No specific rationale provided."}</Typography>
        </Paper>
      </Section>

      {requiredDocuments && requiredDocuments.length > 0 && (
        <Section title="Required Documents" icon={<AssignmentTurnedInIcon />}>
          <List dense>
            {requiredDocuments.map((doc, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <ArticleIcon fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText primary={doc} />
              </ListItem>
            ))}
          </List>
        </Section>
      )}

      {applyLink && !isEmbedded && (
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Button variant="contained" color="primary" size="large" href={applyLink} target="_blank" rel="noopener noreferrer" startIcon={<BusinessIcon />}>
            Apply at {bankName}
          </Button>
        </Box>
      )}
       {applyLink && isEmbedded && ( 
         <Box sx={{ textAlign: 'left', mt: 2, mb: 1 }}>
             <Typography variant="caption" color="text.secondary">
                The "Apply Now" button is available on the main card summary.
             </Typography>
         </Box>
       )}
    </>
  );

  if (isEmbedded) {
    return <Box sx={{pt:0, pb:0}}>{content}</Box>; 
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: theme.shape.borderRadius * 1.5 }}>
        {content}
      </Paper>
    </Container>
  );
};

export default FullRecommendationDetailView;

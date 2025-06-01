
import React, { useState, useEffect, useMemo } from 'react';
import { YearlyBreakdownChartProps, YearlyOwnershipData } from '../types';
import { useTheme } from '@mui/material/styles'; // Import useTheme

interface TooltipData {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPayment: number;
  x: number;
  y: number;
  currency: string;
}

const CHART_CONTAINER_MIN_HEIGHT_PX = 240; 
const BAR_AREA_HEIGHT_PX = 180; 
const MIN_BAR_HEIGHT_PX = 2; 

const YearlyBreakdownChart: React.FC<YearlyBreakdownChartProps> = ({ data, currency, loanTerm }) => {
  const theme = useTheme(); // Get the current theme
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [animateBars, setAnimateBars] = useState<boolean>(false);

  // Dynamic colors based on theme
  const principalBarColor = theme.palette.primary.main;
  const principalBarHoverColor = theme.palette.primary.light;
  const interestBarColor = theme.palette.secondary.main;
  const interestBarHoverColor = theme.palette.secondary.light;
  const noPaymentBarColor = theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300];
  const textColor = theme.palette.text.secondary;
  const titleColor = theme.palette.text.primary;
  const legendTextColor = theme.palette.text.secondary;
  const tooltipBgColor = theme.palette.background.paper;
  const tooltipTextColor = theme.palette.getContrastText(theme.palette.background.paper);
  const scrollbarThumbColor = theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400];
  const scrollbarTrackColor = theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200];


  useEffect(() => {
    setAnimateBars(false); 
    const timer = setTimeout(() => {
      setAnimateBars(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, [data, loanTerm]);

  const formatCurrency = (amount: number, currencyCode: string, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      ...options
    }).format(amount);
  };

  const formatCurrencyPrecise = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const chartDataForDisplay = useMemo(() => {
    const result: YearlyOwnershipData[] = [];
    const inputDataIsArray = Array.isArray(data);
    let lastKnownBalanceFallback = 0;

    if (inputDataIsArray && data.length > 0) {
        const firstValidDataPoint = data.find(d => typeof d.principalPaid === 'number' && typeof d.interestPaid === 'number' && typeof d.remainingBalance === 'number');
        if (firstValidDataPoint) {
            lastKnownBalanceFallback = (Number(firstValidDataPoint.principalPaid) || 0) + (Number(firstValidDataPoint.remainingBalance) || 0) ;
        }
    }
    
    for (let i = 1; i <= loanTerm; i++) {
      const yearEntry = inputDataIsArray ? data.find(d => Number(d.year) === i) : undefined;
      if (yearEntry) {
        const principal = Number(yearEntry.principalPaid) || 0;
        const interest = Number(yearEntry.interestPaid) || 0;
        const remaining = typeof yearEntry.remainingBalance === 'number' ? Number(yearEntry.remainingBalance) : (typeof yearEntry.remainingBalance === 'string' ? (parseFloat(yearEntry.remainingBalance) || 0) : 0);
        
        result.push({
          year: i,
          principalPaid: principal,
          interestPaid: interest,
          remainingBalance: remaining,
        });
        lastKnownBalanceFallback = remaining; 
      } else {
        result.push({ year: i, principalPaid: 0, interestPaid: 0, remainingBalance: lastKnownBalanceFallback });
      }
    }
    return result;
  }, [data, loanTerm]);

  if (chartDataForDisplay.length === 0 && loanTerm > 0) {
      return <p style={{fontSize: '0.875rem', color: legendTextColor, marginTop: '1rem', padding: '1rem', textAlign: 'center'}}>Preparing chart data...</p>;
  }
  if (chartDataForDisplay.length === 0) {
    return <p style={{fontSize: '0.875rem', color: legendTextColor, marginTop: '1rem', padding: '1rem', textAlign: 'center'}}>Chart cannot be displayed (loan term might be zero or data is unavailable).</p>;
  }

  const maxYearlyPayment = Math.max(
    ...chartDataForDisplay.map(d => (Number(d.principalPaid) || 0) + (Number(d.interestPaid) || 0)),
    1 
  );

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, item: YearlyOwnershipData) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      year: item.year,
      principalPaid: Number(item.principalPaid) || 0,
      interestPaid: Number(item.interestPaid) || 0,
      totalPayment: (Number(item.principalPaid) || 0) + (Number(item.interestPaid) || 0),
      x: event.clientX, 
      y: rect.top, 
      currency: currency,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };
  
  // Scrollbar styling (inline for dynamic theme colors)
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: ${scrollbarTrackColor}; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: ${scrollbarThumbColor}; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[500]}; }
  `;


  return (
    <div style={{ marginTop: '1.5rem', position: 'relative', fontFamily: theme.typography.fontFamily }}>
      <style>{scrollbarStyles}</style>
      <h5 style={{ fontSize: '1rem', fontWeight: 500, color: titleColor, marginBottom: '1rem', textAlign: 'center' }}>Yearly Loan Payments</h5>
      <div
        className="custom-scrollbar"
        style={{ 
          display: 'flex', 
          gap: theme.spacing(1), // Consistent spacing
          overflowX: 'auto', 
          paddingBottom: '1rem', 
          alignItems: 'flex-end', 
          paddingRight: '0.5rem',
          minHeight: `${CHART_CONTAINER_MIN_HEIGHT_PX}px` 
        }}
        aria-label="Yearly loan payments chart"
      >
        {chartDataForDisplay.map((item) => {
          const principalNum = Number(item.principalPaid) || 0;
          const interestNum = Number(item.interestPaid) || 0;
          const totalPaymentThisYear = principalNum + interestNum;
          
          let barPixelHeightTarget = (totalPaymentThisYear / maxYearlyPayment) * BAR_AREA_HEIGHT_PX;
          
          if (barPixelHeightTarget < MIN_BAR_HEIGHT_PX && totalPaymentThisYear > 0.001) { // Only enforce min height if there's some payment
            barPixelHeightTarget = MIN_BAR_HEIGHT_PX;
          } else if (totalPaymentThisYear <= 0.001) {
            barPixelHeightTarget = MIN_BAR_HEIGHT_PX; // Still show a minimal bar for zero payment
          }


          const principalHeightPercent = totalPaymentThisYear > 0 ? (principalNum / totalPaymentThisYear) * 100 : 0;
          const interestHeightPercent = totalPaymentThisYear > 0 ? (interestNum / totalPaymentThisYear) * 100 : 0;
          
          const barStackStyle: React.CSSProperties = {
            minHeight: `${MIN_BAR_HEIGHT_PX}px`, 
            transition: 'height 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            width: '100%', 
            borderRadius: '3px 3px 0 0',
            backgroundColor: totalPaymentThisYear < 0.01 ? noPaymentBarColor : 'transparent',
          };

          if (animateBars) {
            barStackStyle.height = `${barPixelHeightTarget}px`;
          } else {
            barStackStyle.height = `${MIN_BAR_HEIGHT_PX}px`;
          }

          return (
            <div
              key={item.year}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: theme.spacing(7), cursor: 'pointer' }}
              onMouseEnter={(e) => handleMouseEnter(e, item)}
              onMouseLeave={handleMouseLeave}
              role="figure"
              aria-label={`Year ${item.year} payments. Total: ${formatCurrency(totalPaymentThisYear, currency)}. Principal: ${formatCurrency(principalNum, currency)}. Interest: ${formatCurrency(interestNum, currency)}.`}
            >
              <div style={{ fontSize: '0.75rem', color: legendTextColor, marginBottom: '0.25rem', height: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }} aria-hidden="true">
                {totalPaymentThisYear > 0.001 ? formatCurrency(totalPaymentThisYear, currency) : '-'}
              </div>
              <div
                style={barStackStyle}
                aria-hidden="true"
              >
                {totalPaymentThisYear >= 0.01 ? (
                  <>
                    <div
                      style={{ backgroundColor: principalBarColor, width: '100%', transition: 'background-color 0.15s', height: `${principalHeightPercent}%`, borderRadius: interestHeightPercent === 0 ? '3px 3px 0 0' : '0' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = principalBarHoverColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = principalBarColor}
                      title={`Principal: ${formatCurrencyPrecise(principalNum, currency)}`}
                    ></div>
                    {interestHeightPercent > 0 && (
                        <div
                        style={{ backgroundColor: interestBarColor, width: '100%', transition: 'background-color 0.15s', height: `${interestHeightPercent}%`, borderRadius: principalHeightPercent === 0 ? '3px 3px 0 0' : '0' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = interestBarHoverColor}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = interestBarColor}
                        title={`Interest: ${formatCurrencyPrecise(interestNum, currency)}`}
                        ></div>
                    )}
                  </>
                ) : null}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 500, color: textColor, marginTop: '0.375rem' }}>Yr {item.year}</div>
            </div>
          );
        })}
      </div>

      {tooltip && (
        <div
          style={{
            position: 'fixed', 
            top: `${tooltip.y}px`, 
            left: `${tooltip.x}px`, 
            transform: 'translate(-50%, -110%)',
            pointerEvents: 'none', 
            zIndex: theme.zIndex.tooltip, // Use theme zIndex 
            backgroundColor: tooltipBgColor,
            color: tooltipTextColor,
            fontSize: '0.75rem',
            borderRadius: theme.shape.borderRadius * 0.75, // Slightly smaller border radius
            boxShadow: theme.shadows[3],
            padding: theme.spacing(1, 1.5),
            transition: 'opacity 0.15s ease-in-out',
            opacity: 1,
          }}
          role="tooltip"
        >
          <p style={{ fontWeight: 'bold', marginBottom: '0.25rem', textAlign: 'center' }}>Year {tooltip.year}</p>
          <hr style={{ margin: '0.375rem 0', borderColor: theme.palette.divider }}/>
          <p>Principal: <span style={{ fontWeight: '600' }}>{formatCurrencyPrecise(tooltip.principalPaid, tooltip.currency)}</span></p>
          <p>Interest: <span style={{ fontWeight: '600' }}>{formatCurrencyPrecise(tooltip.interestPaid, tooltip.currency)}</span></p>
          <hr style={{ margin: '0.375rem 0', borderColor: theme.palette.divider }}/>
          <p>Total: <span style={{ fontWeight: 'bold' }}>{formatCurrencyPrecise(tooltip.totalPayment, tooltip.currency)}</span></p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: theme.spacing(2), marginTop: '1rem', fontSize: '0.75rem', color: legendTextColor }} aria-hidden="true">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '0.75rem', height: '0.75rem', backgroundColor: principalBarColor, borderRadius: '2px', marginRight: '0.375rem' }}></span> Principal
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '0.75rem', height: '0.75rem', backgroundColor: interestBarColor, borderRadius: '2px', marginRight: '0.375rem' }}></span> Interest
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ width: '0.75rem', height: '0.75rem', backgroundColor: noPaymentBarColor, borderRadius: '2px', marginRight: '0.375rem' }}></span> No/Low Payment
        </div>
      </div>
      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: legendTextColor, display: 'flex', flexDirection: 'column', gap: '0.25rem', position: 'absolute', opacity: 0, pointerEvents: 'none' }} aria-live="polite">
        <h6 style={{ fontWeight: 600 }}>Detailed Yearly Breakdown:</h6>
        {chartDataForDisplay.map((item) => {
            const principalNum = Number(item.principalPaid) || 0;
            const interestNum = Number(item.interestPaid) || 0;
            const remainingBalNum = Number(item.remainingBalance) || 0;
            return (
              <p key={`sr-data-${item.year}`}>
                Year {item.year}: 
                Principal Paid: {formatCurrencyPrecise(principalNum, currency)}, 
                Interest Paid: {formatCurrencyPrecise(interestNum, currency)}, 
                Total Payment for Year: {formatCurrencyPrecise(principalNum + interestNum, currency)}, 
                Remaining Loan Balance at End of Year: {formatCurrencyPrecise(remainingBalNum, currency)}.
              </p>
            );
        })}
      </div>
    </div>
  );
};

export default YearlyBreakdownChart;

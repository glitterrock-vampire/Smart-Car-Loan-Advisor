
import React, { useState, useEffect } from 'react';
import { OwnershipCostDonutChartProps } from '../types';
import { useTheme } from '@mui/material/styles';

const OwnershipCostDonutChart: React.FC<OwnershipCostDonutChartProps> = ({ breakdown }) => {
  const theme = useTheme();
  const [animateSegments, setAnimateSegments] = useState<boolean>(false);

  const {
    estimatedDownPaymentAmount,
    totalLoanPrincipal,
    totalEstimatedInterestPaid,
    currency,
  } = breakdown;

  useEffect(() => {
    setAnimateSegments(false); 
    const timer = setTimeout(() => {
      setAnimateSegments(true);
    }, 100); 
    return () => clearTimeout(timer);
  }, [breakdown]);


  const totalCost = (Number(estimatedDownPaymentAmount) || 0) + (Number(totalLoanPrincipal) || 0) + (Number(totalEstimatedInterestPaid) || 0);

  if (totalCost <= 0.001) { 
    return <p style={{ fontSize: '0.875rem', color: theme.palette.text.secondary, textAlign: 'center', padding: '1rem 0' }}>No cost data for chart.</p>;
  }

  const formatCurrency = (amount: number, currencyCode: string) => {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };
  
  const downPaymentColor = theme.palette.primary.main;     // Vibrant Cyan/Blue (or light theme primary)
  const principalColor = theme.palette.mode === 'dark' ? theme.palette.primary.dark : theme.palette.primary.light; // A slightly different blue
  const interestColor = theme.palette.secondary.main;    // Vibrant Purple/Magenta (or light theme secondary)

  const items = [
    { name: 'Down Payment', value: Number(estimatedDownPaymentAmount) || 0, color: downPaymentColor, textColor: downPaymentColor },
    { name: 'Principal', value: Number(totalLoanPrincipal) || 0, color: principalColor, textColor: principalColor },
    { name: 'Interest', value: Number(totalEstimatedInterestPaid) || 0, color: interestColor, textColor: interestColor },
  ].filter(item => item.value > 0.001); 

  const radius = 55; 
  const strokeWidth = 16; 
  const innerRadius = radius - strokeWidth / 2; 
  const circumference = 2 * Math.PI * innerRadius;
  const viewBoxSize = radius * 2;

  let accumulatedPercentage = 0;

  if (items.length === 0) {
    return <p style={{ fontSize: '0.875rem', color: theme.palette.text.secondary, textAlign: 'center', padding: '1rem 0' }}>No significant cost components to display in chart.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', margin: '0 auto', fontFamily: theme.typography.fontFamily }} aria-label="Ownership cost breakdown chart">
      <svg width="100%" height="auto" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} style={{ transform: 'rotate(-90deg)' }} role="img">
        <title id="donut-title">Ownership Cost Breakdown</title>
        <desc id="donut-desc">A donut chart showing the breakdown of vehicle ownership costs into down payment, loan principal, and total interest.</desc>
        <circle
          aria-hidden="true"
          cx={radius}
          cy={radius}
          r={innerRadius}
          fill="transparent"
          stroke={theme.palette.mode === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)"}
          strokeWidth={strokeWidth}
        />
        {items.map((item, index) => {
          const percentage = (item.value / totalCost) * 100;
          const segmentLength = (percentage / 100) * circumference;
          
          const initialStrokeDasharray = `0 ${circumference}`; 
          const finalStrokeDasharray = `${segmentLength} ${circumference - segmentLength}`; 
          
          const currentStrokeDasharray = animateSegments ? finalStrokeDasharray : initialStrokeDasharray;
          const strokeDashoffsetValue = (-accumulatedPercentage / 100) * circumference;
          
          accumulatedPercentage += percentage;

          return (
            <circle
              key={index}
              cx={radius}
              cy={radius}
              r={innerRadius}
              fill="transparent"
              style={{ 
                stroke: item.color,
                transitionProperty: 'stroke-dasharray, stroke-dashoffset',
                transitionDuration: '0.7s',
                transitionTimingFunction: 'ease-out'
              }} 
              strokeWidth={strokeWidth}
              strokeDasharray={currentStrokeDasharray}
              strokeDashoffset={strokeDashoffsetValue}
              strokeLinecap="butt" 
              aria-label={`${item.name}: ${formatCurrency(item.value, currency)} (${percentage.toFixed(1)}%)`}
            />
          );
        })}
      </svg>
      <div style={{ marginTop: '1rem', width: '100%', display: 'flex', flexDirection: 'column', gap: '0.375rem' }} aria-hidden="true"> 
        {items.map((item, index) => {
          const percentage = (item.value / totalCost) * 100;
          return (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}> 
                <span style={{ width: '0.625rem', height: '0.625rem', backgroundColor: item.color, borderRadius: '2px', marginRight: '0.5rem', flexShrink: 0 }}></span>
                <span style={{ color: theme.palette.text.secondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: '0.25rem' }}>{item.name}</span>
              </div>
              <span style={{ color: item.textColor, fontWeight: 500, textAlign: 'right', whiteSpace: 'nowrap' }}>
                {formatCurrency(item.value, currency)} ({percentage.toFixed(1)}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OwnershipCostDonutChart;

import React from 'react';
import { Box, useTheme } from '@mui/material';

const CarCityscapeIllustration: React.FC = () => {
  const theme = useTheme();
  return (
    <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', position: 'relative' }}>
      <svg viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%'}}>
        <defs>
          <linearGradient id="skyGradientDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: theme.palette.background.default /* Darker part of sky */, stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: theme.palette.background.paper /* Slightly 'lighter' dark for horizon */, stopOpacity: 1}} />
          </linearGradient>
           <filter id="softGlowDark" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Sky background */}
        <rect width="800" height="300" fill="url(#skyGradientDark)" />

        {/* Subtle distant clouds/haze - adapted for dark theme */}
        <circle cx="150" cy="80" r="40" fill="rgba(42, 43, 77, 0.3)" className="cloud" style={{ animationDelay: '0s' }} />
        <circle cx="300" cy="60" r="55" fill="rgba(42, 43, 77, 0.2)" className="cloud" style={{ animationDelay: '1.5s' }} />
        <circle cx="550" cy="90" r="45" fill="rgba(42, 43, 77, 0.25)" className="cloud" style={{ animationDelay: '0.5s' }} />
        <circle cx="700" cy="70" r="50" fill="rgba(42, 43, 77, 0.3)" className="cloud" style={{ animationDelay: '2s' }} />
        
        {/* Cityscape - Darker, more abstract tones */}
        <rect x="50" y="120" width="60" height="130" fill="rgba(28, 29, 58, 0.6)" /* Darker than paper */ />
        <rect x="120" y="100" width="50" height="150" fill="rgba(28, 29, 58, 0.6)" />
        <rect x="180" y="140" width="40" height="110" fill="rgba(28, 29, 58, 0.5)" />

        <rect x="250" y="110" width="70" height="140" fill="rgba(42, 43, 77, 0.7)"/>
        <rect x="330" y="90" width="55" height="160" fill="rgba(42, 43, 77, 0.7)" />
        <rect x="395" y="130" width="45" height="120" fill="rgba(42, 43, 77, 0.65)" />

        <rect x="470" y="100" width="60" height="150" fill="rgba(50, 52, 90, 0.8)" />
        <rect x="540" y="80" width="50" height="170" fill="rgba(50, 52, 90, 0.8)" />
        <rect x="600" y="120" width="40" height="130" fill="rgba(50, 52, 90, 0.75)" />
        <rect x="650" y="100" width="55" height="150" fill="rgba(50, 52, 90, 0.8)" />

        {/* Foreground trees - Darker, desaturated */}
        <circle cx="70" cy="220" r="25" fill="#2A2B4D" />
        <rect x="65" y="240" width="10" height="20" fill="#101024" />
        <circle cx="150" cy="210" r="30" fill="#2A2B4D" />
        <rect x="145" y="235" width="10" height="25" fill="#101024" />
        <circle cx="680" cy="225" r="28" fill="#2A2B4D" />
        <rect x="675" y="248" width="10" height="22" fill="#101024" />
        <circle cx="750" cy="215" r="22" fill="#2A2B4D" />
        <rect x="745" y="232" width="10" height="18" fill="#101024" />

        {/* Road */}
        <path d="M0 250 Q100 240, 200 255 T400 245 T600 260 T800 250 L800 300 L0 300 Z" fill="#1E1E2D" /* Dark paper, slightly lighter than default bg */ />
        {/* Road Lines */}
        <path d="M0 270 Q100 262, 200 275 T400 268 T600 280 T800 272" stroke="rgba(255,255,255,0.2)" /* Lighter gray for lines */ strokeWidth="3" strokeDasharray="20 15" fill="none" className="road-line" />
        
        {/* Car - Using theme accent color */}
        <g className="car" transform="translate(350 195) scale(0.9)">
          <path d="M10 30 Q15 10, 40 10 L110 10 Q135 10, 140 30 L150 50 L10 50 Z" fill={theme.palette.secondary.main} /* Secondary accent (purple) */ />
          <path d="M25 30 Q30 15, 45 15 L105 15 Q120 15, 125 30 L115 30 L45 30 Z" fill={theme.palette.primary.light} /* Primary accent light for windows */ opacity="0.4" />
          <circle cx="60" cy="23" r="7" fill={theme.palette.text.disabled} />
          <path d="M55 30 L65 30 L60 40 Z" fill={theme.palette.text.secondary} />
          
          <circle cx="35" cy="50" r="12" fill="rgba(0,0,0,0.7)" />
          <circle cx="35" cy="50" r="6" fill="rgba(255,255,255,0.3)" />
          <circle cx="115" cy="50" r="12" fill="rgba(0,0,0,0.7)" />
          <circle cx="115" cy="50" r="6" fill="rgba(255,255,255,0.3)" />

          <ellipse cx="15" cy="40" rx="7" ry="4" fill={theme.palette.primary.main} filter="url(#softGlowDark)" />
        </g>

        <style>
          {`
            .cloud {
              animation: drift 35s linear infinite; /* Slower drift */
            }
            @keyframes drift {
              0% { transform: translateX(-40px); opacity: 0.2; }
              50% { transform: translateX(40px); opacity: 0.4; }
              100% { transform: translateX(-40px); opacity: 0.2; }
            }
            .road-line {
              animation: moveRoadLine 12s linear infinite; /* Slower road line */
            }
            @keyframes moveRoadLine {
              0% { stroke-dashoffset: 0; }
              100% { stroke-dashoffset: -105; } 
            }
            .car {
              animation: carBob 3.5s ease-in-out infinite alternate; /* Slower bob */
            }
            @keyframes carBob {
              0% { transform: translate(350px, 195px) scale(0.9); }
              100% { transform: translate(350px, 193px) scale(0.9); } 
            }
          `}
        </style>
      </svg>
    </Box>
  );
};

export default CarCityscapeIllustration;
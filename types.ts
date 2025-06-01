
export enum SupportedCarType {
  SEDAN = "Sedan",
  SUV = "SUV",
  TRUCK = "Truck",
  HATCHBACK = "Hatchback",
  COUPE = "Coupe",
  MINIVAN = "Minivan",
}

export enum CreditScoreTier {
  EXCELLENT = "Excellent", // 750+
  GOOD = "Good",           // 700-749
  FAIR = "Fair",           // 650-699
  POOR = "Poor",           // Below 650
  UNKNOWN = "Unknown/No History"
}

export enum IncomeRange { // Changed from JMD specific to generic tiers
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  UNSPECIFIED = "UNSPECIFIED"
}

export enum LoanPrioritization {
  LOWEST_RATE = "lowest_rate",
  LOWEST_MONTHLY_PAYMENT = "lowest_monthly_payment",
  SHORTEST_TERM = "shortest_term",
  NONE = "none"
}

export interface Vehicle {
  type: SupportedCarType | string;
  year: number;
  model: string;
  cost: number;
}

export interface UserLocation {
  latitude?: number;
  longitude?: number;
  city_region: string;
}

export interface UserProfile {
  creditScoreTier?: CreditScoreTier | string;
  annualIncome?: number; // New: Direct numeric input for annual income
  annualIncomeRange?: IncomeRange | string; // Kept: Derived tier for AI based on numeric input and country
  desiredDownPaymentPercent?: number;
  driversLicenseAgeYears?: number; 
  desiredLoanTermYears?: number; // New: User's preferred loan term
}

export interface UserPreferences {
  prioritize?: LoanPrioritization | string;
}

export interface UserContext {
  country: string;
  location: UserLocation;
  profile?: UserProfile;
}

export interface UserInput {
  vehicle: Vehicle;
  userContext: UserContext;
  preferences?: UserPreferences;
}

// AI Response Types
export interface LoanDetails {
  loanAmount: number;
  currency: string;
  interestRate: number; // Annual %
  loanTerm: number; // Years
  estimatedMonthlyPayment: number;
}

export interface VehicleInfo {
  fuelEfficiency: string;
}

export interface YearlyOwnershipData {
  year: number;
  principalPaid: number;
  interestPaid: number;
  remainingBalance: number;
}

export interface RecurringFeeDetail {
  name: string;
  estimatedAnnualAmount: number;
  currency: string;
  notes?: string;
}

export interface OwnershipBreakdown {
  vehicleFullCost: number;
  estimatedDownPaymentAmount: number;
  totalLoanPrincipal: number; // This is loanDetails.loanAmount
  totalEstimatedInterestPaid: number;
  totalEstimatedLoanCost: number; // principal + interest
  totalOutOfPocketForVehicle: number; // down payment + total loan cost
  currency: string;
  yearlyBreakdown?: YearlyOwnershipData[]; // New: Array for year-by-year data
  estimatedAnnualRecurringFeesTotal?: number; // New: Sum of other annual fees (licensing, maintenance etc.)
  recurringFeeDetails?: RecurringFeeDetail[]; // New: Breakdown of these recurring fees
}

export interface InsuranceRecommendation {
  providerName: string;
  policyType: string;
  estimatedAnnualPremium: number;
  currency: string;
  rationale: string;
}

export interface Recommendation {
  rank: number;
  bankName: string;
  productName: string; // Corrected from "string" to string
  loanDetails: LoanDetails;
  vehicleInfo: VehicleInfo;
  requiredDocuments: string[];
  rationale: string;
  applyLink?: string;
  ownershipBreakdown?: OwnershipBreakdown; 
  insuranceRecommendation?: InsuranceRecommendation; 
}

export interface GeminiApiResponse {
  recommendations: Recommendation[];
  messages: string[];
}

// Prop types for components
export interface CarLoanFormProps {
  onSubmit: (data: UserInput) => void;
  loading: boolean;
  apiKeyPresent: boolean;
}

export interface CompactLoanCardProps {
  recommendation: Recommendation;
  // onOpenYearlyBreakdownModal is removed
}

export interface RecommendationsDisplayProps {
  recommendations: Recommendation[];
  // onOpenYearlyBreakdownModal is removed
}


export interface ModalProps { // For the old custom Modal, not MUI Dialog
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface YearlyBreakdownChartProps {
  data: YearlyOwnershipData[];
  currency: string;
  loanTerm: number;
}

export interface OwnershipCostDonutChartProps {
  breakdown: OwnershipBreakdown;
}

export interface FullRecommendationDetailViewProps {
  recommendation: Recommendation | null;
  isEmbedded?: boolean; // New: To indicate if it's used within another component like Accordion
}

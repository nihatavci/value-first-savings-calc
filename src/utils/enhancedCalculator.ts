
import { Currency, CURRENCY_SYMBOLS } from "./calculator";

// Region multipliers for fully-loaded cost calculations
export type Region = "US" | "EU" | "UK" | "OTHER";

export const REGION_MULTIPLIERS: Record<Region, number> = {
  US: 1.25,
  EU: 1.3,
  UK: 1.4,
  OTHER: 1.2
};

// Advanced calculation model
export interface AdvancedCalculationInputs {
  // Current state
  region: Region;
  fteCount: number;
  fteAverageSalary: number;
  weeklyHours: number;
  directCosts: number; // Materials, licenses, penalties
  
  // Future state
  efficiencyGain: number; // Percentage improvement
  implementationCost: number;
  ongoingMonthlyCost: number;
}

interface AdvancedCalculationResults {
  // Current state costs
  currentLaborCost: number;
  currentTotalCost: number;
  fullyLoadedMonthlyCost: number;
  
  // Future state projections
  monthlySavings: number;
  annualSavings: number;
  implementationCostAmortized: number; // Spread over 12 months
  totalOngoingCost: number;
  netAnnualBenefit: number;
  roi: number; // Return on investment percentage
  roiMultiplier: number; // X times return
  
  // Pricing model
  setupFee: number;
  monthlyRetainer: number;
  firstYearTotalCost: number;
  firstYearNetSavings: number;
  
  // Cost of inaction
  fiveYearInactionCost: number;
}

export const calculateEnhancedSavings = (
  inputs: AdvancedCalculationInputs
): AdvancedCalculationResults => {
  // Calculate current state costs
  const fullyLoadedYearlySalary = inputs.fteAverageSalary * REGION_MULTIPLIERS[inputs.region];
  const fullyLoadedMonthlySalary = fullyLoadedYearlySalary / 12;
  const currentLaborCost = fullyLoadedMonthlySalary * inputs.fteCount;
  const currentTotalCost = currentLaborCost + inputs.directCosts;
  
  // Calculate future state projections
  const monthlySavings = currentTotalCost * (inputs.efficiencyGain / 100);
  const annualSavings = monthlySavings * 12;
  const implementationCostAmortized = inputs.implementationCost / 12; // Spread over a year
  const totalOngoingCost = inputs.ongoingMonthlyCost + implementationCostAmortized;
  
  // Calculate ROI metrics
  const netAnnualBenefit = annualSavings - (inputs.ongoingMonthlyCost * 12);
  const roi = (netAnnualBenefit / inputs.implementationCost) * 100;
  const roiMultiplier = netAnnualBenefit / inputs.implementationCost;
  
  // Calculate pricing under value-first model
  const setupFee = monthlySavings * 0.5;
  const monthlyRetainer = monthlySavings * 0.1;
  const firstYearTotalCost = setupFee + (monthlyRetainer * 12);
  const firstYearNetSavings = annualSavings - firstYearTotalCost;
  
  // Cost of inaction (5-year projection without optimization)
  const fiveYearInactionCost = currentTotalCost * 12 * 5;
  
  return {
    currentLaborCost,
    currentTotalCost,
    fullyLoadedMonthlyCost: currentTotalCost,
    monthlySavings,
    annualSavings,
    implementationCostAmortized,
    totalOngoingCost,
    netAnnualBenefit,
    roi,
    roiMultiplier,
    setupFee,
    monthlyRetainer,
    firstYearTotalCost,
    firstYearNetSavings,
    fiveYearInactionCost
  };
};

export const formatCurrencyWithMultiplier = (
  amount: number,
  currency: Currency = "USD",
  multiplier?: number
): string => {
  if (multiplier && multiplier > 1) {
    // For large numbers, use abbreviated format (e.g., $1.2M)
    const absAmount = Math.abs(amount);
    
    if (absAmount >= 1000000) {
      return `${CURRENCY_SYMBOLS[currency]}${(amount / 1000000).toFixed(1)}M`;
    }
    
    if (absAmount >= 1000) {
      return `${CURRENCY_SYMBOLS[currency]}${(amount / 1000).toFixed(1)}K`;
    }
  }
  
  // Default formatting
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

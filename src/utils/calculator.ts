
/**
 * Utility functions for the Savings Optimization Calculator
 */

/**
 * Currency type for formatting
 */
export type Currency = "USD" | "EUR" | "GBP";

/**
 * Currency symbols mapping
 */
export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

/**
 * Format a number as currency
 */
export const formatCurrency = (
  amount: number,
  currency: Currency = "USD"
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return formatter.format(amount);
};

/**
 * Calculate savings and fees based on current spend and efficiency gain
 */
export const calculateSavings = (
  currentSpend: number,
  efficiencyGain: number
) => {
  const monthlySavings = currentSpend * (efficiencyGain / 100);
  const annualSavings = monthlySavings * 12;
  
  return {
    monthlySavings,
    annualSavings,
    setupFee: monthlySavings * 0.5, // 50% of first month's savings
    monthlyRetainer: monthlySavings * 0.1, // 10% of monthly savings
    firstMonthCost: monthlySavings * 0.5, // Setup fee
    firstYearTotalCost: monthlySavings * 0.5 + monthlySavings * 0.1 * 12, // Setup + 12 months of retainer
    firstYearNetSavings: annualSavings - (monthlySavings * 0.5 + monthlySavings * 0.1 * 12) // Annual savings - total cost
  };
};

/**
 * Pain point options for the calculator
 */
export const PAIN_POINTS = [
  { value: "manual-processes", label: "Manual Data Processing" },
  { value: "error-rate", label: "High Error Rates" },
  { value: "service-levels", label: "Poor Service Levels" },
  { value: "staff-costs", label: "Excessive Staff Costs" },
  { value: "operational-inefficiency", label: "Operational Inefficiency" },
  { value: "low-productivity", label: "Low Team Productivity" },
  { value: "slow-response", label: "Slow Response Times" },
  { value: "outdated-systems", label: "Outdated Systems & Processes" },
];

/**
 * Default efficiency gains based on pain point
 */
export const DEFAULT_EFFICIENCY_GAINS: Record<string, number> = {
  "manual-processes": 55,
  "error-rate": 60,
  "service-levels": 45,
  "staff-costs": 40,
  "operational-inefficiency": 50,
  "low-productivity": 45,
  "slow-response": 50,
  "outdated-systems": 55,
};

/**
 * Get the average industry spend for benchmarking
 */
export const getIndustryAverage = (painPoint: string): number => {
  // This would typically come from a database or API
  // Using static values for demonstration
  const averages: Record<string, number> = {
    "manual-processes": 20000,
    "error-rate": 15000,
    "service-levels": 25000,
    "staff-costs": 35000,
    "operational-inefficiency": 30000,
    "low-productivity": 18000,
    "slow-response": 22000,
    "outdated-systems": 40000,
  };
  
  return averages[painPoint] || 20000;
};

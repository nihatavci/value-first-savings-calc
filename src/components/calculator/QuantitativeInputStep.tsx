
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  DEFAULT_EFFICIENCY_GAINS, 
  Currency, 
  CURRENCY_SYMBOLS, 
  formatCurrency, 
  getIndustryAverage 
} from "@/utils/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Region, REGION_MULTIPLIERS } from "@/utils/enhancedCalculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface QuantitativeInputStepProps {
  painPoint: string;
  currency: Currency;
  currentSpend: number;
  setCurrentSpend: (value: number) => void;
  efficiencyGain: number;
  setEfficiencyGain: (value: number) => void;
  // New props for enhanced calculator
  region: Region;
  setRegion: (value: Region) => void;
  fteCount: number;
  setFteCount: (value: number) => void;
  fteAverageSalary: number;
  setFteAverageSalary: (value: number) => void;
  weeklyHours: number;
  setWeeklyHours: (value: number) => void;
  directCosts: number;
  setDirectCosts: (value: number) => void;
  showAdvancedOptions: boolean;
  setShowAdvancedOptions: (value: boolean) => void;
}

const QuantitativeInputStep: React.FC<QuantitativeInputStepProps> = ({
  painPoint,
  currency,
  currentSpend,
  setCurrentSpend,
  efficiencyGain,
  setEfficiencyGain,
  region,
  setRegion,
  fteCount,
  setFteCount,
  fteAverageSalary,
  setFteAverageSalary,
  weeklyHours,
  setWeeklyHours,
  directCosts,
  setDirectCosts,
  showAdvancedOptions,
  setShowAdvancedOptions
}) => {
  const industryAverage = getIndustryAverage(painPoint);
  const defaultGain = DEFAULT_EFFICIENCY_GAINS[painPoint] || 50;

  // Set the default efficiency gain when pain point changes
  React.useEffect(() => {
    setEfficiencyGain(defaultGain);
  }, [painPoint, defaultGain, setEfficiencyGain]);

  const handleSpendChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setCurrentSpend(parseFloat(value) || 0);
  };

  const handleFteCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setFteCount(Math.min(Math.max(value, 0), 100)); // Limit between 0 and 100
  };

  const handleFteSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setFteAverageSalary(parseFloat(value) || 0);
  };

  const handleWeeklyHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setWeeklyHours(Math.min(Math.max(value, 0), 168)); // Limit between 0 and 168 (max hours in a week)
  };

  const handleDirectCostsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setDirectCosts(parseFloat(value) || 0);
  };

  // Calculate fully loaded cost based on FTE inputs
  const calculateFullyLoadedCost = () => {
    if (fteCount <= 0 || fteAverageSalary <= 0) return 0;
    
    const multiplier = REGION_MULTIPLIERS[region];
    const annualFullyLoaded = fteAverageSalary * multiplier * fteCount;
    return annualFullyLoaded / 12; // Monthly cost
  };

  // Calculate time cost based on weekly hours
  const calculateTimeCost = () => {
    if (fteCount <= 0 || fteAverageSalary <= 0 || weeklyHours <= 0) return 0;
    
    const multiplier = REGION_MULTIPLIERS[region];
    const hourlyRate = (fteAverageSalary * multiplier) / (52 * 40); // Assuming 52 weeks, 40 hour work week
    return hourlyRate * weeklyHours * 4.33; // Monthly cost (4.33 weeks per month average)
  };

  // Total estimated cost
  const totalMonthlyCost = showAdvancedOptions 
    ? (calculateTimeCost() + directCosts)
    : currentSpend;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-brand-700 mb-3">
          Quantify Your Current Situation
        </h2>
        <p className="text-gray-600">
          Help us understand your current costs and challenges
        </p>
      </div>

      <div className="flex justify-end mb-2">
        <div className="flex items-center space-x-2">
          <Switch 
            id="advanced-options"
            checked={showAdvancedOptions}
            onCheckedChange={setShowAdvancedOptions}
          />
          <Label htmlFor="advanced-options" className="cursor-pointer">
            Advanced Options
          </Label>
        </div>
      </div>

      <div className="space-y-8 max-w-lg mx-auto">
        {!showAdvancedOptions ? (
          // Simple view - just current monthly spend
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="current-spend" className="text-base">
                Current Monthly Spend
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Your current monthly expenditure on this operational area, including direct costs, staff time, and related expenses.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              
              <div className="flex items-center text-gray-500 text-sm">
                Industry Avg: {formatCurrency(industryAverage, currency)}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {CURRENCY_SYMBOLS[currency]}
              </div>
              <Input
                id="current-spend"
                type="text"
                value={currentSpend === 0 ? "" : currentSpend}
                onChange={handleSpendChange}
                className="pl-8"
                placeholder={`${industryAverage}`}
              />
            </div>
          </div>
        ) : (
          // Advanced view - FTE calculation
          <div className="space-y-6 border p-4 rounded-md bg-gray-50">
            <h3 className="font-medium text-lg text-brand-700">Current State Analysis</h3>
            
            {/* Region Selection */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-base">
                Region
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Select your region to apply the correct overhead multiplier for fully-loaded cost calculation.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              
              <Select value={region} onValueChange={(value) => setRegion(value as Region)}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States (1.25x)</SelectItem>
                  <SelectItem value="EU">European Union (1.3x)</SelectItem>
                  <SelectItem value="UK">United Kingdom (1.4x)</SelectItem>
                  <SelectItem value="OTHER">Other Regions (1.2x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* FTE Count and Salary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fte-count" className="text-base">
                  Number of Employees
                </Label>
                <Input
                  id="fte-count"
                  type="number"
                  min="0"
                  max="100"
                  value={fteCount || ""}
                  onChange={handleFteCountChange}
                  placeholder="1-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fte-salary" className="text-base">
                  Average Annual Salary
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {CURRENCY_SYMBOLS[currency]}
                  </div>
                  <Input
                    id="fte-salary"
                    type="text"
                    value={fteAverageSalary === 0 ? "" : fteAverageSalary}
                    onChange={handleFteSalaryChange}
                    className="pl-8"
                    placeholder="50000"
                  />
                </div>
              </div>
            </div>
            
            {/* Weekly Hours and Direct Costs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weekly-hours" className="text-base">
                  Weekly Hours on This Process
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Total hours spent by all employees on this process per week.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="weekly-hours"
                  type="number"
                  min="0"
                  max="168"
                  value={weeklyHours || ""}
                  onChange={handleWeeklyHoursChange}
                  placeholder="20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="direct-costs" className="text-base">
                  Other Monthly Costs
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Additional monthly expenses like materials, licenses, penalties, or external services.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {CURRENCY_SYMBOLS[currency]}
                  </div>
                  <Input
                    id="direct-costs"
                    type="text"
                    value={directCosts === 0 ? "" : directCosts}
                    onChange={handleDirectCostsChange}
                    className="pl-8"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
            
            {/* Calculated FTE Cost */}
            {fteCount > 0 && fteAverageSalary > 0 && (
              <div className="bg-white p-3 rounded border text-sm">
                <div className="flex justify-between mb-1">
                  <span>Fully-loaded monthly FTE cost:</span>
                  <span className="font-medium">{formatCurrency(calculateFullyLoadedCost(), currency)}</span>
                </div>
                {weeklyHours > 0 && (
                  <div className="flex justify-between">
                    <span>Time cost for this process:</span>
                    <span className="font-medium">{formatCurrency(calculateTimeCost(), currency)}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Update current spend based on calculated values */}
            {React.useEffect(() => {
              if (showAdvancedOptions && calculateTimeCost() > 0) {
                setCurrentSpend(totalMonthlyCost);
              }
            }, [showAdvancedOptions, calculateTimeCost(), directCosts])}
          </div>
        )}

        {/* Efficiency Gain Slider */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="efficiency-gain" className="text-base">
              Potential Efficiency Gain
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Based on similar projects, this is our expected efficiency improvement range. Adjust based on your specific situation or goals.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <span className="font-medium text-brand-700">{efficiencyGain}%</span>
          </div>
          
          <Slider
            id="efficiency-gain"
            min={10}
            max={80}
            step={5}
            value={[efficiencyGain]}
            onValueChange={(value) => setEfficiencyGain(value[0])}
            className="py-4"
          />
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Conservative (10%)</span>
            <span>Typical (40-60%)</span>
            <span>Optimal (80%)</span>
          </div>
        </div>

        {/* Monthly Savings Preview */}
        {totalMonthlyCost > 0 && (
          <Card className="mt-6 bg-brand-50 border-brand-200 animate-in fade-in duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2 text-brand-800">Projected Monthly Savings</h3>
              <div className="text-3xl font-bold text-brand-700">
                {formatCurrency(totalMonthlyCost * (efficiencyGain / 100), currency)}
                <span className="text-sm font-normal text-gray-500 ml-2">per month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on your current monthly spend of {formatCurrency(totalMonthlyCost, currency)} and an efficiency gain of {efficiencyGain}%
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuantitativeInputStep;

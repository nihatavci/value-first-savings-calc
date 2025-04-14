
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_EFFICIENCY_GAINS, Currency, CURRENCY_SYMBOLS, formatCurrency, getIndustryAverage } from "@/utils/calculator";
import { Card, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuantitativeInputStepProps {
  painPoint: string;
  currency: Currency;
  currentSpend: number;
  setCurrentSpend: (value: number) => void;
  efficiencyGain: number;
  setEfficiencyGain: (value: number) => void;
}

const QuantitativeInputStep: React.FC<QuantitativeInputStepProps> = ({
  painPoint,
  currency,
  currentSpend,
  setCurrentSpend,
  efficiencyGain,
  setEfficiencyGain,
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-brand-800 mb-3">
          Quantify Your Current Situation
        </h2>
        <p className="text-gray-600">
          Help us understand your current costs and challenges
        </p>
      </div>

      <div className="space-y-8 max-w-lg mx-auto">
        {/* Current Monthly Spend */}
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
        {currentSpend > 0 && (
          <Card className="mt-6 bg-brand-50 border-brand-200 animate-in fade-in duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-2 text-brand-800">Projected Monthly Savings</h3>
              <div className="text-3xl font-bold text-brand-700">
                {formatCurrency(currentSpend * (efficiencyGain / 100), currency)}
                <span className="text-sm font-normal text-gray-500 ml-2">per month</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Based on your current monthly spend of {formatCurrency(currentSpend, currency)} and an efficiency gain of {efficiencyGain}%
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuantitativeInputStep;

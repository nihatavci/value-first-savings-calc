
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { calculateSavings, Currency, formatCurrency } from "@/utils/calculator";
import { PAIN_POINTS } from "@/utils/calculator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProposalStepProps {
  painPoint: string;
  currency: Currency;
  currentSpend: number;
  efficiencyGain: number;
  implementationDate: Date | undefined;
  setImplementationDate: (date: Date | undefined) => void;
}

const ProposalStep: React.FC<ProposalStepProps> = ({
  painPoint,
  currency,
  currentSpend,
  efficiencyGain,
  implementationDate,
  setImplementationDate,
}) => {
  const savings = calculateSavings(currentSpend, efficiencyGain);
  const painPointLabel = PAIN_POINTS.find((p) => p.value === painPoint)?.label || "";

  const handleGeneratePDF = () => {
    alert("PDF generation would happen here. In a real implementation, this would create a downloadable PDF with the proposal details.");
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-brand-800 mb-3">
          Your Value-First Proposal
        </h2>
        <p className="text-gray-600">
          We only earn when you save - guaranteeing our commitment to your success
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Financial Summary */}
        <div className="space-y-6">
          <Card className="border-brand-200">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-brand-800">Financial Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Current Monthly Spend</span>
                  <span className="font-medium">{formatCurrency(currentSpend, currency)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Monthly Savings</span>
                  <span className="font-medium text-green-600">{formatCurrency(savings.monthlySavings, currency)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Annual Savings</span>
                  <span className="font-bold text-green-600">{formatCurrency(savings.annualSavings, currency)}</span>
                </div>

                <div className="pt-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-600">Setup Fee (One-time)</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>50% of first month's projected savings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-medium">{formatCurrency(savings.setupFee, currency)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center">
                      <span className="text-gray-600">Monthly Retainer</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>10% of actual monthly savings</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <span className="font-medium">{formatCurrency(savings.monthlyRetainer, currency)}</span>
                  </div>
                </div>

                <div className="bg-brand-50 p-4 rounded-md mt-6">
                  <h4 className="font-medium text-brand-800 mb-2">First Year Net Benefit</h4>
                  <div className="text-2xl font-bold text-brand-700">
                    {formatCurrency(savings.firstYearNetSavings, currency)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    After all fees and costs
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Date Picker */}
          <div>
            <h3 className="text-lg font-medium mb-3 text-brand-800">Proposed Implementation Date</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {implementationDate ? (
                    format(implementationDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={implementationDate}
                  onSelect={setImplementationDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right Column - Value Proposition */}
        <div className="space-y-6">
          <Card className="border-brand-200 h-full">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4 text-brand-800">Our Value Promise</h3>
              
              <div className="space-y-5">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">No Risk, All Reward</h4>
                    <p className="text-gray-600 text-sm">
                      If we don't generate savings, you don't pay ongoing fees. It's that simple.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Targeted Solution</h4>
                    <p className="text-gray-600 text-sm">
                      We'll focus specifically on your {painPointLabel.toLowerCase()} challenges.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Transparent Pricing</h4>
                    <p className="text-gray-600 text-sm">
                      One-time setup is just 50% of first month's projected savings. Ongoing fee is only 10% of actual realized savings.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Measurable Outcomes</h4>
                    <p className="text-gray-600 text-sm">
                      Regular reporting on your savings and ROI, with complete transparency.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Predictable Budgeting</h4>
                    <p className="text-gray-600 text-sm">
                      No surprise fees or hidden costs. You'll always know exactly what you're paying and why.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-800 mb-2">Ready to Transform Your Operations?</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Schedule a detailed walkthrough with our solutions team to discuss your specific needs.
                </p>
                <Button 
                  onClick={handleGeneratePDF} 
                  className="w-full bg-brand-600 hover:bg-brand-700"
                >
                  Download Proposal PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProposalStep;

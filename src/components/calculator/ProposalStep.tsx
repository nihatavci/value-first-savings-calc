
import React from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, CheckCircle, Info, TrendingUp, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { calculateSavings, Currency, formatCurrency } from "@/utils/calculator";
import { PAIN_POINTS } from "@/utils/calculator";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CURRENCY_SYMBOLS } from "@/utils/calculator";
import { calculateEnhancedSavings, Region, formatCurrencyWithMultiplier } from "@/utils/enhancedCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProposalStepProps {
  painPoint: string;
  currency: Currency;
  currentSpend: number;
  efficiencyGain: number;
  implementationDate: Date | undefined;
  setImplementationDate: (date: Date | undefined) => void;
  // Enhanced props
  region: Region;
  implementationCost: number;
  setImplementationCost: (value: number) => void;
  ongoingMonthlyCost: number;
  setOngoingMonthlyCost: (value: number) => void;
  showAdvancedAnalysis: boolean;
}

const ProposalStep: React.FC<ProposalStepProps> = ({
  painPoint,
  currency,
  currentSpend,
  efficiencyGain,
  implementationDate,
  setImplementationDate,
  region,
  implementationCost,
  setImplementationCost,
  ongoingMonthlyCost,
  setOngoingMonthlyCost,
  showAdvancedAnalysis
}) => {
  const savings = calculateSavings(currentSpend, efficiencyGain);
  const painPointLabel = PAIN_POINTS.find((p) => p.value === painPoint)?.label || "";

  // Enhanced savings calculation
  const enhancedSavings = calculateEnhancedSavings({
    region,
    fteCount: 1, // These values will be overridden by currentSpend
    fteAverageSalary: 0,
    weeklyHours: 0,
    directCosts: 0,
    efficiencyGain,
    implementationCost,
    ongoingMonthlyCost,
  });

  // Override the calculated values with our simplified inputs
  enhancedSavings.currentTotalCost = currentSpend;
  enhancedSavings.monthlySavings = currentSpend * (efficiencyGain / 100);
  enhancedSavings.annualSavings = enhancedSavings.monthlySavings * 12;
  enhancedSavings.netAnnualBenefit = enhancedSavings.annualSavings - (implementationCost + ongoingMonthlyCost * 12);
  enhancedSavings.roi = (enhancedSavings.netAnnualBenefit / implementationCost) * 100;
  enhancedSavings.roiMultiplier = enhancedSavings.netAnnualBenefit / implementationCost;

  const handleGeneratePDF = () => {
    alert("PDF generation would happen here. In a real implementation, this would create a downloadable PDF with the proposal details.");
  };

  const handleImplementationCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setImplementationCost(parseFloat(value) || 0);
  };

  const handleOngoingCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setOngoingMonthlyCost(parseFloat(value) || 0);
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-brand-700 mb-3">
          Your Value-First Proposal
        </h2>
        <p className="text-gray-600">
          We only earn when you save - guaranteeing our commitment to your success
        </p>
      </div>

      {showAdvancedAnalysis && (
        <div className="mb-8 space-y-6">
          <h3 className="font-medium text-lg text-brand-700">Future State Modeling</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="implementation-cost" className="text-base">
                Implementation Cost (One-time)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>One-time cost to implement the solution, including training, configuration, and setup.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {CURRENCY_SYMBOLS[currency]}
                </div>
                <Input
                  id="implementation-cost"
                  type="text"
                  value={implementationCost === 0 ? "" : implementationCost}
                  onChange={handleImplementationCostChange}
                  className="pl-8"
                  placeholder="25000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ongoing-cost" className="text-base">
                Ongoing Monthly Cost
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 ml-1 inline cursor-help text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p>Monthly cost to maintain the solution, including software licenses, maintenance, and support.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {CURRENCY_SYMBOLS[currency]}
                </div>
                <Input
                  id="ongoing-cost"
                  type="text"
                  value={ongoingMonthlyCost === 0 ? "" : ongoingMonthlyCost}
                  onChange={handleOngoingCostChange}
                  className="pl-8"
                  placeholder="2000"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="summary" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="summary" className="data-[state=active]:bg-brand-100 data-[state=active]:text-brand-700">
            Summary
          </TabsTrigger>
          <TabsTrigger value="detailed" className="data-[state=active]:bg-brand-100 data-[state=active]:text-brand-700">
            Detailed Analysis
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="pt-4">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Financial Summary */}
            <div className="space-y-6">
              <Card className="border-brand-200">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-brand-700">Financial Summary</h3>
                  
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
                      <h4 className="font-medium text-brand-700 mb-2">First Year Net Benefit</h4>
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
                <h3 className="text-lg font-medium mb-3 text-brand-700">Proposed Implementation Date</h3>
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
                  <h3 className="text-xl font-semibold mb-4 text-brand-700">Our Value Promise</h3>
                  
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
                      className="w-full bg-brand-700 hover:bg-brand-800"
                    >
                      Download Proposal PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="detailed" className="pt-4">
          <div className="space-y-8">
            {/* ROI Dashboard */}
            <Card className="border-brand-200">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-brand-700">Return on Investment Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-brand-50 p-4 rounded-md text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 text-brand-700 mb-2">
                      <TrendingUp size={20} />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">ROI Percentage</div>
                    <div className="text-2xl font-bold text-brand-700">
                      {showAdvancedAnalysis ? Math.round(enhancedSavings.roi) : Math.round((savings.firstYearNetSavings / savings.setupFee) * 100)}%
                    </div>
                  </div>
                  
                  <div className="bg-brand-50 p-4 rounded-md text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 text-brand-700 mb-2">
                      <DollarSign size={20} />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">First Year Net Benefit</div>
                    <div className="text-2xl font-bold text-brand-700">
                      {showAdvancedAnalysis 
                        ? formatCurrency(enhancedSavings.netAnnualBenefit, currency)
                        : formatCurrency(savings.firstYearNetSavings, currency)}
                    </div>
                  </div>
                  
                  <div className="bg-brand-50 p-4 rounded-md text-center">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-100 text-brand-700 mb-2">
                      <Clock size={20} />
                    </div>
                    <div className="text-sm text-gray-600 mb-1">Payback Period</div>
                    <div className="text-2xl font-bold text-brand-700">
                      {showAdvancedAnalysis 
                        ? Math.ceil((implementationCost / enhancedSavings.monthlySavings)) 
                        : Math.ceil((savings.setupFee / savings.monthlySavings))} months
                    </div>
                  </div>
                </div>
                
                {/* Cost of Inaction */}
                <div className="border-t border-gray-100 pt-6 mt-6">
                  <h4 className="font-medium text-lg text-brand-700 mb-4">Cost of Inaction Analysis</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-red-200 bg-red-50 p-4 rounded-md">
                      <h5 className="text-red-700 font-medium mb-2">5-Year Cost Without Optimization</h5>
                      <div className="text-2xl font-bold text-red-700">
                        {formatCurrencyWithMultiplier(currentSpend * 12 * 5, currency, 5)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Continuing with current processes will cost you significantly more over time.
                      </p>
                    </div>
                    
                    <div className="border border-green-200 bg-green-50 p-4 rounded-md">
                      <h5 className="text-green-700 font-medium mb-2">5-Year Savings With Our Solution</h5>
                      <div className="text-2xl font-bold text-green-700">
                        {formatCurrencyWithMultiplier(savings.annualSavings * 5 - savings.setupFee - (savings.monthlyRetainer * 12 * 5), currency, 5)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Implementing our solution provides substantial long-term savings.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Implementation Timeline */}
                {implementationDate && (
                  <div className="border-t border-gray-100 pt-6 mt-6">
                    <h4 className="font-medium text-lg text-brand-700 mb-4">Implementation Timeline</h4>
                    
                    <div className="relative pl-6 border-l-2 border-brand-200 space-y-6">
                      <div className="relative">
                        <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-brand-700"></div>
                        <h5 className="font-medium">{format(implementationDate, "MMMM d, yyyy")}</h5>
                        <p className="text-gray-600">Project kickoff and initial assessment</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-brand-400"></div>
                        <h5 className="font-medium">
                          {format(new Date(implementationDate.getTime() + 14 * 24 * 60 * 60 * 1000), "MMMM d, yyyy")}
                        </h5>
                        <p className="text-gray-600">Solution deployment and team training</p>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-[25px] w-5 h-5 rounded-full bg-brand-200"></div>
                        <h5 className="font-medium">
                          {format(new Date(implementationDate.getTime() + 30 * 24 * 60 * 60 * 1000), "MMMM d, yyyy")}
                        </h5>
                        <p className="text-gray-600">First optimization results and ROI assessment</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleGeneratePDF} 
              className="w-full bg-brand-700 hover:bg-brand-800"
            >
              Download Detailed Analysis PDF
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProposalStep;

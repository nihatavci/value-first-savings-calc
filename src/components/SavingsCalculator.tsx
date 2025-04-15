
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Currency, CURRENCY_SYMBOLS } from "@/utils/calculator";
import PainPointStep from "./calculator/PainPointStep";
import QuantitativeInputStep from "./calculator/QuantitativeInputStep";
import ProposalStep from "./calculator/ProposalStep";
import { Region } from "@/utils/enhancedCalculator";

const steps = ["pain-point", "quantify", "proposal"];

const SavingsCalculator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [painPoint, setPainPoint] = useState("");
  const [currentSpend, setCurrentSpend] = useState<number>(0);
  const [efficiencyGain, setEfficiencyGain] = useState(50);
  const [implementationDate, setImplementationDate] = useState<Date | undefined>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Default to 2 weeks from now
  );
  
  // Enhanced calculator state
  const [region, setRegion] = useState<Region>("US");
  const [fteCount, setFteCount] = useState<number>(0);
  const [fteAverageSalary, setFteAverageSalary] = useState<number>(0);
  const [weeklyHours, setWeeklyHours] = useState<number>(0);
  const [directCosts, setDirectCosts] = useState<number>(0);
  const [implementationCost, setImplementationCost] = useState<number>(0);
  const [ongoingMonthlyCost, setOngoingMonthlyCost] = useState<number>(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);

  const goToNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
      
      // Calculate implementation cost default when going to proposal step
      if (activeStep === 1) {
        // Default implementation cost is roughly 3x monthly savings
        const monthlySavings = currentSpend * (efficiencyGain / 100);
        setImplementationCost(monthlySavings * 3);
        setOngoingMonthlyCost(monthlySavings * 0.2); // Default ongoing cost
      }
    }
  };

  const goToPreviousStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
  };

  const isNextDisabled = () => {
    if (activeStep === 0 && !painPoint) return true;
    if (activeStep === 1 && currentSpend <= 0) return true;
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <Card className="border-brand-200 shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl font-bold text-brand-700">Savings Optimization Calculator</CardTitle>
          <CardDescription className="text-lg mt-2">
            Discover how our value-first pricing model can transform your business operations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Progress Indicators */}
          <div className="mb-8">
            <Tabs value={steps[activeStep]} className="w-full">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger 
                  value="pain-point" 
                  className="py-3 data-[state=active]:bg-brand-100 data-[state=active]:text-brand-700"
                  disabled
                >
                  <span className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${activeStep >= 0 ? 'bg-brand-700 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
                    Pain Point
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="quantify" 
                  className="py-3 data-[state=active]:bg-brand-100 data-[state=active]:text-brand-700"
                  disabled
                >
                  <span className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${activeStep >= 1 ? 'bg-brand-700 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
                    Quantify
                  </span>
                </TabsTrigger>
                <TabsTrigger 
                  value="proposal" 
                  className="py-3 data-[state=active]:bg-brand-100 data-[state=active]:text-brand-700"
                  disabled
                >
                  <span className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 ${activeStep >= 2 ? 'bg-brand-700 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
                    Proposal
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Currency Selector */}
          <div className="absolute top-6 right-6 flex space-x-1">
            {(Object.keys(CURRENCY_SYMBOLS) as Currency[]).map((curr) => (
              <Button 
                key={curr}
                size="sm"
                variant={currency === curr ? "default" : "outline"}
                className={currency === curr ? "bg-brand-700 hover:bg-brand-800" : ""}
                onClick={() => handleCurrencyChange(curr)}
              >
                {CURRENCY_SYMBOLS[curr]}
              </Button>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[360px]">
            {activeStep === 0 && (
              <PainPointStep 
                painPoint={painPoint} 
                setPainPoint={setPainPoint} 
              />
            )}
            {activeStep === 1 && (
              <QuantitativeInputStep 
                painPoint={painPoint}
                currency={currency}
                currentSpend={currentSpend}
                setCurrentSpend={setCurrentSpend}
                efficiencyGain={efficiencyGain}
                setEfficiencyGain={setEfficiencyGain}
                region={region}
                setRegion={setRegion}
                fteCount={fteCount}
                setFteCount={setFteCount}
                fteAverageSalary={fteAverageSalary}
                setFteAverageSalary={setFteAverageSalary}
                weeklyHours={weeklyHours}
                setWeeklyHours={setWeeklyHours}
                directCosts={directCosts}
                setDirectCosts={setDirectCosts}
                showAdvancedOptions={showAdvancedOptions}
                setShowAdvancedOptions={setShowAdvancedOptions}
              />
            )}
            {activeStep === 2 && (
              <ProposalStep 
                painPoint={painPoint}
                currency={currency}
                currentSpend={currentSpend}
                efficiencyGain={efficiencyGain}
                implementationDate={implementationDate}
                setImplementationDate={setImplementationDate}
                region={region}
                implementationCost={implementationCost}
                setImplementationCost={setImplementationCost}
                ongoingMonthlyCost={ongoingMonthlyCost}
                setOngoingMonthlyCost={setOngoingMonthlyCost}
                showAdvancedAnalysis={showAdvancedOptions}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={goToPreviousStep}
            disabled={activeStep === 0}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button 
            onClick={goToNextStep}
            disabled={isNextDisabled()}
            className={`flex items-center ${activeStep < steps.length - 1 ? 'bg-brand-700 hover:bg-brand-800' : 'hidden'}`}
          >
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SavingsCalculator;

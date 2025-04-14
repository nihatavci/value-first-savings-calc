
import React from "react";
import { PAIN_POINTS } from "@/utils/calculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PainPointStepProps {
  painPoint: string;
  setPainPoint: (value: string) => void;
}

const PainPointStep: React.FC<PainPointStepProps> = ({ painPoint, setPainPoint }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-brand-800 mb-3">
          What's your top operational challenge?
        </h2>
        <p className="text-gray-600">
          Select the area where your business faces the most significant inefficiencies
        </p>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Select value={painPoint} onValueChange={setPainPoint}>
          <SelectTrigger className="w-full h-12 text-left">
            <SelectValue placeholder="Select a pain point" />
          </SelectTrigger>
          <SelectContent>
            {PAIN_POINTS.map((point) => (
              <SelectItem key={point.value} value={point.value}>
                {point.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {painPoint && (
        <Card className="mt-8 bg-brand-50 border-brand-200 animate-in fade-in duration-300">
          <CardContent className="pt-6">
            <h3 className="text-xl font-medium mb-2 text-brand-700">
              {PAIN_POINTS.find(p => p.value === painPoint)?.label}
            </h3>
            <p className="text-gray-600">
              {getPainPointDescription(painPoint)}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper function to get pain point descriptions
const getPainPointDescription = (painPoint: string): string => {
  const descriptions: Record<string, string> = {
    "manual-processes": "Businesses spend 30-50% more time on manual data processing compared to automated solutions. We can help you eliminate these redundancies.",
    "error-rate": "High error rates not only cost direct financial losses but also impact customer satisfaction and team morale. Our solutions typically reduce errors by 50-70%.",
    "service-levels": "Meeting and exceeding service level agreements is critical for client retention. We can help improve your success rates significantly.",
    "staff-costs": "Excessive staffing costs often indicate process inefficiencies. We help optimize workflows to reduce the need for additional headcount.",
    "operational-inefficiency": "Operational bottlenecks create cascading problems across your organization. Our approach targets these critical constraints.",
    "low-productivity": "Teams often operate at 40-60% of their potential capacity due to process and technology limitations. We can help unlock their full potential.",
    "slow-response": "In today's business environment, speed creates competitive advantage. We help accelerate your response times to market changes and customer needs.",
    "outdated-systems": "Legacy systems drain resources and limit capabilities. Our modernization approach preserves what works while eliminating constraints.",
  };
  
  return descriptions[painPoint] || "We can help optimize this area of your business operations to reduce costs and improve outcomes.";
};

export default PainPointStep;

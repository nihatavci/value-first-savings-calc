
import SavingsCalculator from "@/components/SavingsCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-brand-50">
      <header className="container mx-auto py-8 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-800 mb-4">
            Value-First Savings Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Pay nothing until we prove our value
          </p>
          <p className="text-gray-500">
            See how our risk-reversal pricing model delivers immediate ROI
          </p>
        </div>
      </header>
      
      <main>
        <SavingsCalculator />
        
        <section className="container mx-auto py-12 px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-lg bg-white shadow-sm border border-brand-100">
              <div className="text-4xl font-bold text-brand-700 mb-2">50%</div>
              <h3 className="text-lg font-medium mb-2">Setup Fee</h3>
              <p className="text-gray-600 text-sm">
                One-time fee based on your first month's projected savings
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-sm border border-brand-100">
              <div className="text-4xl font-bold text-brand-700 mb-2">10%</div>
              <h3 className="text-lg font-medium mb-2">Monthly Retainer</h3>
              <p className="text-gray-600 text-sm">
                Ongoing fee calculated as a percentage of your actual monthly savings
              </p>
            </div>
            
            <div className="p-6 rounded-lg bg-white shadow-sm border border-brand-100">
              <div className="text-4xl font-bold text-brand-700 mb-2">0%</div>
              <h3 className="text-lg font-medium mb-2">Risk</h3>
              <p className="text-gray-600 text-sm">
                If we don't deliver savings, you don't pay ongoing fees
              </p>
            </div>
          </div>
        </section>
        
        <section className="bg-brand-700 text-white py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">Instant ROI Without the Risk</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Our calculator shows exactly what you'll pay and what you'll save before you commit.
            </p>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 text-left max-w-3xl mx-auto">
              <div className="flex">
                <div className="bg-brand-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">
                  <span>1</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Identify Inefficiencies</h3>
                  <p className="opacity-80">Pinpoint where your business is losing time and money</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-brand-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">
                  <span>2</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Quantify Costs</h3>
                  <p className="opacity-80">See the real financial impact of operational challenges</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-brand-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">
                  <span>3</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Calculate Savings</h3>
                  <p className="opacity-80">Visualize potential monthly and annual cost reductions</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="bg-brand-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">
                  <span>4</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-1">Value-Based Pricing</h3>
                  <p className="opacity-80">Only pay based on the actual value we deliver to your business</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="container mx-auto py-10 px-4 text-center text-gray-500 text-sm">
        <p>All calculations are performed client-side only. No data is stored or transmitted.</p>
        <p className="mt-2">© 2025 Value-First Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;

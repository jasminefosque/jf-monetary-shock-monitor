import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { KPIStrip } from '@/components/layout/KPIStrip';
import { PolicyRateChart } from '@/components/charts/PolicyRateChart';
import { YieldCurveChart } from '@/components/charts/YieldCurveChart';
import { CurveSlopeChart } from '@/components/charts/CurveSlopeChart';
import { InflationPolicyChart } from '@/components/charts/InflationPolicyChart';
import { BalanceSheetChart } from '@/components/charts/BalanceSheetChart';
import { LiquidityStressChart } from '@/components/charts/LiquidityStressChart';
import { CreditSpreadsChart } from '@/components/charts/CreditSpreadsChart';
import { FundingStressChart } from '@/components/charts/FundingStressChart';
import { VolatilityChart } from '@/components/charts/VolatilityChart';
import { RiskOffChart } from '@/components/charts/RiskOffChart';
import { EventDetailModal } from '@/components/EventDetailModal';
import { MethodologyDrawer } from '@/components/MethodologyDrawer';
import { useAppStore } from '@/app/store';
import { downloadJSON } from '@/lib/utils';
import { getDataProvider } from '@/data/dataProviderFactory';
import { SyntheticDataProvider } from '@/data/synthetic/SyntheticDataProvider';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const { toggleMethodology } = useAppStore();

  const handleSectionChange = (section: string) => {
    if (section === 'methodology') {
      toggleMethodology();
    } else {
      setActiveSection(section);
    }
  };

  const handleExportData = () => {
    const provider = getDataProvider();
    if (provider instanceof SyntheticDataProvider) {
      const data = provider.exportData();
      downloadJSON(data, `monetary-shock-data-${new Date().toISOString().split('T')[0]}.json`);
    } else {
      alert('Data export is only available in synthetic mode.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <div className="flex-1">
        <TopBar />

        <main className="p-6">
          {/* Overview Section */}
          {activeSection === 'overview' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  <p className="text-sm text-gray-500 mt-1">Comprehensive monetary shock monitoring and policy regime tracking</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Export Dataset (JSON)
                </button>
              </div>

              <KPIStrip />

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <PolicyRateChart />
                </div>

                <div className="col-span-6">
                  <YieldCurveChart />
                </div>
                <div className="col-span-6">
                  <CurveSlopeChart />
                </div>

                <div className="col-span-6">
                  <InflationPolicyChart />
                </div>
                <div className="col-span-6">
                  <RiskOffChart />
                </div>
              </div>
            </div>
          )}

          {/* Policy Regime Section */}
          {activeSection === 'policy' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Policy Regime</h2>
              <KPIStrip />
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <PolicyRateChart />
                </div>
                <div className="col-span-12">
                  <InflationPolicyChart />
                </div>
              </div>
            </div>
          )}

          {/* Rates and Curve Section */}
          {activeSection === 'rates' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Rates and Yield Curve</h2>
              <KPIStrip />
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <YieldCurveChart />
                </div>
                <div className="col-span-6">
                  <CurveSlopeChart />
                </div>
              </div>
            </div>
          )}

          {/* Liquidity Section */}
          {activeSection === 'liquidity' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Liquidity Conditions</h2>
              <KPIStrip />
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <BalanceSheetChart />
                </div>
                <div className="col-span-6">
                  <LiquidityStressChart />
                </div>
                <div className="col-span-6">
                  <FundingStressChart />
                </div>
              </div>
            </div>
          )}

          {/* Credit Stress Section */}
          {activeSection === 'credit' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Credit Market Stress</h2>
              <KPIStrip />
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <CreditSpreadsChart />
                </div>
                <div className="col-span-6">
                  <FundingStressChart />
                </div>
              </div>
            </div>
          )}

          {/* Volatility Transmission Section */}
          {activeSection === 'volatility' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Volatility Transmission</h2>
              <KPIStrip />
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-6">
                  <VolatilityChart />
                </div>
                <div className="col-span-6">
                  <RiskOffChart />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <EventDetailModal />
      <MethodologyDrawer />
    </div>
  );
}

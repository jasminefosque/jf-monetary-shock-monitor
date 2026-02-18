
import { useAppStore } from '@/app/store';

export function MethodologyDrawer() {
  const { showMethodology, toggleMethodology } = useAppStore();

  if (!showMethodology) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-2xl shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Methodology</h2>
          <button
            onClick={toggleMethodology}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              The Monetary Shock Monitor is a portfolio demonstration project showcasing dashboard architecture,
              data modeling, and visualization systems for tracking monetary policy shocks and their transmission
              through financial markets.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Provider Abstraction</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              The application uses a clean data provider interface that abstracts data sources from the UI layer.
              This architecture allows seamless swapping between synthetic and real data sources.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="text-xs font-mono text-gray-800 overflow-x-auto">
{`interface DataProvider {
  getSeries(metricId, params): TimeSeries
  getLatest(metricId, params): number
  getMetadata(metricId): MetricMetadata
  getShockEvents(params): ShockEvent[]
}`}
              </pre>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Synthetic Data Generation</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Synthetic data is generated using realistic monetary regime characteristics:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Level shifts in policy rates with regime transitions</li>
              <li>Persistence and mean reversion in time series</li>
              <li>Lagged inflation response to policy changes</li>
              <li>Yield curve inversion periods during tightening cycles</li>
              <li>Stress spikes in credit spreads and volatility</li>
              <li>Liquidity contractions and expansions tied to policy stance</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              The generator uses seeded random number generation to ensure reproducible datasets across sessions.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Shock Event System</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Named shock events are programmatically inserted into the timeline with metadata including:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Event identifier and human-readable label</li>
              <li>Start and end dates (if applicable)</li>
              <li>Severity rating (1-5 scale)</li>
              <li>Descriptive context</li>
            </ul>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              Events are overlaid on relevant charts and clickable to display detailed information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Swapping to Open Data Sources</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              To integrate real open data sources:
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Implement the <code className="bg-gray-100 px-1 rounded">OpenDataProvider</code> class in <code className="bg-gray-100 px-1 rounded">src/data/adapters/</code></li>
              <li>Add API client integration (e.g., FRED, ECB Data Portal)</li>
              <li>Map external data schemas to the internal <code className="bg-gray-100 px-1 rounded">TimeSeries</code> schema</li>
              <li>Set <code className="bg-gray-100 px-1 rounded">VITE_DATA_MODE=open</code> in your <code className="bg-gray-100 px-1 rounded">.env</code> file</li>
              <li>Add API keys as environment variables (never commit them)</li>
            </ol>
            <p className="text-sm text-gray-700 leading-relaxed mt-3">
              The UI code remains unchanged - all charts and components consume data through the provider interface.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Schema Validation</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              All data structures are validated using Zod schemas to ensure type safety and data integrity:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Time series observations validated for date format and numeric values</li>
              <li>Shock events validated for required fields and severity range</li>
              <li>Metadata validated for completeness and type correctness</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Chart Components</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              All charts follow a standardized architecture with:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>Consistent container with title, unit labels, and descriptions</li>
              <li>Export functionality (PNG export placeholder)</li>
              <li>Interactive tooltips with formatted values</li>
              <li>Event overlays (where applicable)</li>
              <li>Loading and error states</li>
              <li>Responsive design</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Security Practices</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              This portfolio project follows security best practices:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              <li>No API keys or secrets committed to source control</li>
              <li>Environment variables used for configuration</li>
              <li>No production endpoints or proprietary data</li>
              <li>No database credentials or connection strings</li>
              <li>.gitignore configured to exclude sensitive files</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

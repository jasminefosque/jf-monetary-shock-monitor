
import { useAppStore } from '@/app/store';

export function TopBar() {
  const { startDate, endDate, setDateRange, geography, setGeography, showEvents, toggleEvents } = useAppStore();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setDateRange(e.target.value, endDate)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setDateRange(startDate, e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Geography</label>
            <select
              value={geography}
              onChange={(e) => setGeography(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded text-sm"
            >
              <option value="United States">United States</option>
              <option value="Eurozone">Eurozone</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showEvents}
              onChange={toggleEvents}
              className="rounded border-gray-300"
            />
            <span className="text-gray-700">Show Event Overlays</span>
          </label>

          <div className="text-xs text-gray-500">
            Mode: <span className="font-medium">Synthetic Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useAppStore } from '@/app/store';
import { formatDate } from '@/lib/utils';

export function EventDetailModal() {
  const { selectedEvent, setSelectedEvent } = useAppStore();

  if (!selectedEvent) return null;

  const severityColors = {
    1: 'bg-blue-100 text-blue-800',
    2: 'bg-green-100 text-green-800',
    3: 'bg-yellow-100 text-yellow-800',
    4: 'bg-orange-100 text-orange-800',
    5: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{selectedEvent.label}</h2>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Event ID</div>
              <div className="text-sm text-gray-900 font-mono">{selectedEvent.event_id}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date Range</div>
              <div className="text-sm text-gray-900">
                {formatDate(selectedEvent.start_date)}
                {selectedEvent.end_date && ` - ${formatDate(selectedEvent.end_date)}`}
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Severity</div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${severityColors[selectedEvent.severity]}`}>
                Level {selectedEvent.severity} / 5
              </span>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Description</div>
              <p className="text-sm text-gray-700 leading-relaxed">{selectedEvent.description}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

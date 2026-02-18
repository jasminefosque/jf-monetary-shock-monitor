import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'policy', label: 'Policy Regime' },
  { id: 'rates', label: 'Rates and Curve' },
  { id: 'liquidity', label: 'Liquidity' },
  { id: 'credit', label: 'Credit Stress' },
  { id: 'volatility', label: 'Volatility Transmission' },
  { id: 'methodology', label: 'Methodology' },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-gray-900">Monetary Shock Monitor</h1>
        <p className="text-xs text-gray-500 mt-1">Portfolio Dashboard</p>
      </div>
      
      <nav className="px-3 pb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors',
              activeSection === section.id
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

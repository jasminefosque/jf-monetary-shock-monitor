import { type ClassValue, clsx } from 'clsx';

/**
 * Utility for merging Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format number for display
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format basis points
 */
export function formatBps(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)} bps`;
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Download data as JSON file
 */
export function downloadJSON(data: string, filename: string) {
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export chart as PNG
 */
export function exportChartAsPNG(chartElement: HTMLElement, filename: string) {
  // Note: This requires html2canvas library for production use
  // For now, this is a placeholder showing the pattern
  console.log(`Export chart "${filename}" - implementation requires html2canvas`);
  alert('Chart export feature requires html2canvas library. This is a demo placeholder.');
}

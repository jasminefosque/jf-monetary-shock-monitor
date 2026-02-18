import type { DataProvider } from './DataProvider';
import { SyntheticDataProvider } from './synthetic/SyntheticDataProvider';
import { OpenDataProvider } from './adapters/OpenDataProvider';

/**
 * Factory function to create the appropriate data provider
 * based on environment configuration
 */
export function createDataProvider(): DataProvider {
  const dataMode = import.meta.env.VITE_DATA_MODE || 'synthetic';

  switch (dataMode) {
    case 'synthetic':
      return new SyntheticDataProvider();
    case 'open':
      return new OpenDataProvider();
    default:
      console.warn(`Unknown data mode: ${dataMode}. Falling back to synthetic.`);
      return new SyntheticDataProvider();
  }
}

// Singleton instance
let providerInstance: DataProvider | null = null;

/**
 * Get the singleton data provider instance
 */
export function getDataProvider(): DataProvider {
  if (!providerInstance) {
    providerInstance = createDataProvider();
  }
  return providerInstance;
}

# Architecture

System design and technical architecture for the Monetary Shock Monitor.

## Overview

The Monetary Shock Monitor follows a clean layered architecture that separates concerns and enables flexible data sourcing. The key principle is **UI components never directly access data sources** - all data flows through a provider interface.

## Architecture Layers

### 1. UI Component Layer

**Location**: `src/components/`, `src/pages/`

**Responsibilities**:
- Render visualizations and layout
- Handle user interactions
- Consume data via hooks
- Display loading and error states

**Key Characteristics**:
- No data fetching logic
- No knowledge of data sources
- Fully reusable with any data provider
- Type-safe with TypeScript

### 2. Data Access Layer

**Location**: `src/hooks/`

**Components**:
- `useTimeSeries(metricId, params)` - Fetch time series data
- `useLatestValue(metricId, params)` - Fetch latest value only
- `useShockEvents(params)` - Fetch shock events

**Responsibilities**:
- Abstract data fetching into React hooks
- Manage loading and error states
- Handle data caching (via React state)
- Provide consistent interface to UI components

### 3. Data Provider Interface

**Location**: `src/data/DataProvider.ts`

**Contract**:
```typescript
interface DataProvider {
  getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries>;
  getLatest(metricId: string, params?: QueryParams): Promise<number | null>;
  getMetadata(metricId: string): Promise<MetricMetadata>;
  getShockEvents(params?: QueryParams): Promise<ShockEvent[]>;
}
```

**Purpose**:
- Define contract for data access
- Enable swapping implementations
- Enforce consistent data shapes

### 4. Data Provider Implementations

**Synthetic Provider** (`src/data/synthetic/SyntheticDataProvider.ts`):
- Generates data on the fly
- Uses seeded random number generator
- Produces realistic monetary regime behavior
- Fully self-contained, no external dependencies

**Open Data Provider** (`src/data/adapters/OpenDataProvider.ts`):
- Stub implementation for real data sources
- Template for API integration (e.g., FRED, ECB)
- Maps external schemas to internal types
- Handles authentication and rate limiting

### 5. Domain Logic Layer

**Location**: `src/domains/monetaryShock/`

**Components**:
- Metric definitions
- Business rules
- Domain-specific calculations

**Responsibilities**:
- Define metric metadata
- Document expected ranges
- Provide domain context

### 6. Schema Validation Layer

**Location**: `src/models/schema.ts`

**Purpose**:
- Runtime type validation with Zod
- Ensure data integrity
- Provide type inference for TypeScript

**Key Schemas**:
- `TimeSeriesSchema` - Validates time series data
- `ObservationSchema` - Validates individual data points
- `ShockEventSchema` - Validates shock events
- `MetricMetadataSchema` - Validates metric definitions

## Data Flow

```
User Interaction
      ↓
UI Component
      ↓
React Hook (useTimeSeries)
      ↓
Data Provider Interface
      ↓
Concrete Provider (Synthetic/Open)
      ↓
Data Generation or API Call
      ↓
Schema Validation (Zod)
      ↓
Return to Component
      ↓
Render Visualization
```

## Synthetic Data Generation

### Generator Functions

**Location**: `src/data/synthetic/generator.ts`

**Key Functions**:
- `generateDates()` - Create date array
- `generatePolicyRate()` - Generate policy rate with regime shifts
- `generateYields()` - Generate yield curve data
- `generateInflation()` - Generate inflation with lags
- `generateMoneyGrowth()` - Generate money supply growth
- `generateCreditSpreads()` - Generate credit spreads with stress events
- `generateVolatility()` - Generate volatility with spikes
- `generateShockEvents()` - Create named shock events

### Realistic Behavior

The generator produces realistic monetary data through:

1. **Level Shifts**: Policy rates transition between regimes
2. **Persistence**: Auto-regressive process for smooth evolution
3. **Mean Reversion**: Metrics return toward equilibrium
4. **Lagged Responses**: Inflation responds to policy with delay
5. **Coordinated Stress**: Events trigger responses across metrics
6. **Bounded Ranges**: Values stay within historical norms

### Seeded Randomness

Uses deterministic random number generation:
- Same seed = same data every time
- Different seeds = different scenarios
- Reproducible for testing and demos

## Shock Event System

### Event Structure

```typescript
{
  event_id: string;        // Unique identifier
  label: string;           // Human-readable name
  start_date: string;      // ISO date
  end_date?: string;       // Optional end date
  severity: 1 | 2 | 3 | 4 | 5;  // 1=minor, 5=severe
  description: string;     // Context and explanation
}
```

### Event Generation

Events are programmatically inserted at specific points in the timeline:
- Inflation surge (early period)
- Rapid tightening cycle (extended period)
- Banking stress (acute period)
- Liquidity crunch (acute period)
- Recession signal (transition period)
- Policy pivot (turning point)

### Event Integration

Events are overlaid on charts as:
- Reference lines on time series
- Clickable markers
- Shaded regions for periods
- Annotations with severity colors

## Chart Component Standards

All chart components follow a consistent pattern:

### Structure
```typescript
function MetricChart() {
  // 1. Get global state (date range, filters)
  const { startDate, endDate } = useAppStore();
  
  // 2. Fetch data via hooks
  const { data, loading, error } = useTimeSeries(metricId, params);
  
  // 3. Handle loading state
  if (loading) return <LoadingState />;
  
  // 4. Transform data for chart library
  const chartData = transformData(data);
  
  // 5. Render with ChartContainer wrapper
  return (
    <ChartContainer title="..." unit="...">
      <ResponsiveContainer>
        {/* Recharts components */}
      </ResponsiveContainer>
    </ChartContainer>
  );
}
```

### Standard Features
- Title and unit labels
- Description tooltip
- Export button
- Source attribution
- Responsive sizing
- Interactive tooltips
- Loading states
- Error boundaries

## State Management

**Location**: `src/app/store.ts`

**Technology**: Zustand (lightweight, no boilerplate)

**Global State**:
- Date range (start, end)
- Geography filter
- Event overlay toggle
- Selected event (for modal)
- Methodology drawer visibility

**Why Zustand**:
- Minimal boilerplate
- No providers needed
- Direct store access
- TypeScript friendly
- Small bundle size

## Export Functionality

### Chart Export
- Placeholder implementation
- Production would use html2canvas
- Exports current view as PNG

### Data Export
- JSON format
- Includes metadata
- All metrics in view
- Timestamped filename

## Extending the Architecture

### Adding a New Metric

1. **Add generator function** in `generator.ts`
2. **Include in `generateAllMetrics()`**
3. **Add definition** in `metricDefinitions.ts`
4. **Create chart component** in `components/charts/`
5. **Add to dashboard** in `pages/Dashboard.tsx`

### Adding a New Data Source

1. **Create provider class** implementing `DataProvider`
2. **Add to factory** in `dataProviderFactory.ts`
3. **Update environment variables**
4. **Test with UI components** (no changes needed)

### Adding Real-time Updates

1. **Implement WebSocket/SSE** in data provider
2. **Update hooks** to handle streaming
3. **Add invalidation logic** for caching
4. **UI updates automatically** via React state

## Performance Considerations

- **Memoization**: Chart data transformations memoized
- **Lazy Loading**: Components loaded on demand
- **Data Filtering**: Server-side filtering in params
- **Caching**: React hooks cache fetched data
- **Code Splitting**: Vite automatic code splitting

## Security Architecture

### Environment Variables
- Prefix with `VITE_` for client exposure
- Never commit `.env` file
- Use `.env.example` for documentation

### API Keys
- Stored in environment variables only
- Never in source code
- Excluded by `.gitignore`

### Data Validation
- All external data validated with Zod
- Type checking at runtime
- Prevents malformed data crashes

## Testing Strategy

### Unit Tests
- Synthetic generator functions
- Schema validation
- Utility functions
- Domain logic

### Integration Tests
- Data provider implementations
- Hook behavior
- Component rendering

### E2E Tests
- Full user flows (future)
- Cross-browser testing (future)

## Build and Deployment

### Development
```bash
npm run dev  # Vite dev server with HMR
```

### Production Build
```bash
npm run build  # TypeScript check + Vite build
```

### Output
- `dist/` folder
- Optimized bundles
- Static assets
- Ready for CDN or static hosting

## Future Enhancements

1. **Real-time streaming** via WebSocket
2. **Advanced filtering** (multi-select, ranges)
3. **Chart comparison** mode
4. **Mobile responsive** improvements
5. **Keyboard navigation** accessibility
6. **Dark mode** theme
7. **PDF report** generation
8. **Alert system** for threshold breaches

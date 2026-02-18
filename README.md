# Monetary Shock Monitor

![Dashboard Screenshot](https://github.com/user-attachments/assets/cba54ddb-aa16-4060-a66d-a31616be971e)

## Overview

The **Monetary Shock Monitor** is a production-quality portfolio dashboard that demonstrates real-time monetary stress and policy reaction monitoring. This project showcases dashboard architecture, data modeling, and visualization systems for tracking monetary policy shocks and their transmission through financial markets.

> **Important**: This repository demonstrates dashboard architecture, modeling logic, and visualization systems. Production data pipelines and proprietary datasets are not included.

## Features

- **Real-time Monitoring**: Track 16+ monetary and financial metrics
- **Shock Event System**: Named shock events with severity ratings and overlays
- **Interactive Visualizations**: 10 professional charts with Recharts
- **Clean Architecture**: Abstracted data layer supporting multiple data sources
- **Type Safety**: Full TypeScript with Zod schema validation
- **Synthetic Data**: Realistic generated data matching production schemas
- **Portfolio Ready**: Runs out of the box without API keys or databases

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **State Management**: Zustand
- **Validation**: Zod
- **Testing**: Vitest

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

The app will be available at `http://localhost:5173`

## Architecture

The application follows a clean layered architecture:

```
┌─────────────────────────────────────────────────┐
│              UI Components Layer                │
│  (Charts, Layouts, Pages - No data logic)      │
└─────────────────────┬───────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────┐
│           DataProvider Interface                │
│  (Abstract contract for data access)           │
└─────┬──────────────────────────┬────────────────┘
      │                          │
┌─────▼──────────────┐  ┌────────▼─────────────┐
│ SyntheticProvider  │  │  OpenDataProvider    │
│   (Complete)       │  │  (Stub/Placeholder)  │
└────────────────────┘  └──────────────────────┘
```

### Key Concepts

- **Data Provider Abstraction**: UI components consume data through a clean interface, allowing seamless swapping between synthetic and real sources
- **Schema Validation**: All data structures validated with Zod for type safety
- **Shock Event System**: Programmatic event insertion with metadata for annotations
- **Reusable Components**: Standardized chart containers with consistent UX

## Data Modes

### Synthetic Mode (Default)

```bash
VITE_DATA_MODE=synthetic
```

Generates realistic time series data with monetary regime characteristics:
- Policy rate regime shifts
- Yield curve inversions
- Credit spread widening during stress
- Liquidity contractions and expansions
- Volatility spikes

### Open Mode (Placeholder)

```bash
VITE_DATA_MODE=open
VITE_FRED_API_KEY=your_key_here
```

Stub implementation demonstrating how to integrate with open data sources like FRED API. See `src/data/adapters/OpenDataProvider.ts` for integration pattern.

## Folder Structure

```
jf-monetary-shock-monitor/
├── src/
│   ├── app/                 # Application state (Zustand store)
│   ├── components/          # React components
│   │   ├── charts/          # Chart components
│   │   └── layout/          # Layout components
│   ├── data/                # Data layer
│   │   ├── adapters/        # Data provider implementations
│   │   └── synthetic/       # Synthetic data generator
│   ├── domains/             # Domain logic
│   │   └── monetaryShock/   # Monetary shock domain
│   ├── hooks/               # React hooks
│   ├── lib/                 # Utility functions
│   ├── models/              # Type definitions and schemas
│   ├── pages/               # Page components
│   └── styles/              # Global styles
├── data/                    # Data files (if any)
├── docs/                    # Documentation
├── public/                  # Static assets
└── tests/                   # Test files
```

## Dashboard Sections

1. **Overview**: High-level KPIs and key charts
2. **Policy Regime**: Policy rates, inflation, and real rates
3. **Rates and Curve**: Yield curve and slope analysis
4. **Liquidity**: Balance sheet, money growth, and liquidity stress
5. **Credit Stress**: Corporate spreads and funding stress
6. **Volatility Transmission**: Market volatility and risk sentiment
7. **Methodology**: Architecture and data source documentation

## Metrics

The dashboard monitors 16 core metrics across monetary policy, rates, liquidity, credit, and volatility domains. See [docs/METRICS.md](./docs/METRICS.md) for complete definitions.

## Customization

### Changing Time Period

Edit `src/data/synthetic/SyntheticDataProvider.ts`:

```typescript
constructor(startDate: string = '2020-01-01', endDate: string = '2024-12-31')
```

### Adding New Metrics

1. Add generator function in `src/data/synthetic/generator.ts`
2. Add metric definition in `src/domains/monetaryShock/metricDefinitions.ts`
3. Create chart component in `src/components/charts/`
4. Add to dashboard layout in `src/pages/Dashboard.tsx`

### Styling

- Primary colors: `tailwind.config.js`
- Global styles: `src/styles/globals.css`
- Component styles: Inline Tailwind classes

### Adding Real Data

Implement the `OpenDataProvider` in `src/data/adapters/OpenDataProvider.ts`:

1. Choose data source (e.g., FRED, ECB, Yahoo Finance)
2. Add API client integration
3. Map external schemas to internal `TimeSeries` type
4. Handle caching and rate limits
5. Update `.env` with `VITE_DATA_MODE=open`

## Security

- ✅ No API keys committed
- ✅ No production endpoints
- ✅ No database credentials
- ✅ Environment variables for configuration
- ✅ .gitignore excludes sensitive files

See [docs/SECURITY.md](./docs/SECURITY.md) for detailed security practices.

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage
npm test -- --coverage
```

Tests cover:
- Synthetic data generation
- Schema validation
- Event insertion logic

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Author

Jasmine Fosque

## Documentation

- [METRICS.md](./docs/METRICS.md) - Complete metric definitions
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design and patterns
- [SECURITY.md](./docs/SECURITY.md) - Security practices and guidelines

## Screenshots

![Dashboard Overview](https://github.com/user-attachments/assets/cba54ddb-aa16-4060-a66d-a31616be971e)

The dashboard features:
- Real-time KPI monitoring strip
- Interactive time series charts with event overlays
- Yield curve analysis with inversion detection
- Risk sentiment gauges
- Professional, institutional design

## Acknowledgments

This is a portfolio demonstration project. The synthetic data generator produces realistic monetary regime behavior but does not use real market data in default mode.

---

## Final Instructions

### How to Rename the Repository

If you want to use a different repository name:

1. **On GitHub**: Go to repository Settings → General → Repository name
2. **Update local remote**:
   ```bash
   git remote set-url origin https://github.com/yourusername/new-repo-name.git
   ```
3. **Update package.json** with new repository URL
4. **Update README** references to repository name

### How to Customize Typography and Spacing

**Typography**:
- System font stack is defined in `src/styles/globals.css`
- To use custom fonts, add them via Google Fonts or local files
- Update the font-family in the CSS

**Spacing and Layout**:
- Tailwind utility classes control all spacing
- Common patterns:
  - `p-6` = padding 1.5rem
  - `mb-4` = margin-bottom 1rem
  - `gap-4` = gap 1rem
- Adjust grid columns in charts: `col-span-6` for half-width
- Change container max-widths in layout components

**Colors**:
- Primary colors defined in `tailwind.config.js`
- Update the `extend.colors` section for custom palette
- All charts use Tailwind color classes (e.g., `bg-sky-500`)

### How to Add a Real Open Data Adapter

**Step 1: Choose Your Data Source**

Free options without API keys:
- Public CSV/JSON endpoints
- Government open data portals
- Academic research datasets

Options requiring free API keys:
- FRED (Federal Reserve Economic Data)
- ECB Statistical Data Warehouse
- World Bank Data API
- Yahoo Finance (via libraries)

**Step 2: Implement the Provider**

Edit `src/data/adapters/OpenDataProvider.ts`:

```typescript
export class OpenDataProvider implements DataProvider {
  private apiKey?: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_YOUR_API_KEY;
  }

  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    // Map metricId to external series ID
    const externalId = this.mapMetricId(metricId);
    
    // Fetch from API
    const response = await fetch(
      `https://api.example.com/series/${externalId}?api_key=${this.apiKey}`
    );
    const data = await response.json();
    
    // Transform to TimeSeries schema
    return this.transformToTimeSeries(data, metricId);
  }

  // Implement other methods...
}
```

**Step 3: Add Environment Variables**

Update `.env`:
```bash
VITE_DATA_MODE=open
VITE_YOUR_API_KEY=your_actual_key_here
```

Update `.env.example`:
```bash
VITE_DATA_MODE=open
VITE_YOUR_API_KEY=get_from_https://example.com
```

**Step 4: Add Error Handling**

```typescript
async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
  try {
    // API call
  } catch (error) {
    console.error(`Failed to fetch ${metricId}:`, error);
    // Optionally fallback to synthetic data
    return new SyntheticDataProvider().getSeries(metricId, params);
  }
}
```

**Step 5: Add Rate Limiting**

```typescript
private rateLimit = {
  calls: 0,
  resetTime: Date.now() + 60000,
};

private async checkRateLimit() {
  if (Date.now() > this.rateLimit.resetTime) {
    this.rateLimit.calls = 0;
    this.rateLimit.resetTime = Date.now() + 60000;
  }
  
  if (this.rateLimit.calls >= 60) {
    throw new Error('Rate limit exceeded');
  }
  
  this.rateLimit.calls++;
}
```

**Step 6: Add Caching**

```typescript
private cache = new Map<string, { data: TimeSeries; timestamp: number }>();

async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
  const cacheKey = `${metricId}-${JSON.stringify(params)}`;
  const cached = this.cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 min cache
    return cached.data;
  }
  
  const data = await this.fetchFromAPI(metricId, params);
  this.cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}
```

**Step 7: Test**

```bash
# Switch to open mode
echo "VITE_DATA_MODE=open" > .env

# Start app
npm run dev

# Check console for errors
# Verify charts load with real data
```

### Troubleshooting

**Build fails with Tailwind errors**:
- Ensure `@tailwindcss/postcss` is installed
- Check `postcss.config.js` uses correct plugin

**Charts not rendering**:
- Check browser console for errors
- Verify data is being fetched (Network tab)
- Check Zod validation errors

**Tests failing**:
- Run `npm test` to see specific failures
- Update snapshots if schema changed: `npm test -- -u`

**Environment variables not working**:
- Ensure variables are prefixed with `VITE_`
- Restart dev server after changing `.env`
- Check `import.meta.env.VITE_*` syntax

### Support

For questions or issues:
1. Check documentation in `/docs`
2. Review code comments
3. Open an issue on GitHub

---

**Built with ❤️ as a portfolio demonstration project**

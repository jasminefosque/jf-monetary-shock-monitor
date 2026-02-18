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

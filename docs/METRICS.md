# Metric Definitions

Complete reference for all metrics in the Monetary Shock Monitor dashboard.

## Policy and Regime Metrics

### Policy Rate Target
- **ID**: `policy_rate_target`
- **Unit**: Percent
- **Description**: Central bank target policy interest rate (Federal Funds Rate equivalent)
- **Expected Range**: 0% to 6%
- **Frequency**: Daily
- **Usage**: Primary indicator of monetary policy stance

### Policy Rate Change (3M)
- **ID**: `policy_rate_change_3m`
- **Unit**: Basis Points
- **Description**: Change in policy rate over the past 3 months
- **Expected Range**: -300 to +300 bps
- **Frequency**: Daily
- **Usage**: Measure of policy adjustment pace and direction

## Rates and Yield Curve Metrics

### 2-Year Treasury Yield
- **ID**: `yield_2y`
- **Unit**: Percent
- **Description**: 2-year government bond yield
- **Expected Range**: 0% to 6%
- **Frequency**: Daily
- **Usage**: Short-term interest rate expectations and near-term economic outlook

### 10-Year Treasury Yield
- **ID**: `yield_10y`
- **Unit**: Percent
- **Description**: 10-year government bond yield
- **Expected Range**: 0% to 6%
- **Frequency**: Daily
- **Usage**: Long-term interest rate expectations and growth outlook

### Yield Curve Slope (10Y-2Y)
- **ID**: `curve_slope_10y_2y`
- **Unit**: Basis Points
- **Description**: Difference between 10-year and 2-year yields. Negative values indicate inversion.
- **Expected Range**: -100 to +200 bps
- **Frequency**: Daily
- **Usage**: Recession indicator; inversions historically precede economic downturns

### Yield Curve Inversion Flag
- **ID**: `curve_inversion_flag`
- **Unit**: Binary (0 or 1)
- **Description**: Binary indicator of yield curve inversion (1 = inverted, 0 = normal)
- **Expected Range**: 0 or 1
- **Frequency**: Daily
- **Usage**: Simple binary signal for curve inversion

## Inflation and Real Rates

### Inflation Year-over-Year
- **ID**: `inflation_yoy`
- **Unit**: Percent
- **Description**: Consumer price inflation rate over the past 12 months
- **Expected Range**: -1% to 8%
- **Frequency**: Daily (interpolated)
- **Usage**: Core inflation measure; central bank policy target reference

### Real Policy Rate
- **ID**: `real_policy_rate`
- **Unit**: Percent
- **Description**: Policy rate adjusted for inflation (nominal rate minus inflation)
- **Expected Range**: -5% to +5%
- **Frequency**: Daily
- **Usage**: True restrictiveness of monetary policy; negative values indicate accommodative real conditions

## Liquidity and Balance Sheet Metrics

### Money Supply Growth YoY
- **ID**: `money_growth_yoy`
- **Unit**: Percent
- **Description**: Year-over-year growth rate of broad money supply
- **Expected Range**: -5% to 20%
- **Frequency**: Daily
- **Usage**: Indicator of monetary conditions and liquidity availability

### Central Bank Balance Sheet Index
- **ID**: `central_bank_balance_sheet_index`
- **Unit**: Index (Baseline = 100)
- **Description**: Index of central bank total assets
- **Expected Range**: 80 to 200
- **Frequency**: Daily
- **Usage**: Measure of quantitative easing/tightening (QE/QT) activities

### Liquidity Stress Index
- **ID**: `liquidity_stress_index`
- **Unit**: Index (0-100)
- **Description**: Composite measure of market liquidity stress (0 = low stress, 100 = high stress)
- **Expected Range**: 0 to 100
- **Frequency**: Daily
- **Usage**: Early warning indicator for liquidity crises and market dysfunction

## Credit Stress Metrics

### Investment Grade Credit Spread
- **ID**: `ig_credit_spread`
- **Unit**: Basis Points
- **Description**: Spread of investment-grade corporate bonds over government bonds
- **Expected Range**: 50 to 300 bps
- **Frequency**: Daily
- **Usage**: Credit risk premium for high-quality corporate debt

### High Yield Credit Spread
- **ID**: `hy_credit_spread`
- **Unit**: Basis Points
- **Description**: Spread of high-yield (junk) corporate bonds over government bonds
- **Expected Range**: 200 to 1000 bps
- **Frequency**: Daily
- **Usage**: Credit risk premium for lower-quality corporate debt; stress indicator

### Funding Stress Proxy
- **ID**: `funding_stress_proxy`
- **Unit**: Basis Points
- **Description**: Indicator of short-term funding market stress
- **Expected Range**: 5 to 150 bps
- **Frequency**: Daily
- **Usage**: Early warning of banking sector funding difficulties

## Volatility and Risk Sentiment Metrics

### Volatility Index Proxy
- **ID**: `volatility_index_proxy`
- **Unit**: Index
- **Description**: Market volatility index (VIX-equivalent)
- **Expected Range**: 10 to 80
- **Frequency**: Daily
- **Usage**: Measure of market uncertainty and fear; "fear gauge"

### Risk-Off Composite Index
- **ID**: `risk_off_composite`
- **Unit**: Index (0-100)
- **Description**: Composite measure of risk aversion across markets (0 = risk-on, 100 = extreme risk-off)
- **Expected Range**: 0 to 100
- **Frequency**: Daily
- **Usage**: Aggregate measure of flight-to-safety behaviors

## Data Quality Notes

### Synthetic Mode
All metrics in synthetic mode are generated using realistic monetary regime characteristics:
- Regime shifts follow typical central bank policy cycles
- Correlations between metrics reflect real-world relationships
- Shock events create coordinated responses across metrics
- Values stay within historically observed ranges

### Expected Relationships
- Policy rate typically leads inflation with 6-12 month lag
- Curve inversions precede recessions by 6-18 months
- Credit spreads widen during economic stress
- Volatility spikes during uncertainty
- Risk-off periods show coordinated moves: curve steepening, spread widening, volatility spikes

## Usage in Charts

Each metric appears in one or more dashboard charts:
- **Policy Rate Timeline**: policy_rate_target
- **Yield Curve**: yield_2y, yield_10y
- **Curve Slope**: curve_slope_10y_2y, curve_inversion_flag
- **Inflation vs Policy**: policy_rate_target, inflation_yoy, real_policy_rate
- **Balance Sheet**: central_bank_balance_sheet_index, money_growth_yoy
- **Liquidity Stress**: liquidity_stress_index
- **Credit Spreads**: ig_credit_spread, hy_credit_spread
- **Funding Stress**: funding_stress_proxy
- **Volatility**: volatility_index_proxy
- **Risk-Off**: risk_off_composite

/**
 * Synthetic Data Generator for Monetary Shock Monitor
 * Generates realistic time series data with monetary regime characteristics
 */

import type { TimeSeries, ShockEvent, PolicyRegime } from '@/models/schema';

/**
 * Generate dates for time series
 */
export function generateDates(startDate: string, endDate: string, frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    
    switch (frequency) {
      case 'daily':
        current.setDate(current.getDate() + 1);
        break;
      case 'weekly':
        current.setDate(current.getDate() + 7);
        break;
      case 'monthly':
        current.setMonth(current.getMonth() + 1);
        break;
      case 'quarterly':
        current.setMonth(current.getMonth() + 3);
        break;
    }
  }

  return dates;
}

/**
 * Simple random number generator with seed
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextGaussian(): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

/**
 * Generate policy rate with regime shifts
 */
export function generatePolicyRate(dates: string[], seed: number = 42): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let level = 2.5; // Starting rate
  let trend = 0;

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    
    // Regime shifts at specific points
    if (i === Math.floor(dates.length * 0.15)) {
      trend = 0.002; // Start tightening
    } else if (i === Math.floor(dates.length * 0.35)) {
      trend = 0.003; // Accelerate tightening
    } else if (i === Math.floor(dates.length * 0.55)) {
      trend = 0; // Pause
    } else if (i === Math.floor(dates.length * 0.70)) {
      trend = -0.001; // Begin easing
    } else if (i === Math.floor(dates.length * 0.85)) {
      trend = -0.003; // Crisis easing
    }

    level += trend + rng.nextGaussian() * 0.05;
    level = Math.max(0, Math.min(6, level)); // Bound between 0-6%

    observations.push({ date, value: parseFloat(level.toFixed(4)) });
  }

  return {
    metric_id: 'policy_rate_target',
    label: 'Policy Rate Target',
    unit: 'percent',
    frequency: 'daily',
    observations,
    geography: 'United States',
  };
}

/**
 * Generate yield curve data (2Y and 10Y)
 */
export function generateYields(dates: string[], policyRate: TimeSeries, seed: number = 43): { yield2y: TimeSeries; yield10y: TimeSeries } {
  const rng = new SeededRandom(seed);
  const obs2y = [];
  const obs10y = [];

  for (let i = 0; i < dates.length; i++) {
    const policyValue = policyRate.observations[i].value;
    
    // 2Y follows policy rate closely with some term premium
    const yield2y = policyValue + 0.3 + rng.nextGaussian() * 0.15;
    
    // 10Y has larger term premium but can invert during tightening
    let termPremium = 1.2;
    if (i > dates.length * 0.35 && i < dates.length * 0.60) {
      termPremium = -0.3; // Inversion period
    }
    const yield10y = policyValue + termPremium + rng.nextGaussian() * 0.2;

    obs2y.push({ date: dates[i], value: parseFloat(Math.max(0, yield2y).toFixed(4)) });
    obs10y.push({ date: dates[i], value: parseFloat(Math.max(0, yield10y).toFixed(4)) });
  }

  return {
    yield2y: {
      metric_id: 'yield_2y',
      label: '2-Year Treasury Yield',
      unit: 'percent',
      frequency: 'daily',
      observations: obs2y,
      geography: 'United States',
    },
    yield10y: {
      metric_id: 'yield_10y',
      label: '10-Year Treasury Yield',
      unit: 'percent',
      frequency: 'daily',
      observations: obs10y,
      geography: 'United States',
    },
  };
}

/**
 * Generate inflation data
 */
export function generateInflation(dates: string[], policyRate: TimeSeries, seed: number = 44): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let inflation = 2.0;

  for (let i = 0; i < dates.length; i++) {
    // Inflation has inertia and responds to policy with lag
    const policyLag = i > 60 ? policyRate.observations[i - 60].value : policyRate.observations[0].value;
    const target = 2.0 + (i < dates.length * 0.3 ? 3.0 : 0) - policyLag * 0.3;
    
    inflation = inflation * 0.95 + target * 0.05 + rng.nextGaussian() * 0.1;
    inflation = Math.max(-1, Math.min(8, inflation));

    observations.push({ date: dates[i], value: parseFloat(inflation.toFixed(4)) });
  }

  return {
    metric_id: 'inflation_yoy',
    label: 'Inflation Year-over-Year',
    unit: 'percent',
    frequency: 'daily',
    observations,
    geography: 'United States',
  };
}

/**
 * Generate money growth
 */
export function generateMoneyGrowth(dates: string[], seed: number = 45): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let growth = 5.0;

  for (let i = 0; i < dates.length; i++) {
    // Money growth contracts during tightening
    let target = 5.0;
    if (i > dates.length * 0.20 && i < dates.length * 0.70) {
      target = -2.0; // Contraction
    }
    if (i > dates.length * 0.80) {
      target = 15.0; // Crisis expansion
    }

    growth = growth * 0.9 + target * 0.1 + rng.nextGaussian() * 1.0;
    observations.push({ date: dates[i], value: parseFloat(growth.toFixed(4)) });
  }

  return {
    metric_id: 'money_growth_yoy',
    label: 'Money Supply Growth YoY',
    unit: 'percent',
    frequency: 'daily',
    observations,
    geography: 'United States',
  };
}

/**
 * Generate central bank balance sheet index
 */
export function generateBalanceSheet(dates: string[], seed: number = 46): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let index = 100;

  for (let i = 0; i < dates.length; i++) {
    // Balance sheet expands during easing, contracts during tightening
    let change = 0;
    if (i < dates.length * 0.15) {
      change = 0.05; // Expansion
    } else if (i < dates.length * 0.70) {
      change = -0.03; // QT (Quantitative Tightening)
    } else {
      change = 0.10; // Crisis expansion
    }

    index += change + rng.nextGaussian() * 0.2;
    observations.push({ date: dates[i], value: parseFloat(index.toFixed(2)) });
  }

  return {
    metric_id: 'central_bank_balance_sheet_index',
    label: 'Central Bank Balance Sheet Index',
    unit: 'index',
    frequency: 'daily',
    observations,
    geography: 'United States',
    notes: 'Baseline = 100',
  };
}

/**
 * Generate liquidity stress index
 */
export function generateLiquidityStress(dates: string[], seed: number = 47): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let stress = 20;

  for (let i = 0; i < dates.length; i++) {
    // Stress spikes during specific events
    let target = 20;
    if (i > dates.length * 0.30 && i < dates.length * 0.35) {
      target = 70; // Banking stress
    }
    if (i > dates.length * 0.60 && i < dates.length * 0.65) {
      target = 85; // Liquidity crunch
    }

    stress = stress * 0.9 + target * 0.1 + rng.nextGaussian() * 3;
    stress = Math.max(0, Math.min(100, stress));

    observations.push({ date: dates[i], value: parseFloat(stress.toFixed(2)) });
  }

  return {
    metric_id: 'liquidity_stress_index',
    label: 'Liquidity Stress Index',
    unit: 'index',
    frequency: 'daily',
    observations,
    geography: 'United States',
    notes: 'Range: 0-100, higher indicates more stress',
  };
}

/**
 * Generate credit spreads
 */
export function generateCreditSpreads(dates: string[], seed: number = 48): { ig: TimeSeries; hy: TimeSeries } {
  const rng = new SeededRandom(seed);
  const obsIG = [];
  const obsHY = [];
  let igSpread = 100;
  let hySpread = 350;

  for (let i = 0; i < dates.length; i++) {
    // Spreads widen during stress periods
    let igTarget = 100;
    let hyTarget = 350;

    if (i > dates.length * 0.30 && i < dates.length * 0.40) {
      igTarget = 180;
      hyTarget = 650;
    }
    if (i > dates.length * 0.82) {
      igTarget = 250;
      hyTarget = 900;
    }

    igSpread = igSpread * 0.95 + igTarget * 0.05 + rng.nextGaussian() * 5;
    hySpread = hySpread * 0.95 + hyTarget * 0.05 + rng.nextGaussian() * 15;

    igSpread = Math.max(50, igSpread);
    hySpread = Math.max(200, hySpread);

    obsIG.push({ date: dates[i], value: parseFloat(igSpread.toFixed(2)) });
    obsHY.push({ date: dates[i], value: parseFloat(hySpread.toFixed(2)) });
  }

  return {
    ig: {
      metric_id: 'ig_credit_spread',
      label: 'Investment Grade Credit Spread',
      unit: 'basis points',
      frequency: 'daily',
      observations: obsIG,
      geography: 'United States',
    },
    hy: {
      metric_id: 'hy_credit_spread',
      label: 'High Yield Credit Spread',
      unit: 'basis points',
      frequency: 'daily',
      observations: obsHY,
      geography: 'United States',
    },
  };
}

/**
 * Generate funding stress proxy
 */
export function generateFundingStress(dates: string[], seed: number = 49): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let stress = 10;

  for (let i = 0; i < dates.length; i++) {
    let target = 10;
    if (i > dates.length * 0.30 && i < dates.length * 0.37) {
      target = 80;
    }
    if (i > dates.length * 0.60 && i < dates.length * 0.67) {
      target = 100;
    }

    stress = stress * 0.92 + target * 0.08 + rng.nextGaussian() * 3;
    stress = Math.max(5, Math.min(150, stress));

    observations.push({ date: dates[i], value: parseFloat(stress.toFixed(2)) });
  }

  return {
    metric_id: 'funding_stress_proxy',
    label: 'Funding Stress Proxy',
    unit: 'basis points',
    frequency: 'daily',
    observations,
    geography: 'United States',
  };
}

/**
 * Generate volatility index
 */
export function generateVolatility(dates: string[], seed: number = 50): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let vol = 15;

  for (let i = 0; i < dates.length; i++) {
    let target = 15;
    if (i > dates.length * 0.30 && i < dates.length * 0.35) {
      target = 45;
    }
    if (i > dates.length * 0.60 && i < dates.length * 0.66) {
      target = 35;
    }
    if (i > dates.length * 0.82) {
      target = 55;
    }

    vol = vol * 0.85 + target * 0.15 + rng.nextGaussian() * 2;
    vol = Math.max(10, Math.min(80, vol));

    observations.push({ date: dates[i], value: parseFloat(vol.toFixed(2)) });
  }

  return {
    metric_id: 'volatility_index_proxy',
    label: 'Volatility Index Proxy',
    unit: 'index',
    frequency: 'daily',
    observations,
    geography: 'United States',
  };
}

/**
 * Generate risk-off composite
 */
export function generateRiskOff(dates: string[], seed: number = 51): TimeSeries {
  const rng = new SeededRandom(seed);
  const observations = [];
  let riskOff = 30;

  for (let i = 0; i < dates.length; i++) {
    let target = 30;
    if (i > dates.length * 0.30 && i < dates.length * 0.38) {
      target = 75;
    }
    if (i > dates.length * 0.60 && i < dates.length * 0.68) {
      target = 65;
    }
    if (i > dates.length * 0.82) {
      target = 85;
    }

    riskOff = riskOff * 0.88 + target * 0.12 + rng.nextGaussian() * 2.5;
    riskOff = Math.max(0, Math.min(100, riskOff));

    observations.push({ date: dates[i], value: parseFloat(riskOff.toFixed(2)) });
  }

  return {
    metric_id: 'risk_off_composite',
    label: 'Risk-Off Composite Index',
    unit: 'index',
    frequency: 'daily',
    observations,
    geography: 'United States',
    notes: 'Range: 0-100, higher indicates more risk aversion',
  };
}

/**
 * Generate synthetic shock events
 */
export function generateShockEvents(startDate: string, endDate: string): ShockEvent[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const addDays = (date: Date, days: number): string => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split('T')[0];
  };

  return [
    {
      event_id: 'inflation_surge',
      label: 'Inflation Surge',
      start_date: addDays(start, Math.floor(totalDays * 0.10)),
      end_date: addDays(start, Math.floor(totalDays * 0.30)),
      severity: 4,
      description: 'Sustained acceleration in consumer prices driven by supply chain disruptions and demand recovery.',
    },
    {
      event_id: 'rapid_tightening_cycle',
      label: 'Rapid Tightening Cycle',
      start_date: addDays(start, Math.floor(totalDays * 0.15)),
      end_date: addDays(start, Math.floor(totalDays * 0.55)),
      severity: 5,
      description: 'Aggressive monetary policy tightening with rapid rate hikes to combat inflation.',
    },
    {
      event_id: 'banking_stress',
      label: 'Banking Sector Stress',
      start_date: addDays(start, Math.floor(totalDays * 0.31)),
      end_date: addDays(start, Math.floor(totalDays * 0.38)),
      severity: 4,
      description: 'Regional banking stress events causing liquidity concerns and deposit flight.',
    },
    {
      event_id: 'liquidity_crunch',
      label: 'Liquidity Crunch',
      start_date: addDays(start, Math.floor(totalDays * 0.60)),
      end_date: addDays(start, Math.floor(totalDays * 0.68)),
      severity: 3,
      description: 'Market liquidity deterioration with elevated funding stress and reduced market depth.',
    },
    {
      event_id: 'recession_signal',
      label: 'Recession Signal',
      start_date: addDays(start, Math.floor(totalDays * 0.70)),
      end_date: addDays(start, Math.floor(totalDays * 0.80)),
      severity: 4,
      description: 'Inverted yield curve and deteriorating economic indicators signal recession risk.',
    },
    {
      event_id: 'policy_pivot',
      label: 'Policy Pivot',
      start_date: addDays(start, Math.floor(totalDays * 0.85)),
      severity: 5,
      description: 'Central bank shifts to accommodative stance amid economic slowdown and financial stress.',
    },
  ];
}

/**
 * Generate all synthetic datasets
 */
export function generateAllMetrics(startDate: string, endDate: string) {
  const dates = generateDates(startDate, endDate, 'daily');
  
  const policyRate = generatePolicyRate(dates);
  const { yield2y, yield10y } = generateYields(dates, policyRate);
  const inflation = generateInflation(dates, policyRate);
  const moneyGrowth = generateMoneyGrowth(dates);
  const balanceSheet = generateBalanceSheet(dates);
  const liquidityStress = generateLiquidityStress(dates);
  const { ig, hy } = generateCreditSpreads(dates);
  const fundingStress = generateFundingStress(dates);
  const volatility = generateVolatility(dates);
  const riskOff = generateRiskOff(dates);

  // Derive additional metrics
  const curveSlopeObs = dates.map((date, i) => ({
    date,
    value: parseFloat(((yield10y.observations[i].value - yield2y.observations[i].value) * 100).toFixed(2)), // in basis points
  }));

  const realPolicyRateObs = dates.map((date, i) => ({
    date,
    value: parseFloat((policyRate.observations[i].value - inflation.observations[i].value).toFixed(4)),
  }));

  const policyRateChange3mObs = dates.map((date, i) => {
    const current = policyRate.observations[i].value;
    const past = i >= 90 ? policyRate.observations[i - 90].value : current;
    return {
      date,
      value: parseFloat(((current - past) * 100).toFixed(2)), // in basis points
    };
  });

  const curveInversionObs = dates.map((date, i) => ({
    date,
    value: curveSlopeObs[i].value < 0 ? 1 : 0,
  }));

  return {
    policy_rate_target: policyRate,
    yield_2y: yield2y,
    yield_10y: yield10y,
    curve_slope_10y_2y: {
      metric_id: 'curve_slope_10y_2y',
      label: 'Yield Curve Slope (10Y-2Y)',
      unit: 'basis points',
      frequency: 'daily' as const,
      observations: curveSlopeObs,
      geography: 'United States',
    },
    curve_inversion_flag: {
      metric_id: 'curve_inversion_flag',
      label: 'Yield Curve Inversion Flag',
      unit: 'binary',
      frequency: 'daily' as const,
      observations: curveInversionObs,
      geography: 'United States',
    },
    inflation_yoy: inflation,
    real_policy_rate: {
      metric_id: 'real_policy_rate',
      label: 'Real Policy Rate',
      unit: 'percent',
      frequency: 'daily' as const,
      observations: realPolicyRateObs,
      geography: 'United States',
    },
    policy_rate_change_3m: {
      metric_id: 'policy_rate_change_3m',
      label: 'Policy Rate Change (3M)',
      unit: 'basis points',
      frequency: 'daily' as const,
      observations: policyRateChange3mObs,
      geography: 'United States',
    },
    money_growth_yoy: moneyGrowth,
    central_bank_balance_sheet_index: balanceSheet,
    liquidity_stress_index: liquidityStress,
    ig_credit_spread: ig,
    hy_credit_spread: hy,
    funding_stress_proxy: fundingStress,
    volatility_index_proxy: volatility,
    risk_off_composite: riskOff,
  };
}

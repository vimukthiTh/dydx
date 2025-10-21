export const formatNumber = (value: string | number, fractionDigits = 2): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) {
    return '-';
  }
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
};

export const formatUsd = (value: string | number, fractionDigits = 2): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) {
    return '-';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(numeric);
};

export const formatPercent = (value: string | number, fractionDigits = 2): string => {
  if (value === undefined || value === null) {
    return '-';
  }
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) {
    return '-';
  }
  return `${numeric > 0 ? '+' : ''}${numeric.toFixed(fractionDigits)}%`;
};

export const formatSide = (side: string): string => (side.toUpperCase() === 'BUY' ? 'Buy' : 'Sell');

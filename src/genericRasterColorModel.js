export const TRANSPARENT = 'rgba(0,0,0,0)';

export const DEFAULT_DECODE_MIX = {
  redFactor: 1,
  greenFactor: 0,
  blueFactor: 0,
  baseShift: 0,
};

function assertColorStops(colorStops) {
  if (!Array.isArray(colorStops) || colorStops.length < 2) {
    throw new Error('colorStops must contain at least 2 entries');
  }

  for (const stop of colorStops) {
    if (!Array.isArray(stop) || stop.length !== 2) {
      throw new Error('Each color stop must be [value, color]');
    }
    if (typeof stop[0] !== 'number' || Number.isNaN(stop[0])) {
      throw new Error('Color stop value must be a number');
    }
    if (typeof stop[1] !== 'string') {
      throw new Error('Color stop color must be a string');
    }
  }
}

export function sortColorStops(colorStops) {
  assertColorStops(colorStops);
  return [...colorStops].sort((a, b) => a[0] - b[0]);
}

/**
 * Equivalent to Mapbox raster-color + raster-color-range semantics:
 * normalized position [0..1] is projected into valueRange and used as color stop.
 */
export function buildValueStopsFromNormalizedRamp({ valueRange, normalizedRamp }) {
  if (!Array.isArray(valueRange) || valueRange.length !== 2) {
    throw new Error('valueRange must be [min, max]');
  }

  const [minValue, maxValue] = valueRange;
  if (typeof minValue !== 'number' || typeof maxValue !== 'number' || minValue >= maxValue) {
    throw new Error('Invalid valueRange: expected min < max');
  }

  if (!Array.isArray(normalizedRamp) || normalizedRamp.length < 2) {
    throw new Error('normalizedRamp must contain at least 2 entries');
  }

  const stops = normalizedRamp.map(([position01, color]) => {
    if (typeof position01 !== 'number' || Number.isNaN(position01)) {
      throw new Error('normalizedRamp position must be a number');
    }
    const clamped = Math.max(0, Math.min(1, position01));
    const value = minValue + (maxValue - minValue) * clamped;
    return [value, color];
  });

  return sortColorStops(stops);
}

export function buildColorReliefExpression({
  colorStops,
  noDataValue = null,
  noDataColor = TRANSPARENT,
}) {
  const stops = sortColorStops(colorStops);

  const expression = ['interpolate', ['linear'], ['elevation']];

  if (typeof noDataValue === 'number' && !Number.isNaN(noDataValue)) {
    expression.push(noDataValue, noDataColor);
  }

  for (const [value, color] of stops) {
    expression.push(value, color);
  }

  return expression;
}

export function buildMaskedColorStops({ colorStops, visibleRanges, hiddenColor = TRANSPARENT }) {
  const stops = sortColorStops(colorStops);

  if (!Array.isArray(visibleRanges) || visibleRanges.length === 0) {
    return stops;
  }

  const isVisible = (value) => visibleRanges.some(([start, end]) => value >= start && value <= end);

  return stops.map(([value, color]) => [value, isVisible(value) ? color : hiddenColor]);
}

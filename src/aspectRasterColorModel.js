const TRANSPARENT = 'rgba(0,0,0,0)';

export const ASPECT_COLOR_MODEL = {
  valueRange: [0, 255],
  decodeMix: {
    redFactor: 1,
    greenFactor: 0,
    blueFactor: 0,
    baseShift: 0,
  },
  sectors: [
    { id: 'N', start: 1, end: 31, color: '#3264e6' },
    { id: 'NE', start: 32, end: 63, color: '#64b4ff' },
    { id: 'E', start: 64, end: 95, color: '#64d250' },
    { id: 'SE', start: 96, end: 127, color: '#c8e632' },
    { id: 'S', start: 128, end: 159, color: '#e63c32' },
    { id: 'SW', start: 160, end: 191, color: '#f0961e' },
    { id: 'W', start: 192, end: 223, color: '#f0dc32' },
    { id: 'NW', start: 224, end: 255, color: '#aa50e6' },
  ],
};

export function defaultAspectSelection() {
  return new Set(ASPECT_COLOR_MODEL.sectors.map((sector) => sector.id));
}

export function normalizeAspectSelection(aspectSelection) {
  if (!(aspectSelection instanceof Set) || aspectSelection.size === 0) {
    return defaultAspectSelection();
  }
  return aspectSelection;
}

/**
 * Mapbox raster-color equivalent transfer-function for MapLibre color-relief.
 */
export function buildAspectColorReliefExpression(aspectSelection) {
  const selected = normalizeAspectSelection(aspectSelection);
  const [rangeMin] = ASPECT_COLOR_MODEL.valueRange;
  const expression = ['interpolate', ['linear'], ['elevation'], rangeMin, TRANSPARENT];

  ASPECT_COLOR_MODEL.sectors.forEach(({ id, start, end, color }) => {
    const stopColor = selected.has(id) ? color : TRANSPARENT;
    expression.push(start, stopColor, end, stopColor);
  });

  return expression;
}

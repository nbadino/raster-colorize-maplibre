import {
  buildRasterDemSource,
  buildColorReliefLayer,
  updateColorRelief,
} from '../src/maplibreColorReliefAdapter.js';
import {
  buildValueStopsFromNormalizedRamp,
  buildColorReliefExpression,
} from '../src/genericRasterColorModel.js';

const PMTILES_URL = 'pmtiles://https://tiles.myboletus.com/europe_dem_aspect_raw.pmtiles';
const BOUNDS = [-32.0, 27.0, 45.0, 72.0];

const decodeMix = {
  redFactor: 1,
  greenFactor: 0,
  blueFactor: 0,
  baseShift: 0,
};

// Mapbox-like normalized ramp [0..1] projected to real values [0..255]
const normalizedRamp = [
  [0.00, 'rgba(0,0,0,0)'],
  [0.01, '#3264e6'],
  [0.13, '#64b4ff'],
  [0.25, '#64d250'],
  [0.38, '#c8e632'],
  [0.50, '#e63c32'],
  [0.63, '#f0961e'],
  [0.75, '#f0dc32'],
  [0.88, '#aa50e6'],
  [1.00, '#aa50e6'],
];

const baseExpression = buildColorReliefExpression({
  colorStops: buildValueStopsFromNormalizedRamp({
    valueRange: [0, 255],
    normalizedRamp,
  }),
  noDataValue: 0,
  noDataColor: 'rgba(0,0,0,0)',
});

export function mountGenericRasterColorLayer(map) {
  map.addSource('generic-raster-src', buildRasterDemSource({
    url: PMTILES_URL,
    minzoom: 5,
    maxzoom: 12,
    bounds: BOUNDS,
    decodeMix,
    encoding: 'custom',
  }));

  map.addLayer(buildColorReliefLayer({
    id: 'generic-raster-layer',
    source: 'generic-raster-src',
    opacity: 1,
    colorExpression: baseExpression,
    resampling: 'nearest',
  }));
}

export function setGenericRasterExpression(map, expression) {
  updateColorRelief(map, 'generic-raster-layer', expression);
}

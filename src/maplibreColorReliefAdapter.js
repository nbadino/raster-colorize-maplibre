import { DEFAULT_DECODE_MIX } from './genericRasterColorModel.js';
import { ASPECT_COLOR_MODEL, buildAspectColorReliefExpression } from './aspectRasterColorModel.js';

export function buildRasterDemSource({
  url,
  minzoom = 0,
  maxzoom = 22,
  bounds,
  tileSize = 256,
  decodeMix = DEFAULT_DECODE_MIX,
  encoding = 'custom',
}) {
  return {
    type: 'raster-dem',
    url,
    minzoom,
    maxzoom,
    bounds,
    tileSize,
    encoding,
    redFactor: decodeMix.redFactor,
    greenFactor: decodeMix.greenFactor,
    blueFactor: decodeMix.blueFactor,
    baseShift: decodeMix.baseShift,
  };
}

export function buildColorReliefLayer({
  id,
  source,
  opacity = 1,
  colorExpression,
  resampling = 'nearest',
}) {
  return {
    id,
    type: 'color-relief',
    source,
    paint: {
      'color-relief-opacity': opacity,
      'color-relief-color': colorExpression,
      'resampling': resampling,
    },
  };
}

export function updateColorRelief(map, layerId, colorExpression) {
  map.setPaintProperty(layerId, 'color-relief-color', colorExpression);
}

export function updateColorReliefOpacity(map, layerId, opacity) {
  map.setPaintProperty(layerId, 'color-relief-opacity', opacity);
}

// Aspect preset wrappers for convenience
export function buildAspectDemSource({ url, minzoom = 5, maxzoom = 12, bounds, tileSize = 256 }) {
  return buildRasterDemSource({
    url,
    minzoom,
    maxzoom,
    bounds,
    tileSize,
    decodeMix: ASPECT_COLOR_MODEL.decodeMix,
    encoding: 'custom',
  });
}

export function buildAspectColorReliefLayer({
  id = 'aspect_8class-layer',
  source = 'aspect_8class-src',
  opacity = 1,
  aspectSelection,
}) {
  return buildColorReliefLayer({
    id,
    source,
    opacity,
    colorExpression: buildAspectColorReliefExpression(aspectSelection),
    resampling: 'nearest',
  });
}

export function updateAspectColorRelief(map, layerId, aspectSelection) {
  updateColorRelief(map, layerId, buildAspectColorReliefExpression(aspectSelection));
}

export function updateAspectOpacity(map, layerId, opacity) {
  updateColorReliefOpacity(map, layerId, opacity);
}

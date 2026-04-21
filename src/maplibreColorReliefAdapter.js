import { ASPECT_COLOR_MODEL, buildAspectColorReliefExpression } from './aspectRasterColorModel.js';

export function buildAspectDemSource({ url, minzoom = 5, maxzoom = 12, bounds, tileSize = 256 }) {
  return {
    type: 'raster-dem',
    url,
    minzoom,
    maxzoom,
    bounds,
    tileSize,
    encoding: 'custom',
    redFactor: ASPECT_COLOR_MODEL.decodeMix.redFactor,
    greenFactor: ASPECT_COLOR_MODEL.decodeMix.greenFactor,
    blueFactor: ASPECT_COLOR_MODEL.decodeMix.blueFactor,
    baseShift: ASPECT_COLOR_MODEL.decodeMix.baseShift,
  };
}

export function buildAspectColorReliefLayer({
  id = 'aspect_8class-layer',
  source = 'aspect_8class-src',
  opacity = 1,
  aspectSelection,
}) {
  return {
    id,
    type: 'color-relief',
    source,
    paint: {
      'color-relief-opacity': opacity,
      'color-relief-color': buildAspectColorReliefExpression(aspectSelection),
      'resampling': 'nearest',
    },
  };
}

export function updateAspectColorRelief(map, layerId, aspectSelection) {
  map.setPaintProperty(layerId, 'color-relief-color', buildAspectColorReliefExpression(aspectSelection));
}

export function updateAspectOpacity(map, layerId, opacity) {
  map.setPaintProperty(layerId, 'color-relief-opacity', opacity);
}

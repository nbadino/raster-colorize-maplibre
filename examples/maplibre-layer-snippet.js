import {
  buildAspectDemSource,
  buildAspectColorReliefLayer,
  updateAspectColorRelief,
} from '../src/maplibreColorReliefAdapter.js';

const PMTILES_URL = 'pmtiles://https://tiles.myboletus.com/europe_dem_aspect_raw.pmtiles';
const BOUNDS = [-32.0, 27.0, 45.0, 72.0];

export function mountAspectLayer(map, selection = new Set(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'])) {
  map.addSource('aspect_8class-src', buildAspectDemSource({
    url: PMTILES_URL,
    minzoom: 5,
    maxzoom: 12,
    bounds: BOUNDS,
  }));

  map.addLayer(buildAspectColorReliefLayer({
    id: 'aspect_8class-layer',
    source: 'aspect_8class-src',
    opacity: 1,
    aspectSelection: selection,
  }));
}

export function setAspectSelection(map, nextSelection) {
  updateAspectColorRelief(map, 'aspect_8class-layer', nextSelection);
}

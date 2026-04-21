# raster-colorize-maplibre

Colorizzazione client-side di raster generici in MapLibre GL JS, con modello "raster-color-like" (decode mix + range + ramp).

## Cosa fa

Replica il comportamento pratico di `raster-color` con primitive native MapLibre:

- `source: raster-dem` (`encoding: custom`)
- `layer: color-relief`
- expression dinamica su `['elevation']`

## Supporto "raster generico"

Supporta qualsiasi raster **scalare** che puoi mappare a un valore numerico per pixel via decode lineare:

`value = R*redFactor + G*greenFactor + B*blueFactor + baseShift`

Quindi:

- sì: raster scientifici/scalari (single-band o RGB-encoded)
- no diretto: raster RGB "fotografici" dove non esiste una variabile scalare da estrarre

## API principali

- `buildRasterDemSource(...)`
- `buildColorReliefLayer(...)`
- `updateColorRelief(...)`

Utility generiche:

- `buildValueStopsFromNormalizedRamp(...)`
- `buildColorReliefExpression(...)`
- `buildMaskedColorStops(...)`

Preset aspect 8 classi:

- `buildAspectDemSource(...)`
- `buildAspectColorReliefLayer(...)`
- `updateAspectColorRelief(...)`

## Struttura

- `src/genericRasterColorModel.js`: core generico value->color
- `src/maplibreColorReliefAdapter.js`: adapter MapLibre (source/layer/update)
- `src/aspectRasterColorModel.js`: preset aspect su core generico
- `examples/maplibre-layer-snippet.js`: esempio integrazione
- `docs/implementation-plan.md`: piano di implementazione

## Riferimenti

- MapLibre layers (color-relief): https://maplibre.org/maplibre-style-spec/layers/
- MapLibre sources (raster-dem/custom encoding): https://maplibre.org/maplibre-style-spec/sources/
- Pattern Mapbox raster-color: https://github.com/mapbox/mapbox-gl-js/blob/main/debug/raster-color.html

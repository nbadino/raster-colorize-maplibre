# raster-colorize-maplibre

Implementazione "raster-color"-like per MapLibre GL JS, con colorizzazione e filtro settori interamente client-side.

## Obiettivo

Replicare il comportamento pratico di `raster-color` di Mapbox (transfer function valore->colore + decode mix + range), usando primitive supportate nativamente da MapLibre:

- `source: raster-dem` con `encoding: custom`
- `layer: color-relief`
- espressione dinamica `color-relief-color`

## Stato attuale

- Pattern Mapbox analizzato:
  - debug UI: `debug/raster-color.html`
  - pipeline renderer: `raster_style_layer.ts`, `draw_raster.ts`, `raster.fragment.glsl`
- Equivalente MapLibre implementato come PoC applicativo:
  - decode byte grayscale da canale R (`redFactor: 1`)
  - range 0-255
  - palette 8 classi esposizione
  - filtro classi via trasparenza

## Contenuto repo

- `docs/implementation-plan.md`: piano completo di prodotto/architettura/test
- `src/aspectRasterColorModel.js`: modello colore + transfer function
- `src/maplibreColorReliefAdapter.js`: adapter per creare source/layer MapLibre
- `examples/maplibre-layer-snippet.js`: snippet di integrazione

## Quick start

1. Importa `buildAspectDemSource` e `buildAspectColorReliefLayer` da `src/maplibreColorReliefAdapter.js`
2. Aggiungi source `raster-dem` su PMTiles raw byte
3. Aggiungi layer `color-relief`
4. Aggiorna i settori selezionati via `map.setPaintProperty(..., 'color-relief-color', ...)`

## Note

Questa repo è pensata per manutenzione tecnica del colorizer. L'integrazione finale nell'app resta separata.

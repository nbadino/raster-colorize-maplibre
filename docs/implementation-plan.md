# Implementation Plan — Raster Colorize Client-Side (MapLibre)

## 1. Domanda iniziale: il raster attuale è un buon punto di partenza?

Sì.

Checklist tecnica minima del dataset target:

- formato: PMTiles v3
- tile format: PNG
- pixel format: 8-bit grayscale (single-band)
- dominio valori: 0..255
- `nodata`: 0
- coerenza CRS: EPSG:3857
- resampling in produzione tile: nearest

Per il dataset `europe_dem_aspect_raw.pmtiles` la checklist è soddisfatta.

## 2. Come funziona `raster-color` in Mapbox (pattern da replicare)

Pattern logico osservato:

1. Decodifica valore scalare da pixel (`raster-color-mix` + offset)
2. Definizione dominio (`raster-color-range`)
3. Transfer function (`raster-color`) con expression `interpolate` su `raster-value`
4. Lookup su color ramp texture in shader
5. Alpha finale = alpha color ramp * alpha input

## 3. Mapping su MapLibre (equivalente pratico)

Dato che MapLibre non espone `raster-color` su layer `raster`, si usa:

1. `source: raster-dem` + `encoding: custom` per decodifica valore
2. `layer: color-relief`
3. `color-relief-color` come transfer function equivalente
4. filtro classi = classi non selezionate -> `rgba(0,0,0,0)`

## 4. Architettura proposta (mantenibile)

## 4.1 Modulo data-model (puro)

Responsabilità:

- definire `valueRange`
- definire `decodeMix`
- definire classi/settori (`id`, `start`, `end`, `color`)
- costruire expression `color-relief-color` in modo deterministico

Output:

- nessuna dipendenza da MapLibre
- facilmente testabile

## 4.2 Adapter MapLibre

Responsabilità:

- costruire source `raster-dem` coerente con decode mix
- costruire layer `color-relief`
- applicare update runtime di palette/filtri via `setPaintProperty`

Output:

- API minimalista per app host

## 4.3 Integrazione app

Responsabilità:

- aggiunta source/layer in lifecycle mappa
- sync opacità
- sync selezioni utente
- rimozione source/layer su teardown

## 5. Piano di esecuzione

## Fase A — Baseline tecnica (0.5g)

- validare dataset input (header + sample tile)
- congelare codifica e convenzioni (`0 nodata`, `1..255 data`)

Deliverable:

- report breve `dataset-validation.md`

## Fase B — Modello colore (0.5g)

- implementare modulo puro transfer function
- codificare palette 8 classi
- aggiungere fallback "tutti i settori attivi"

Deliverable:

- `src/aspectRasterColorModel.js`

## Fase C — Adapter MapLibre (0.5g)

- source builder `raster-dem/custom`
- layer builder `color-relief`
- funzione update paint runtime

Deliverable:

- `src/maplibreColorReliefAdapter.js`

## Fase D — Integrazione app host (1g)

- sostituire path proxy/sector-tiles
- un solo source + un solo layer aspect
- aggiornare opacità e filtri in tempo reale

Deliverable:

- patch nel layer manager app

## Fase E — Verifica end-to-end (0.5g)

- test visuale desktop/mobile
- test performance pan/zoom
- test regressioni toggle rapidi

Deliverable:

- checklist QA firmata

## 6. Strategia test

## 6.1 Test funzionali

- `aspect on/off`
- selezione singolo settore (N, NE, ..., NW)
- multi-selezione
- reset selezione (all)

## 6.2 Test qualità dato

- nodata trasparente
- bordi classi corretti (`31/32`, `63/64`, ...)
- assenza di smoothing indesiderato (nearest)

## 6.3 Test performance

- FPS durante pan continuo
- tempo medio aggiornamento paint expression
- memoria GPU stabile dopo toggle multipli

## 7. Rischi e mitigazioni

- mismatch codifica byte/decoder:
  - mitigazione: test pixel-based su tile campione
- artefatti interpolazione:
  - mitigazione: `resampling: nearest`
- drift palette tra UI e map:
  - mitigazione: unica fonte colore nel modulo model

## 8. Evoluzioni

- palette dinamiche (Viridis/Turbo/Hypsometric) in runtime
- preset salva/carica
- supporto raster continui non categoriali
- eventuale plugin MapLibre dedicato con API `raster-color`-like

## 9. Definition of Done

- nessun proxy per-sector in produzione
- colorizzazione interamente client-side
- filtri settore realtime
- build pulita
- documentazione integrazione disponibile

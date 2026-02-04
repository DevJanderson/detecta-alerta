#!/usr/bin/env node

/**
 * Converte GeoJSON → TopoJSON com simplificação e quantização.
 *
 * Uso: node scripts/convert-geo.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { topology } from 'topojson-server'
import { presimplify, simplify } from 'topojson-simplify'
import { quantize } from 'topojson-client'

const GEO_DIR = resolve(import.meta.dirname, '../public/geo')

const conversions = [
  {
    input: 'brazil_simplified.geojson',
    output: 'brazil_states.topojson',
    objectName: 'states'
  },
  {
    input: 'brazil_cities_simplified.geojson',
    output: 'brazil_cities.topojson',
    objectName: 'cities'
  }
]

for (const { input, output, objectName } of conversions) {
  const inputPath = resolve(GEO_DIR, input)

  if (!existsSync(inputPath)) {
    console.warn(`⚠ Pulando ${input} (arquivo não encontrado)`)
    continue
  }

  const geojson = JSON.parse(readFileSync(inputPath, 'utf-8'))

  // 1. Converter para TopoJSON
  let topo = topology({ [objectName]: geojson })

  // 2. Simplificar (reduz vértices mantendo forma)
  topo = presimplify(topo)
  topo = simplify(topo, 0.05)

  // 3. Quantizar (reduz precisão de coordenadas)
  topo = quantize(topo, 1e5)

  const outputPath = resolve(GEO_DIR, output)
  writeFileSync(outputPath, JSON.stringify(topo))

  const inputSize = (readFileSync(inputPath).length / 1024).toFixed(0)
  const outputSize = (readFileSync(outputPath).length / 1024).toFixed(0)
  const reduction = (((inputSize - outputSize) / inputSize) * 100).toFixed(1)

  console.warn(
    `✓ ${basename(input)} (${inputSize}KB) → ${basename(output)} (${outputSize}KB) [-${reduction}%]`
  )
}

console.warn('\nConversão concluída.')

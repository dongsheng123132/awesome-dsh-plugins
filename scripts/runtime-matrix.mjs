#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SHA40 = /^[0-9a-f]{40}$/i
const TARGET_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PACKAGE_NAME = /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/i
const ALLOWED_PLATFORMS = new Set(['ubuntu-latest', 'windows-latest'])
const ALLOWED_ENFORCEMENT = new Set(['observe', 'required'])

function validateBaseline(baseline, failures) {
  if (!TARGET_ID.test(baseline?.id ?? '')) failures.push(`invalid baseline id: ${baseline?.id}`)
  if (!SHA40.test(baseline?.revision ?? '')) failures.push(`${baseline?.id}: revision must be an immutable 40-character commit`)
  if (!/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\.git$/.test(baseline?.cloneUrl ?? '')) {
    failures.push(`${baseline?.id}: cloneUrl must be an HTTPS GitHub clone URL`)
  }
  if (!/^pnpm@\d+\.\d+\.\d+$/.test(baseline?.packageManager ?? '')) failures.push(`${baseline?.id}: packageManager must pin an exact pnpm version`)
  if (typeof baseline?.label !== 'string' || baseline.label.length < 3) failures.push(`${baseline?.id}: label is required`)
}

export function validateRuntimeConfig(config) {
  const failures = []
  if (config?.schemaVersion !== 2) failures.push('schemaVersion must be 2')
  if (!Array.isArray(config?.baselines) || config.baselines.length === 0) failures.push('baselines must be a non-empty array')
  const baselineIds = new Set()
  for (const baseline of config?.baselines ?? []) {
    validateBaseline(baseline, failures)
    if (baselineIds.has(baseline.id)) failures.push(`duplicate baseline id: ${baseline.id}`)
    baselineIds.add(baseline.id)
  }
  if (!Array.isArray(config?.platforms) || config.platforms.length === 0) failures.push('platforms must be a non-empty array')
  for (const platform of config?.platforms ?? []) {
    if (!ALLOWED_PLATFORMS.has(platform)) failures.push(`unsupported runtime platform: ${platform}`)
  }
  if (new Set(config?.platforms ?? []).size !== (config?.platforms ?? []).length) failures.push('platforms must be unique')
  if (!Array.isArray(config?.targets) || config.targets.length === 0) failures.push('targets must be a non-empty array')

  const targetIds = new Set()
  for (const target of config?.targets ?? []) {
    if (!TARGET_ID.test(target.id ?? '')) failures.push(`invalid target id: ${target.id}`)
    if (targetIds.has(target.id)) failures.push(`duplicate target id: ${target.id}`)
    targetIds.add(target.id)
    if (!/^[^/\s]+\/[^/\s]+$/.test(target.repository ?? '')) failures.push(`${target.id}: invalid repository`)
    if (!SHA40.test(target.revision ?? '')) failures.push(`${target.id}: revision must be an immutable commit`)
    if (target.spec !== `github:${target.repository}#${target.revision}`) failures.push(`${target.id}: spec must pin repository and revision exactly`)
    if (!PACKAGE_NAME.test(target.allowBuild ?? '')) failures.push(`${target.id}: allowBuild must name exactly one package`)
    if (target.profile !== 'web') failures.push(`${target.id}: only the isolated web profile is currently supported`)
    const sourceReferences = [target.sourcePluginId, target.sourceLabId].filter(value => typeof value === 'string' && value.length > 0)
    if (sourceReferences.length !== 1) failures.push(`${target.id}: exactly one sourcePluginId or sourceLabId is required`)
    if (!ALLOWED_ENFORCEMENT.has(target.enforcement)) failures.push(`${target.id}: enforcement must be observe or required`)
    if (!target.selection || typeof target.selection !== 'string') failures.push(`${target.id}: selection is required`)
    if (typeof target.rationale !== 'string' || target.rationale.length < 20) failures.push(`${target.id}: rationale is required`)
  }
  if (failures.length > 0) throw new Error(failures.join('\n'))
  return config
}

export function expandRuntimeMatrix(config) {
  validateRuntimeConfig(config)
  return {
    include: config.baselines.flatMap(baseline => config.platforms.flatMap(os => config.targets.map(target => ({
      os,
      baseline: baseline.id,
      baselineLabel: baseline.label,
      dshRevision: baseline.revision,
      dshCloneUrl: baseline.cloneUrl,
      packageManager: baseline.packageManager,
      target: target.id,
      spec: target.spec,
      allowBuild: target.allowBuild,
      profile: target.profile,
      enforcement: target.enforcement,
      selection: target.selection
    }))))
  }
}

export function expandBaselineMatrix(config) {
  validateRuntimeConfig(config)
  return {
    include: config.baselines.flatMap(baseline => config.platforms.map(os => ({
      os,
      baseline: baseline.id,
      baselineLabel: baseline.label,
      dshRevision: baseline.revision,
      dshCloneUrl: baseline.cloneUrl,
      packageManager: baseline.packageManager
    })))
  }
}

export function pinnedRepositories(config) {
  const repositories = new Set()
  for (const target of config?.targets ?? []) {
    if (typeof target.repository === 'string' && target.repository.length > 0) repositories.add(target.repository)
  }
  return [...repositories]
}

export async function loadRuntimeConfig(path = new URL('../data/runtime-targets.json', import.meta.url)) {
  return validateRuntimeConfig(JSON.parse(await readFile(path, 'utf8')))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const config = await loadRuntimeConfig()
  const baselineOnly = process.argv.includes('--baselines')
  process.stdout.write(`${JSON.stringify(baselineOnly ? expandBaselineMatrix(config) : expandRuntimeMatrix(config))}\n`)
}

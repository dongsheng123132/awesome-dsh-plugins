#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { CATEGORY_LABELS, markdownEscape, readJson, replaceGeneratedSection } from './lib.mjs'

const root = new URL('../', import.meta.url)
const radar = await readJson(new URL('data/plugins.json', root))
const labs = await readJson(new URL('data/labs.json', root))
const capabilities = await readJson(new URL('data/capabilities.json', root))

function radarSection(language) {
  const categoryCounts = new Map()
  for (const plugin of radar.plugins) {
    categoryCounts.set(plugin.category, (categoryCounts.get(plugin.category) || 0) + 1)
  }
  const categories = [...categoryCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([category, count]) => `${CATEGORY_LABELS[category] || category}: ${count}`)
    .join(' · ')
  const top = []
  const seenRepositories = new Set()
  for (const plugin of radar.plugins) {
    if (seenRepositories.has(plugin.repo)) continue
    seenRepositories.add(plugin.repo)
    top.push(plugin)
    if (top.length === 30) break
  }
  const header = language === 'zh'
    ? `**${radar.plugins.length}** 个 Verified Bundle / 检查 **${radar.source.examined}** 个 topic 仓库 / GitHub 报告总数 **${radar.source.reportedTotal}**\n\n${categories || '尚无分类数据'}\n\n| 插件 | 分类 | Stars | License | 证据 | 安装 |\n|---|---:|---:|---|---|---|`
    : `**${radar.plugins.length}** verified bundles / **${radar.source.examined}** topic repositories examined / **${radar.source.reportedTotal}** reported by GitHub\n\n${categories || 'No category data yet'}\n\n| Plugin | Category | Stars | License | Evidence | Install |\n|---|---:|---:|---|---|---|`
  const rows = top.map(plugin => {
    const evidence = `\`${plugin.verification.manifestPath}\` → \`${plugin.verification.patchPath}\``
    const install = plugin.installCommand ? `\`${plugin.installCommand}\`` : language === 'zh' ? '需看包说明' : 'See package docs'
    return `| [${markdownEscape(plugin.name)}](${plugin.url})<br><sub>${markdownEscape(plugin.repo)}</sub> | ${CATEGORY_LABELS[plugin.category] || plugin.category} | ${plugin.stars} | ${plugin.license || '—'} | ${evidence} | ${install} |`
  })
  const footer = language === 'zh'
    ? `\n\n首页按仓库去重展示 Stars 前 ${top.length} 项；同仓多 bundle 与全部结果见 [data/plugins.json](data/plugins.json)。快照：${radar.generatedAt || '尚未扫描'}。`
    : `\n\nThe homepage shows the top ${top.length} repositories once each; multi-bundle repositories and all records remain in [data/plugins.json](data/plugins.json). Snapshot: ${radar.generatedAt || 'not scanned yet'}.`
  return `${header}\n${rows.join('\n')}${footer}`
}

function labsSection(language) {
  const header = language === 'zh'
    ? '| 项目 | 状态 | 分类 | 要解决的问题 | 证据 |\n|---|---|---|---|---|'
    : '| Project | Status | Category | Problem | Evidence |\n|---|---|---|---|---|'
  const rows = labs.projects.map(project => {
    const repoUrl = project.repo?.startsWith('https://') ? project.repo : project.repo ? `https://github.com/${project.repo}` : null
    const name = repoUrl ? `[${project.name}](${repoUrl})` : `\`${project.name}\``
    const evidence = project.evidence.length > 0
      ? project.evidence.map(item => `[${item.label}](${item.url})`).join(', ')
      : language === 'zh' ? '尚无' : 'None yet'
    return `| ${name} | **${project.status}** | ${CATEGORY_LABELS[project.category] || project.category} | ${markdownEscape(project.summary)} | ${evidence} |`
  })
  return `${header}\n${rows.join('\n')}`
}

function capabilitiesSection(language) {
  const counts = Object.fromEntries(['copy', 'wrapper', 'bridge', 'unclassified']
    .map(kind => [kind, capabilities.capabilities.filter(item => item.port.classification === kind).length]))
  const top = capabilities.capabilities.slice(0, 15)
  const summary = language === 'zh'
    ? `**${capabilities.capabilities.length}** 条固定 revision 候选：Copy ${counts.copy} · Wrapper ${counts.wrapper} · Bridge ${counts.bridge} · 未分类 ${counts.unclassified}`
    : `**${capabilities.capabilities.length}** revision-pinned candidates: Copy ${counts.copy} · Wrapper ${counts.wrapper} · Bridge ${counts.bridge} · Unclassified ${counts.unclassified}`
  const header = language === 'zh'
    ? '| 能力 | 来源 | 移植路径 | 分数 | License | 固定证据 |\n|---|---|---:|---:|---|---|'
    : '| Capability | Source | Port path | Score | License | Pinned evidence |\n|---|---|---:|---:|---|---|'
  const rows = top.map(item => `| [${markdownEscape(item.metadata.name || item.name)}](${item.url})<br><sub>${markdownEscape(item.repo)}:${markdownEscape(item.path)}</sub> | ${item.ecosystem} | ${item.port.classification} | ${item.port.score}/100 | ${item.metadata.license.value || '—'} | <code>${item.provenance.revision.slice(0, 12)}</code> / <code>${item.provenance.blobSha.slice(0, 12)}</code> |`)
  const footer = language === 'zh'
    ? `完整记录、分项得分与逐行信号见 [data/capabilities.json](data/capabilities.json)。快照：${capabilities.generatedAt || '尚未扫描'}。分数只衡量观测到的适配工作量，不代表兼容、安全、质量或许可证已获准。`
    : `Full records, score components, and line-level signals live in [data/capabilities.json](data/capabilities.json). Snapshot: ${capabilities.generatedAt || 'not scanned yet'}. The score measures only observed adaptation effort; it is not compatibility, safety, quality, or license clearance.`
  return `${summary}\n\n${header}\n${rows.join('\n')}\n\n${footer}`
}

for (const [filename, language] of [['README.md', 'en'], ['README.zh-CN.md', 'zh']]) {
  const path = new URL(filename, root)
  let source = await readFile(path, 'utf8')
  source = replaceGeneratedSection(source, 'RADAR', radarSection(language))
  source = replaceGeneratedSection(source, 'CAPABILITIES', capabilitiesSection(language))
  source = replaceGeneratedSection(source, 'LABS', labsSection(language))
  await writeFile(path, source, 'utf8')
}

console.log(JSON.stringify({ ok: true, plugins: radar.plugins.length, capabilities: capabilities.capabilities.length, labs: labs.projects.length }))

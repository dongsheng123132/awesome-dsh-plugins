import { createHash } from 'node:crypto'

const BRIDGE_RULES = [
  ['harness-hook', /(?:PreToolUse|PostToolUse|SessionStart|Stop hook|hooks?\.json|\.claude\/settings)/i],
  ['tool-protocol', /(?:model context protocol|\bMCP server\b|\bcordis\b|dsh\.bundle|defineTool\s*\(|ctx\.tools|\.codex-plugin)/i],
  ['runtime-config', /(?:openclaw\.json|claude_desktop_config|codex\.toml|plugin\.json)/i]
]

const EXECUTABLE_RULES = [
  ['command-runner', /^\s*(?:\$\s*)?(?:npm|npx|pnpm|yarn|node|python\d*|pipx?|uvx?|bash|sh|powershell|pwsh|docker|cargo|go)\s+/i],
  ['script-reference', /(?:^|[\s`(])(?:\.\/)?(?:scripts?|bin)\/[\w./-]+/i]
]

const RESOURCE_RULES = [
  ['bundled-resource', /(?:^|[\s`(])(?:\.\/)?(?:assets?|references?|templates?|examples?)\/[\w./-]+/i],
  ['relative-markdown-link', /\[[^\]]+\]\((?!https?:|mailto:|#)([^)]+)\)/i]
]

const VALIDATION_RULES = [
  ['acceptance', /\b(?:acceptance|success criteria|expected output|验收|成功标准)\b/i],
  ['verification', /\b(?:test|tests|verify|verification|check|lint|测试|验证|检查)\b/i]
]

const PERMISSION_RULES = [
  ['network', /(?:\bcurl\b|\bwget\b|\bfetch\s*\(|network access|internet access|联网|网络访问)/i],
  ['secrets', /(?:API[_-]?KEY|ACCESS[_-]?TOKEN|credential|secret|password|密钥|凭据)/i],
  ['write-or-shell', /(?:write files?|modify files?|shell access|execute commands?|写入文件|执行命令)/i]
]

function scalar(value) {
  const trimmed = String(value ?? '').trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

export function parseSkillFrontmatter(content) {
  const lines = String(content).replaceAll('\r\n', '\n').split('\n')
  if (lines[0]?.trim() !== '---') return { present: false, fields: {}, bodyStartLine: 1 }
  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  if (closing === -1) return { present: true, valid: false, fields: {}, bodyStartLine: 1 }
  const fields = {}
  for (let index = 1; index < closing; index += 1) {
    const match = lines[index].match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/)
    if (!match) continue
    const key = match[1]
    let value = match[2]
    if (value === '|' || value === '>') {
      const continuation = []
      while (index + 1 < closing && /^\s+/.test(lines[index + 1])) continuation.push(lines[index += 1].trim())
      value = continuation.join(value === '|' ? '\n' : ' ')
    }
    fields[key] = scalar(value)
  }
  return { present: true, valid: true, fields, bodyStartLine: closing + 2 }
}

function collectEvidence(lines, rules, source) {
  const evidence = []
  for (let index = 0; index < lines.length; index += 1) {
    for (const [signal, pattern] of rules) {
      const match = lines[index].match(pattern)
      if (!match) continue
      evidence.push({ signal, source, line: index + 1, match: match[0].trim().slice(0, 80) })
      if (evidence.length >= 12) break
    }
    if (evidence.length >= 12) break
  }
  return evidence
}

function licenseEvidence(frontmatter, repositoryLicense) {
  const skillLicense = scalar(frontmatter.fields.license)
  if (skillLicense) return { value: skillLicense, source: 'skill-frontmatter' }
  if (repositoryLicense && !['NOASSERTION', 'OTHER'].includes(repositoryLicense)) {
    return { value: repositoryLicense, source: 'github-repository' }
  }
  return { value: null, source: 'unobserved' }
}

export function analyzeCapability(content, { repositoryLicense = null } = {}) {
  const normalized = String(content).replaceAll('\r\n', '\n')
  const lines = normalized.split('\n')
  const frontmatter = parseSkillFrontmatter(normalized)
  const name = scalar(frontmatter.fields.name)
  const description = scalar(frontmatter.fields.description)
  const bridge = collectEvidence(lines, BRIDGE_RULES, 'SKILL.md')
  const executable = collectEvidence(lines, EXECUTABLE_RULES, 'SKILL.md')
  const resources = collectEvidence(lines, RESOURCE_RULES, 'SKILL.md')
  const validation = collectEvidence(lines, VALIDATION_RULES, 'SKILL.md')
  const permissions = collectEvidence(lines, PERMISSION_RULES, 'SKILL.md')
  const license = licenseEvidence(frontmatter, repositoryLicense)

  const identity = (name ? 10 : 0) + (description ? 10 : 0)
  const licensing = license.source === 'skill-frontmatter' ? 15 : license.source === 'github-repository' ? 10 : 0
  const selfContainment = Math.max(0, 25
    - (resources.length > 0 ? 10 : 0)
    - (executable.length > 0 ? 15 : 0)
    - (permissions.length > 0 ? 10 : 0))
  const runtimeNeutrality = bridge.length === 0 ? 25 : 0
  const verifiability = validation.length > 0 ? 15 : 5
  let classification = 'unclassified'
  if (name && description) {
    if (bridge.length > 0) classification = 'bridge'
    else if (executable.length > 0 || resources.length > 0 || permissions.length > 0) classification = 'wrapper'
    else classification = 'copy'
  }
  const rawScore = identity + licensing + selfContainment + runtimeNeutrality + verifiability
  const classificationCap = { bridge: 39, wrapper: 79, unclassified: 49, copy: 100 }[classification]
  const score = Math.min(rawScore, classificationCap)

  return {
    metadata: {
      frontmatter: frontmatter.present ? (frontmatter.valid === false ? 'invalid' : 'present') : 'missing',
      name: name || null,
      description: description || null,
      license
    },
    port: {
      classification,
      score,
      rawScore,
      classificationCap,
      scoreVersion: 1,
      components: { identity, licensing, selfContainment, runtimeNeutrality, verifiability },
      disclaimer: 'Heuristic port-effort triage backed by listed observations; not compatibility, safety, or license clearance.'
    },
    evidence: { bridge, executable, resources, validation, permissions },
    content: {
      bytes: Buffer.byteLength(normalized),
      sha256: createHash('sha256').update(normalized).digest('hex')
    }
  }
}

export function inferEcosystem(path, queryId) {
  const normalized = String(path).toLowerCase()
  if (normalized.includes('.claude/skills/')) return 'claude'
  if (normalized.includes('.codex/skills/')) return 'codex'
  if (normalized.includes('.agents/skills/')) return 'agents'
  if (queryId === 'skillhub') return 'skillhub'
  if (queryId === 'openclaw') return 'openclaw'
  return 'unknown'
}

export function mergeSearchHits(groups) {
  const merged = new Map()
  for (const group of groups) {
    for (const item of group.items) {
      const key = `${item.repository.full_name}:${item.path}`
      const existing = merged.get(key)
      if (existing) existing.queryIds.push(group.id)
      else merged.set(key, { ...item, queryIds: [group.id] })
    }
  }
  return [...merged.values()].map(item => ({ ...item, queryIds: [...new Set(item.queryIds)].sort() }))
}

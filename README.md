![Awesome DSH Plugins — evidence-backed plugin radar](docs/assets/awesome-dsh-plugins-hero.png)

# Awesome DSH Plugins

> Discover installable DeepSeek Harness plugins, inspect the evidence behind each listing, and explore the 2Origin plugin lab.

[![Repository checks](https://github.com/dongsheng123132/awesome-dsh-plugins/actions/workflows/check.yml/badge.svg)](https://github.com/dongsheng123132/awesome-dsh-plugins/actions/workflows/check.yml)
[![MIT license](https://img.shields.io/github/license/dongsheng123132/awesome-dsh-plugins)](LICENSE)
[![DSH plugin topic](https://img.shields.io/badge/GitHub_topic-dsh--plugin-0969da)](https://github.com/topics/dsh-plugin)
[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)

[中文](README.zh-CN.md) · [Official DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [Browse verified bundles](#radar) · [Search from the terminal](#search-from-the-terminal) · [2Origin plugin lab](#2origin-plugin-lab)

## Start here

| I want to… | Go to |
|---|---|
| Find an installable DSH profile bundle | [Radar](#radar) |
| Estimate the work needed to port an Agent Skill | [Capability Port Score](#capability-port-score) |
| Search plugins offline from a terminal | [CLI search](#search-from-the-terminal) |
| Inspect plugins with reproducible runtime evidence | [Runtime compatibility layer](#runtime-compatibility-layer) |
| Explore evidence-first plugins built in this lab | [2Origin plugin lab](#2origin-plugin-lab) |

Normal CLI searches use the committed snapshot and need no GitHub token:

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
```

This repository deliberately distinguishes a repository that mentions DSH from an installable DSH profile bundle. A plugin receives the **Verified Bundle** mark only when the scanner finds both:

1. a `package.json` declaration at `dsh.bundle.patch`; and
2. the declared patch file in the same Git tree.

This is structural verification, not a security audit or a promise that the plugin works with today's DSH main branch.
Categories are heuristic navigation aids; manifest and patch evidence, not the category label, determines verification.

## Radar

<!-- RADAR:START -->
**1098** verified bundles / **1003** topic repositories examined / **11490** reported by GitHub

Other: 329 · UI / TUI: 225 · Token & Cost: 68 · Browser: 67 · MCP Bridge: 63 · Security: 61 · Memory: 55 · Model & Routing: 54 · Coding: 34 · Office: 32 · Developer Tools: 28 · Finance: 28 · Long-running: 22 · Writing / Novel: 19 · Research: 12 · Provenance & Lineage: 1

| Plugin | Category | Stars | License | Evidence | Install |
|---|---:|---:|---|---|---|
| [@open-design/dsh-runtime](https://github.com/nexu-io/open-design)<br><sub>nexu-io/open-design</sub> | Office | 91246 | Apache-2.0 | `packages/dsh-runtime/package.json` → `packages/dsh-runtime/cordis.patch.yml` | See package docs |
| [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume)<br><sub>amruthpillai/reactive-resume</sub> | MCP Bridge | 41696 | MIT | `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` | See package docs |
| [@openviking/dsh-memory-plugin](https://github.com/volcengine/OpenViking)<br><sub>volcengine/OpenViking</sub> | Memory | 33116 | AGPL-3.0 | `examples/dsh-memory-plugin/package.json` → `examples/dsh-memory-plugin/cordis.patch.yml` | See package docs |
| [@wxg-prc-cpg/dsh-weknora](https://github.com/Tencent/WeKnora)<br><sub>Tencent/WeKnora</sub> | Office | 20577 | NOASSERTION | `packages/dsh-weknora/package.json` → `packages/dsh-weknora/cordis.patch.yml` | See package docs |
| [dsh-plugin-desktop](https://github.com/anywhere-labs/dsh-desktop)<br><sub>anywhere-labs/dsh-desktop</sub> | Other | 19998 | MIT | `dsh-plugin-desktop/package.json` → `dsh-plugin-desktop/cordis.patch.yml` | See package docs |
| [@tt-a1i/archify-dsh](https://github.com/tt-a1i/archify)<br><sub>tt-a1i/archify</sub> | Long-running | 15658 | MIT | `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` | See package docs |
| [@memtensor/memos-local-plugin](https://github.com/MemTensor/MemOS)<br><sub>MemTensor/MemOS</sub> | Token & Cost | 10966 | Apache-2.0 | `apps/memos-local-plugin/package.json` → `apps/memos-local-plugin/adapters/deepseek-harness/cordis.patch.yml` | See package docs |
| [@dsh-external/dsh-super-injector](https://github.com/yjh051108/dsh-routing-suite)<br><sub>yjh051108/dsh-routing-suite</sub> | Model & Routing | 6777 | MIT | `injector/package.json` → `injector/cordis.patch.yml` | See package docs |
| [@dsh-web/files](https://github.com/zhu1090093659/dsh-web)<br><sub>zhu1090093659/dsh-web</sub> | Browser | 6005 | Apache-2.0 | `market/shell/packages/dsh-web-files/package.json` → `market/shell/packages/dsh-web-files/cordis.patch.yml` | See package docs |
| [dsh-ouroboros](https://github.com/Q00/ouroboros)<br><sub>Q00/ouroboros</sub> | Long-running | 5657 | MIT | `integrations/dsh-plugin/package.json` → `integrations/dsh-plugin/cordis.patch.yml` | See package docs |
| [deepseek-idesign](https://github.com/Devin-AXIS/iPolloWork)<br><sub>Devin-AXIS/iPolloWork</sub> | Other | 4774 | NOASSERTION | `external-plugins/deepseek-harness/design-studio/package.json` → `external-plugins/deepseek-harness/design-studio/cordis.patch.yml` | See package docs |
| [@petdex/dsh-plugin](https://github.com/crafter-station/petdex)<br><sub>crafter-station/petdex</sub> | Other | 3974 | MIT | `packages/petdex-desktop-native/integrations/dsh/package.json` → `packages/petdex-desktop-native/integrations/dsh/cordis.patch.yml` | See package docs |
| [@liustack/modlens](https://github.com/liustack/modlens)<br><sub>liustack/modlens</sub> | MCP Bridge | 3644 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:liustack/modlens` |
| [@struktoai/mirage-dsh](https://github.com/strukto-ai/mirage)<br><sub>strukto-ai/mirage</sub> | Other | 3563 | Apache-2.0 | `typescript/packages/dsh/package.json` → `typescript/packages/dsh/cordis.patch.yml` | See package docs |
| [@agentscope-ai/reme](https://github.com/agentscope-ai/ReMe)<br><sub>agentscope-ai/ReMe</sub> | Memory | 3344 | Apache-2.0 | `packages/typescript/package.json` → `packages/typescript/dsh/cordis.patch.yml` | See package docs |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<br><sub>omdsh-dev/DSH-better-sidebar</sub> | UI / TUI | 2861 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [dsh-codex-taskboard](https://github.com/chuspeeism/dashi-taskboard)<br><sub>chuspeeism/dashi-taskboard</sub> | Other | 2541 | Apache-2.0 | `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` | See package docs |
| [@deepseek-harness-tui/dsh-tui](https://github.com/ccch1mneyyy/dsh-TUI)<br><sub>ccch1mneyyy/dsh-TUI</sub> | UI / TUI | 2511 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ccch1mneyyy/dsh-TUI` |
| [@zilliz/memsearch-dsh](https://github.com/zilliztech/memsearch)<br><sub>zilliztech/memsearch</sub> | Memory | 2503 | MIT | `plugins/dsh/package.json` → `plugins/dsh/cordis.patch.yml` | See package docs |
| [dshmarket](https://github.com/dsh-market/dsh-market)<br><sub>dsh-market/dsh-market</sub> | Finance | 2299 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:dsh-market/dsh-market` |
| [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<br><sub>Small-tailqwq/dsh-deep-whale</sub> | UI / TUI | 1696 | — | `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` | See package docs |
| [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill)<br><sub>Tencent/BrowserSkill</sub> | Browser | 1310 | MIT | `packages/dsh-plugin-browserskill/package.json` → `packages/dsh-plugin-browserskill/cordis.patch.yml` | See package docs |
| [@mem9/dsh-plugin](https://github.com/mem9-ai/mem9)<br><sub>mem9-ai/mem9</sub> | Memory | 1199 | Apache-2.0 | `dsh-plugin/package.json` → `dsh-plugin/cordis.patch.yml` | See package docs |
| [aegis](https://github.com/GanyuanRan/Aegis)<br><sub>GanyuanRan/Aegis</sub> | Coding | 1129 | MIT | `package.json` → `extensions/dsh/cordis.patch.yml` | `dsh plugin --profile web add github:GanyuanRan/Aegis` |
| [@open-pets/dsh](https://github.com/alvinunreal/openpets)<br><sub>alvinunreal/openpets</sub> | Coding | 1115 | MIT | `packages/dsh/package.json` → `packages/dsh/cordis.patch.yml` | See package docs |
| [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq)<br><sub>agentrq/agentrq</sub> | Long-running | 1088 | Apache-2.0 | `plugins/deepseek-harness/package.json` → `plugins/deepseek-harness/cordis.patch.yml` | See package docs |
| [dsh-context](https://github.com/bowenliang123/dsh-context)<br><sub>bowenliang123/dsh-context</sub> | Browser | 1018 | Apache-2.0 | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:bowenliang123/dsh-context` |
| [@nanmicoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<br><sub>NanmiCoder/dsh-agent-teams</sub> | Long-running | 980 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router)<br><sub>ysr666/dsh-vision-router</sub> | Model & Routing | 969 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ysr666/dsh-vision-router` |
| [dsh-whale-widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)<br><sub>MeteorNOX/DeepSeek-Balance-Whale-Widget</sub> | Other | 934 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:MeteorNOX/DeepSeek-Balance-Whale-Widget` |

The homepage shows the top 30 repositories once each; multi-bundle repositories and all records remain in [data/plugins.json](data/plugins.json). Snapshot: 2026-08-25T08:59:38.471Z.
<!-- RADAR:END -->

The full machine-readable records live in [`data/plugins.json`](data/plugins.json). Topic-tagged repositories that do not yet pass bundle verification remain visible in [`data/candidates.json`](data/candidates.json); they are never silently presented as installable plugins.

## Capability Port Score

This second radar finds public `SKILL.md` candidates from Claude, Codex, shared `.agents`, OpenClaw, and SkillHub-oriented searches. It does not copy or republish their instructions. Each record pins the repository commit, file path, Git blob, content SHA-256, observed license source, and line-level adaptation signals before assigning one evidence-backed path:

- `copy`: self-contained instructions with no observed runtime, bundled-resource, executable, or permission dependency;
- `wrapper`: instructions that need a command, bundled resource, network, secret, write, or shell adapter;
- `bridge`: a harness hook, plugin protocol, or runtime-specific configuration must be translated;
- `unclassified`: required identity evidence is missing.

<!-- CAPABILITIES:START -->
**49** revision-pinned candidates: Copy 15 · Wrapper 30 · Bridge 2 · Unclassified 2

| Capability | Source | Port path | Score | License | Pinned evidence |
|---|---|---:|---:|---|---|
| [code-conventions](https://github.com/iflytek/skillhub/blob/d2403bb5911953b8f53e62c3f0a9edc291363944/.agents/skills/code-conventions/SKILL.md)<br><sub>iflytek/skillhub:.agents/skills/code-conventions/SKILL.md</sub> | agents | copy | 100/100 | Apache-2.0 | <code>d2403bb59119</code> / <code>2add2e311e6c</code> |
| [fix](https://github.com/motiondivision/motion/blob/adaf7a4e5368d704ea350669f6ac674fb26ff270/.agents/skills/fix/SKILL.md)<br><sub>motiondivision/motion:.agents/skills/fix/SKILL.md</sub> | agents | copy | 95/100 | MIT | <code>adaf7a4e5368</code> / <code>a00ab8442e03</code> |
| [fix-pr](https://github.com/questdb/questdb/blob/6610ab113b84528a73388b0722a38b97f9df78c2/.codex/skills/fix-pr/SKILL.md)<br><sub>questdb/questdb:.codex/skills/fix-pr/SKILL.md</sub> | codex | copy | 95/100 | Apache-2.0 | <code>6610ab113b84</code> / <code>e2293795c80c</code> |
| [pr](https://github.com/GetStream/Vision-Agents/blob/3a8eec104f90ad3dbf76069ab99b40bac577f41b/.claude/skills/pr/SKILL.md)<br><sub>GetStream/Vision-Agents:.claude/skills/pr/SKILL.md</sub> | claude | copy | 95/100 | Apache-2.0 | <code>3a8eec104f90</code> / <code>85f841bbc968</code> |
| [review](https://github.com/ailyProject/aily-blockly/blob/03989eedeae06c95ad9fbe31472db2091bb7ac10/.codex/skills/review/SKILL.md)<br><sub>ailyProject/aily-blockly:.codex/skills/review/SKILL.md</sub> | codex | copy | 95/100 | GPL-3.0 | <code>03989eedeae0</code> / <code>c417789bb49b</code> |
| [seo](https://github.com/gridaco/grida/blob/5909675470e89f793becbd6d556c56485bcef7f9/.agents/skills/seo/SKILL.md)<br><sub>gridaco/grida:.agents/skills/seo/SKILL.md</sub> | agents | copy | 95/100 | Apache-2.0 | <code>5909675470e8</code> / <code>51350f506838</code> |
| [pr](https://github.com/meshtastic/Meshtastic-Android/blob/42b07b22d7f2ed10d0ecc876796d8102d27631e6/.claude/skills/pr/SKILL.md)<br><sub>meshtastic/Meshtastic-Android:.claude/skills/pr/SKILL.md</sub> | claude | copy | 95/100 | GPL-3.0 | <code>42b07b22d7f2</code> / <code>7a332c807d86</code> |
| [qa](https://github.com/wp-media/wp-rocket/blob/d103284e1931f34e8c078ad92dbb1c6912e3cfed/.claude/skills/qa/SKILL.md)<br><sub>wp-media/wp-rocket:.claude/skills/qa/SKILL.md</sub> | claude | copy | 95/100 | GPL-2.0 | <code>d103284e1931</code> / <code>dc958f2e1d97</code> |
| [pr](https://github.com/woocommerce/woocommerce-ios/blob/8193985dbb9e1e05b3f0720fdff3b90ff1f658ea/.claude/skills/pr/SKILL.md)<br><sub>woocommerce/woocommerce-ios:.claude/skills/pr/SKILL.md</sub> | claude | copy | 95/100 | GPL-2.0 | <code>8193985dbb9e</code> / <code>f075eba0d630</code> |
| [zod](https://github.com/hashintel/hash/blob/840ac684fbbad14fe07a8b27389cd90ad5210938/.codex/skills/zod/SKILL.md)<br><sub>hashintel/hash:.codex/skills/zod/SKILL.md</sub> | codex | copy | 90/100 | AGPL-3.0 | <code>840ac684fbba</code> / <code>a117ffc26060</code> |
| [jna](https://github.com/JetBrains/intellij-community/blob/d698802bc0c02ef5816678a219f9fb3d158b6ee1/.agents/skills/jna/SKILL.md)<br><sub>JetBrains/intellij-community:.agents/skills/jna/SKILL.md</sub> | agents | copy | 85/100 | — | <code>d698802bc0c0</code> / <code>a27c2e6d5151</code> |
| [s](https://github.com/RyanCodrai/turbovec/blob/8202f194a0cbbd52213a004290401e180e5c123d/.claude/skills/s/SKILL.md)<br><sub>RyanCodrai/turbovec:.claude/skills/s/SKILL.md</sub> | claude | copy | 85/100 | MIT | <code>8202f194a0cb</code> / <code>97d5d955a57a</code> |
| [pr](https://github.com/liferay/liferay-portal/blob/4210365ab97e95a46106e7807dcb07199084dc60/.claude/skills/pr/SKILL.md)<br><sub>liferay/liferay-portal:.claude/skills/pr/SKILL.md</sub> | claude | copy | 85/100 | — | <code>4210365ab97e</code> / <code>3e71624f776d</code> |
| [go](https://github.com/nevalang/neva/blob/bb7b3301b461c1d6ad8bc0199d51b6c4437855c3/.codex/skills/go/SKILL.md)<br><sub>nevalang/neva:.codex/skills/go/SKILL.md</sub> | codex | copy | 85/100 | MIT | <code>bb7b3301b461</code> / <code>675bccd70ae5</code> |
| [pr](https://github.com/EverMind-AI/EverOS/blob/b078f72138ebd0148de5a24c4ce0283e2ebde8b7/.claude/skills/pr/SKILL.md)<br><sub>EverMind-AI/EverOS:.claude/skills/pr/SKILL.md</sub> | claude | wrapper | 79/100 | Apache-2.0 | <code>b078f72138eb</code> / <code>d24a3217df00</code> |

Full records, score components, and line-level signals live in [data/capabilities.json](data/capabilities.json). Snapshot: 2026-08-13T22:47:12.754Z. The score measures only observed adaptation effort; it is not compatibility, safety, quality, or license clearance.
<!-- CAPABILITIES:END -->

## Search from the terminal

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
npx github:dongsheng123132/awesome-dsh-plugins runtime skillport
npx github:dongsheng123132/awesome-dsh-plugins risk process-execution
npx github:dongsheng123132/awesome-dsh-plugins ports cad
```

The CLI reads the committed snapshot, so normal searches do not require a GitHub token.

## Static review signals

The radar also reads each verified bundle's patch and runtime dependencies, flagging review signals for secret-bearing configuration, process execution, filesystem access, network/browser access, MCP external tooling, and Web client extensions. In the first pass, 163 of 488 bundles matched at least one signal. Each signal retains `patch` or `dependencies` as its evidence source and exists only to prioritize human review; it is **not a vulnerability finding or security certification**. Full records live in [`data/plugins.json`](data/plugins.json), and `risk [signal]` exposes them from the CLI.

## Runtime compatibility layer

`Verified Bundle` proves only that a repository has both a `dsh.bundle.patch` declaration and the referenced patch file. Runtime evidence is deliberately separate in [`data/runtime-compat.json`](data/runtime-compat.json): each report pins the exact DSH commit and Node runtime, installs into a fresh temporary profile, composes the patch stack, then boots the real Web profile until DSH prints its readiness URL.

The first audit already demonstrates why the split matters. `@dsh-skillport/bundle` was not available from npm at audit time, so the documented registry install failed. The same source commit, after a local build, installed, composed, and reached a real DSH Web readiness URL on Node 24.19.0 against a previously built DSH `47f943859bef` checkout. A clean detached DSH checkout installed and composed the plugin but was blocked by missing DSH Web client bundles; rebuilding that checkout then failed earlier in DSH's own build (`tsdown` could not import `unrun`). The evidence therefore supports compatibility with the built checkout, not yet a clean-source reproducibility claim. A Node 22.14 attempt is separately retained as `blocked-environment` because it does not satisfy DSH's declared engine floor.

The next layer is now machine-scheduled: [`data/runtime-targets.json`](data/runtime-targets.json) pins two named DSH baselines (the pre-0.1.1 compatibility anchor and official `dsh-v0.1.1-rc.2`), four observed community plugin commits and one required 2Origin positive control. [The runtime compatibility matrix](.github/workflows/runtime-compat.yml) builds the complete baseline × OS × package product, boots each stock DSH Web baseline first as the instrument's positive control, then installs, composes and boots every tuple in a fresh `DSH_HOME`. Baseline IDs, immutable revisions, report paths, cache keys and artifact names remain distinct, so evidence from an upgrade cannot overwrite the anchor. Baseline lifecycle scripts are governed by each pinned DSH commit's own fail-closed `strictDepBuilds` and reviewed `allowBuilds` policy; plugin lifecycle builds are allowed only for the one pinned package named by the target. Reports also resolve the installed package's declared entrypoint and classify a missing built file as `package-artifact-missing`, keeping source-packaging gaps separate from Harness boot failures. Each run uploads a create-only, content-addressed report, after removing credential-shaped and CI-control environment variables. A valid negative report from an `observe` target records ecosystem compatibility without making the instrument itself red; a `required` target must pass, and missing or malformed evidence always fails. Passing proves only compatibility with the named tuple; it is not a safety certification.

Run a reproducible check:

```bash
node scripts/runtime-verify.mjs --spec <package-or-built-checkout> \
  --dsh-repo /path/to/deepseek-harness \
  --node /path/to/node-24 \
  --record data/runtime-compat.json
```

## 2Origin plugin lab

<!-- LABS:START -->
| Project | Status | Category | Problem | Evidence |
|---|---|---|---|---|
| [dsh-switch](https://github.com/dongsheng123132/dsh-switch) | **verified** | Model & Routing | Evidence-first provider health probes and optimistic-lock model switching for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-switch/tree/42db01a1f873753e90699f6281094040acca04e6), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-switch/actions/runs/31733424075), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-cost](https://github.com/dongsheng123132/dsh-cost) | **verified** | Token & Cost | Durable usage-cost ledger with explicit evidence gaps, fail-closed budget checks, bounded sanitized MCP rows, a formal Codex manifest, real DSH ToolRuntime calls and stock Web Loader boot proof. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-cost/tree/849d81509b334b42ddd8032cd8f5377758fc34c3), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-cost/actions/runs/31807932538), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-2origin](https://github.com/dongsheng123132/dsh-2origin) | **verified** | Memory | Integrity-checked 2Origin state projection, semantic diff and optimistic-lock immutable freeze with a formal Codex manifest, proof-only MCP, real DSH ToolRuntime calls and stock Web Loader boot proof. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-2origin/tree/f2d0b362611bdc82463380471f001e4bcce59597), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-2origin/actions/runs/31827357607), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-cad-review](https://github.com/dongsheng123132/dsh-cad-review) | **verified** | CAD / Engineering | Source-hashed ASCII DXF inspection and deterministic rule review with entity/layer/line/coordinate evidence, redacted drawing text, proof-only MCP and verified stock Web-profile loading. | [Immutable plugin source, MCP, DSH runtime and stock Web loader smoke commands](https://github.com/dongsheng123132/dsh-cad-review/tree/b2ecef56a9c0d50d870134bbc4caacb598594b1f), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-cad-review/actions/runs/32434425650), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-release-proof](https://github.com/dongsheng123132/dsh-release-proof) | **verified** | Release Engineering | Reproducible multi-source release evidence with anonymous bounded HTTP checks, deterministic content addressing, a formal Codex manifest, inline proof-only MCP, real DSH ToolRuntime calls and stock Web Loader boot proof. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-release-proof/tree/67b233ae720738f89a8933eeba2d620a188b784e), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-release-proof/actions/runs/31836421539), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-benchmark](https://github.com/dongsheng123132/dsh-benchmark) | **verified** | Benchmarking | Manifest-fixed deterministic command/JSONL benchmarks with revision fingerprints, bounded raw measurements without business output, versioned scoring, proof-only MCP, real DSH ToolRuntime calls and stock Web Loader boot proof. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-benchmark/tree/3c2eedee2ee3cdb26975744bb826a7321288a4d1), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-benchmark/actions/runs/31868994202), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-lineage](https://github.com/dongsheng123132/dsh-lineage) | **verified** | Provenance & Lineage | Append-only content-addressed artifact/fact/action/report lineage with DAG checks, missing/stale disclosure, verified closure reports, proof-only MCP, real DSH ToolRuntime smoke and stock Web Loader boot. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-lineage/tree/bb9932ef5c2533c00697a27825109f1590217453), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-lineage/actions/runs/31874116647), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-recovery-proof](https://github.com/dongsheng123132/dsh-recovery-proof) | **verified** | Recovery Evidence | Read-only recovery drill evidence for object freshness, exact stages, RTO, failed-apply rollback and stale-plan rejection, with proof-only MCP, real DSH ToolRuntime smoke and stock Web Loader boot. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-recovery-proof/tree/7ecd2bc72663507b9f3d71bfd28378d0c9145d61), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-recovery-proof/actions/runs/32334603570), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-action-parity](https://github.com/dongsheng123132/dsh-action-parity) | **verified** | Action Parity | Content-addressed CLI, MCP and GUI bindings plus deterministic replay evidence for one stable Action ID and action core; formal Codex bundle, proof-only MCP, real DSH ToolRuntime calls and stock Web Loader boot are verified. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-action-parity/tree/33eb4e6cab585d2fbc3a6e53170df91144b5d5da), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-action-parity/actions/runs/32343259659), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-narrative-ledger](https://github.com/dongsheng123132/dsh-narrative-ledger) | **verified** | Writing / Novel | Content-addressed canon, immutable fact lifecycle, timeline continuity and spoiler-safe knowledge projections; v0.2 adds verified stock Web loading and a proof-only inline MCP surface without manuscript prose. | [Immutable plugin source, MCP, DSH runtime and stock Web loader smoke commands](https://github.com/dongsheng123132/dsh-narrative-ledger/tree/21851f7f0b7fc33a3a34d4f08ef8034124117867), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-narrative-ledger/actions/runs/32435395343), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-capability-receipt](https://github.com/dongsheng123132/dsh-capability-receipt) | **verified** | Provenance & Lineage | Content-addressed evidence for the effective skill body and bounded resource closure actually loaded by DSH, with pack-agent lock verification, a proof-only MCP surface, and verified stock Web-profile loading. | [Immutable plugin source, MCP, DSH runtime and stock Web loader smoke commands](https://github.com/dongsheng123132/dsh-capability-receipt/tree/53fe2a117909c17be7996c7eadfea330897398c2), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-capability-receipt/actions/runs/32396265896), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a), [Pinned pack-agent lock and hashing contract](https://github.com/sakikoTGW/pack-agent/tree/e2db1f8f56b74b64597a01175c810358f2c0b450) |
| [dsh-policy-drift-proof](https://github.com/dongsheng123132/dsh-policy-drift-proof) | **verified** | policy-governance | Pinned baseline/observed policy snapshots with value-redacted weakening, tightening, exact and fail-closed unclassified drift evidence; proof-only Codex MCP, real DSH ToolRuntime calls and stock Web Loader boot are verified. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-policy-drift-proof/tree/3d9c66f23dd9cfb47855a9823eb5dd09a3afa7fc), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-policy-drift-proof/actions/runs/32362309630), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-audit-bundle](https://github.com/dongsheng123132/dsh-audit-bundle) | **verified** | audit-evidence | Pinned multi-producer evidence with subject/revision binding, value-hash assertions, control coverage, independence thresholds and a body-free Merkle index; formal proof-only Codex MCP, real DSH ToolRuntime calls and stock Web Loader boot are verified. | [Immutable plugin source, proof-only MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-audit-bundle/tree/e69b94060bca8e0f756f92455a7a046f12dbf523), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-audit-bundle/actions/runs/32352651743), [DSH revision used for local and fixed-commit GitHub Web profile installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-profile-lock-proof](https://github.com/dongsheng123132/dsh-profile-lock-proof) | **verified** | supply-chain-evidence | Content-addressed closure proof across a DSH profile declaration, pnpm importer, installed package identities and bundle patch hashes, with immutable-source and lifecycle-script checks; v0.2.0 adds host-neutral ToolDefinitions, proof-only inline MCP and real stock Web Loader coverage. | [Immutable v0.2.0 source, proof-only MCP, installed-entry ToolRuntime and stock Web Loader smoke](https://github.com/dongsheng123132/dsh-profile-lock-proof/tree/503407c6537791f2fa2a060fd8d126535538e977), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-profile-lock-proof/actions/runs/32372938842), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-surface-contract-proof](https://github.com/dongsheng123132/dsh-surface-contract-proof) | **verified** | contract-evidence | Offline baseline/observed conformance proof that ToolRuntime, MCP JSON-RPC and CLI JSON recordings preserve schema versions, success/error/exit mappings, conflict/confirmation, ordering and result digests; v0.2.0 adds host-neutral ToolDefinitions, proof-only inline MCP and real stock Web Loader coverage. | [Immutable v0.2.0 source, proof-only MCP, installed-entry ToolRuntime and stock Web Loader smoke](https://github.com/dongsheng123132/dsh-surface-contract-proof/tree/a959e3877062c9260c4093980e4f1c7bf05eeb41), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-surface-contract-proof/actions/runs/32384822336), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-windows-readiness-proof](https://github.com/dongsheng123132/dsh-windows-readiness-proof) | **verified** | windows-enterprise-evidence | Pinned sanitized managed-Windows readiness evidence for DSH runtime, policy posture, filesystem/ACL, non-interactive service, storage and opaque connectivity controls; v0.1.1 also proves the namespace plugin through a real stock Web Loader boot without host collection or remediation. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-windows-readiness-proof/tree/291151da48ac229143e1f4e39ee608b856ded3e2), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-windows-readiness-proof/actions/runs/31799057295), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-config-origin-proof](https://github.com/dongsheng123132/dsh-config-origin-proof) | **verified** | configuration-evidence | Value-redacted configuration-source precedence receipts with winner, shadowed-source and unobserved-higher-priority evidence, plus proof-only MCP and verified stock Web loading. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-config-origin-proof/tree/0dbc4878fe187de130e310afa6e60fb0a46a6362), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-config-origin-proof/actions/runs/32442473912), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-schema-migration-proof](https://github.com/dongsheng123132/dsh-schema-migration-proof) | **verified** | migration-evidence | Revision-bound schema migration fixture evidence for idempotence, rollback, required invariants and explicit loss disclosure, with proof-only MCP and verified stock Web loading. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-schema-migration-proof/tree/77fd665831654c16628af9398afc3ea3f59a83df), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-schema-migration-proof/actions/runs/32449658428), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-loader-settlement-proof](https://github.com/dongsheng123132/dsh-loader-settlement-proof) | **verified** | runtime-evidence | Revision-bound, body-free DSH Loader settlement receipts for ordered declaration/resolution/loading/activation, injection closure and registered tool schema digests, with proof-only MCP and verified stock Web loading. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-loader-settlement-proof/tree/36d6c5cf78c7ae8c05ef26d902b21ba328bc0f78), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-loader-settlement-proof/actions/runs/32457616648), [DSH revision used for isolated profile install and runtime smoke](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-decision-effect-proof](https://github.com/dongsheng123132/dsh-decision-effect-proof) | **verified** | authorization-evidence | Body-free, content-addressed reconciliation of recorded DSH authorization decisions and effect envelopes: request/state/policy binding, confirmation, denied-effect absence, settlement, replay and ordering checks without granting authority or executing actions. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-decision-effect-proof/tree/42fc63a8a0ab65be5ff03306b96e3d585365327d), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-decision-effect-proof/actions/runs/32466988649), [DSH revision used for isolated path and fixed-commit GitHub installs](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-output-custody-proof](https://github.com/dongsheng123132/dsh-output-custody-proof) | **verified** | output-evidence | Body-free, content-addressed custody proof across formatted DSH tool results, model-visible or durable-only projections, full spill references and durable events, with byte budgets, exact omission, stage order and upstream-incompleteness disclosure. | [Immutable plugin source, MCP, DSH ToolRuntime and stock Web Loader smoke commands](https://github.com/dongsheng123132/dsh-output-custody-proof/tree/38d774be7734500ebc25e83890290c4c6b5fcc4f), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-output-custody-proof/actions/runs/32476712917), [DSH 0.1.1-rc.1 revision used for source build, isolated path and fixed-commit GitHub installs](https://github.com/deepseek-ai/deepseek-harness/commit/528c682e061696f5a160f363f236ecbf53cbd006) |
<!-- LABS:END -->

Lab status is evidence-gated:

- `planned`: problem and acceptance target exist, but there is no runnable repository.
- `experimental`: a runnable repository exists; compatibility is not yet demonstrated.
- `verified`: installation and a declared smoke test were observed against a named DSH revision.
- `deprecated`: the experiment is no longer maintained.

Plugin runtime code stays in separate repositories. This repository owns discovery, evidence, comparison, and experiment status—not a monolithic plugin implementation.

## Automation

Every four hours, the scheduled workflow scans the public [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic, inspects package manifests, patch paths, and static review signals, regenerates the radar, runs checks, and opens or updates a reviewable pull request. Expensive runtime verification is triggered only for high-value candidates or changed revisions rather than blindly rerunning the entire matrix every four hours. It does not auto-merge ecosystem claims into `main`.

Local update:

```bash
GITHUB_TOKEN=github_token npm run update-radar
```

Anonymous API access also works for small scans:

```bash
npm run discover -- --limit 25
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding the `dsh-plugin` topic helps discovery, but verification still depends on the bundle manifest and patch file.

## Disclaimer

This is an independent community project and is not an official DeepSeek endorsement. Installing a third-party plugin executes code and may change the agent's tools, prompts, permissions, UI, or data access. Review source, dependencies, license, permissions, and maintenance state before installation.

MIT © 2026 hfshfg

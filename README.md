# Awesome DSH Plugins

> Evidence-backed DeepSeek Harness plugin radar + the 2Origin plugin lab.

[中文](README.zh-CN.md) · [Official DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) · [Plugin topic](https://github.com/topics/dsh-plugin)

This repository deliberately distinguishes a repository that mentions DSH from an installable DSH profile bundle. A plugin receives the **Verified Bundle** mark only when the scanner finds both:

1. a `package.json` declaration at `dsh.bundle.patch`; and
2. the declared patch file in the same Git tree.

This is structural verification, not a security audit or a promise that the plugin works with today's DSH main branch.
Categories are heuristic navigation aids; manifest and patch evidence, not the category label, determines verification.

## Radar

<!-- RADAR:START -->
**488** verified bundles / **666** topic repositories examined / **666** reported by GitHub

Other: 185 · UI / TUI: 91 · MCP Bridge: 34 · Model & Routing: 26 · Developer Tools: 24 · Token & Cost: 24 · Coding: 23 · Browser: 22 · Memory: 18 · Long-running: 15 · Security: 13 · Office: 7 · Finance: 4 · Research: 2

| Plugin | Category | Stars | License | Evidence | Install |
|---|---:|---:|---|---|---|
| [@liustack/modlens](https://github.com/liustack/modlens)<br><sub>liustack/modlens</sub> | MCP Bridge | 703 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:liustack/modlens` |
| [@linxin666/dsh-client-ui-aionui-panel](https://github.com/zhu1090093659/dsh-web-ui)<br><sub>zhu1090093659/dsh-web-ui</sub> | UI / TUI | 508 | — | `packages/dsh-aionui-panel/package.json` → `packages/dsh-aionui-panel/cordis.patch.yml` | See package docs |
| [dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui)<br><sub>ccch1mneyyy/dsh-cc-tui</sub> | UI / TUI | 198 | BSD-3-Clause | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ccch1mneyyy/dsh-cc-tui` |
| [@dsh-external/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit)<br><sub>Anionex/dsh-vision-toolkit</sub> | UI / TUI | 152 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-vision-toolkit` |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<br><sub>omdsh-dev/DSH-better-sidebar</sub> | UI / TUI | 127 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<br><sub>Small-tailqwq/dsh-deep-whale</sub> | UI / TUI | 119 | — | `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` | See package docs |
| [@dsh-external/dsh-ads](https://github.com/Nagi-ovo/dsh-ads)<br><sub>Nagi-ovo/dsh-ads</sub> | UI / TUI | 105 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [@huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui)<br><sub>huiliyi37/dsh-tianshu-tui</sub> | UI / TUI | 73 | Apache-2.0 | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<br><sub>NanmiCoder/dsh-agent-teams</sub> | Long-running | 72 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [@taxueseek/argo-dsh](https://github.com/taxueseek/argo)<br><sub>taxueseek/argo</sub> | MCP Bridge | 56 | MIT | `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` | See package docs |
| [@mstar-harness/dsh](https://github.com/btspoony/mstar-harness)<br><sub>btspoony/mstar-harness</sub> | Long-running | 39 | MIT | `packages/dsh/package.json` → `packages/dsh/bundle/cordis.patch.yml` | See package docs |
| [@dsh-external/workflow](https://github.com/icetomoyo/dsh_workflow)<br><sub>icetomoyo/dsh_workflow</sub> | Long-running | 35 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:icetomoyo/dsh_workflow` |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode)<br><sub>omdsh-dev/dsh-open-in-vscode</sub> | Other | 33 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` |
| [@zseven-w/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil)<br><sub>ZSeven-W/dsh-openpencil</sub> | Other | 33 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ZSeven-W/dsh-openpencil` |
| [@dsh-external/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize)<br><sub>Nagi-ovo/dsh-visualize</sub> | UI / TUI | 30 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` |
| [whale-girl](https://github.com/vlln/whale-girl)<br><sub>vlln/whale-girl</sub> | Other | 27 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:vlln/whale-girl` |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file)<br><sub>omdsh-dev/dsh-at-file</sub> | Other | 25 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-at-file` |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification)<br><sub>omdsh-dev/dsh-notification</sub> | Browser | 25 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-notification` |
| [@dsh-external/turn-rewind](https://github.com/Anionex/dsh-turn-rewind)<br><sub>Anionex/dsh-turn-rewind</sub> | Other | 23 | BSD-3-Clause | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-turn-rewind` |
| [dsh-ui-status-label](https://github.com/alingalingling/ui-status-label)<br><sub>alingalingling/ui-status-label</sub> | Model & Routing | 21 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:alingalingling/ui-status-label` |
| [@omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation)<br><sub>omdsh-dev/dsh-annotation</sub> | Other | 18 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-annotation` |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool)<br><sub>omdsh-dev/dsh-custom-tool</sub> | UI / TUI | 18 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-custom-tool` |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect)<br><sub>Chinesezjc/dsh-interconnect</sub> | MCP Bridge | 15 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Chinesezjc/dsh-interconnect` |
| [@omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui)<br><sub>omdsh-dev/dsh-genui</sub> | Browser | 14 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` |
| [@dsh-external/plugin-console](https://github.com/vlln/plugin-registry)<br><sub>vlln/plugin-registry</sub> | UI / TUI | 13 | MIT | `packages/plugin/console/package.json` → `packages/plugin/console/cordis.patch.yml` | See package docs |
| [@dsh-external/dsh-computer-use](https://github.com/Anionex/dsh-computer-use)<br><sub>Anionex/dsh-computer-use</sub> | Other | 12 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-computer-use` |
| [@loserfox/distill](https://github.com/LoserFox/distill)<br><sub>LoserFox/distill</sub> | Other | 12 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:LoserFox/distill` |
| [@dsh-external/dsh-share](https://github.com/hellodigua/dsh-share)<br><sub>hellodigua/dsh-share</sub> | Other | 11 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:hellodigua/dsh-share` |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit)<br><sub>Moeblack/dsh-message-edit</sub> | Other | 11 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Moeblack/dsh-message-edit` |
| [@deepseek-ai/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)<br><sub>omdsh-dev/dsh-plugin-check</sub> | Other | 11 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-plugin-check` |

The homepage shows the top 30 repositories once each; multi-bundle repositories and all records remain in [data/plugins.json](data/plugins.json). Snapshot: 2026-08-13T21:32:46.503Z.
<!-- RADAR:END -->

The full machine-readable records live in [`data/plugins.json`](data/plugins.json). Topic-tagged repositories that do not yet pass bundle verification remain visible in [`data/candidates.json`](data/candidates.json); they are never silently presented as installable plugins.

## Search from the terminal

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
npx github:dongsheng123132/awesome-dsh-plugins runtime skillport
npx github:dongsheng123132/awesome-dsh-plugins risk process-execution
```

The CLI reads the committed snapshot, so normal searches do not require a GitHub token.

## Static review signals

The radar also reads each verified bundle's patch and runtime dependencies, flagging review signals for secret-bearing configuration, process execution, filesystem access, network/browser access, MCP external tooling, and Web client extensions. In the first pass, 163 of 488 bundles matched at least one signal. Each signal retains `patch` or `dependencies` as its evidence source and exists only to prioritize human review; it is **not a vulnerability finding or security certification**. Full records live in [`data/plugins.json`](data/plugins.json), and `risk [signal]` exposes them from the CLI.

## Runtime compatibility layer

`Verified Bundle` proves only that a repository has both a `dsh.bundle.patch` declaration and the referenced patch file. Runtime evidence is deliberately separate in [`data/runtime-compat.json`](data/runtime-compat.json): each report pins the exact DSH commit and Node runtime, installs into a fresh temporary profile, composes the patch stack, then boots the real Web profile until DSH prints its readiness URL.

The first audit already demonstrates why the split matters. `@dsh-skillport/bundle` was not available from npm at audit time, so the documented registry install failed. The same source commit, after a local build, installed, composed, and reached a real DSH Web readiness URL on Node 24.19.0 against a previously built DSH `47f943859bef` checkout. A clean detached DSH checkout installed and composed the plugin but was blocked by missing DSH Web client bundles; rebuilding that checkout then failed earlier in DSH's own build (`tsdown` could not import `unrun`). The evidence therefore supports compatibility with the built checkout, not yet a clean-source reproducibility claim. A Node 22.14 attempt is separately retained as `blocked-environment` because it does not satisfy DSH's declared engine floor.

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
| [dsh-cost](https://github.com/dongsheng123132/dsh-cost) | **verified** | Token & Cost | Durable usage-cost ledger, explicit evidence gaps and fail-closed budget checks for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-cost/tree/82b41f21a66f71ee44042d2ea9d3fe64419c4a2d), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-cost/actions/runs/31733968794), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-2origin](https://github.com/dongsheng123132/dsh-2origin) | **verified** | Memory | Integrity-checked 2Origin state projection, semantic diff and optimistic-lock immutable freeze for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-2origin/tree/40dca1937a21f3d82922ec41353dce4810e10f64), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-2origin/actions/runs/31745733515), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-cad-review](https://github.com/dongsheng123132/dsh-cad-review) | **verified** | CAD / Engineering | Source-hashed ASCII DXF inspection and deterministic rule review with entity, layer, line and coordinate evidence. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-cad-review/tree/69b808ecceb7eb98e4acb7d036a5ce8706fb43d9), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-cad-review/actions/runs/31748669218), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-release-proof](https://github.com/dongsheng123132/dsh-release-proof) | **verified** | Release Engineering | Reproducible multi-source release evidence for HTTP status, byte length, SHA-256 and version consistency. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-release-proof/tree/c78c861e9662f8e4adc76e0cb501bb83f4333a2a), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-release-proof/actions/runs/31749726816), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| `dsh-novel` | **planned** | Writing / Novel | Long-running story state with timeline, knowledge boundaries and contradiction checks. | None yet |
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

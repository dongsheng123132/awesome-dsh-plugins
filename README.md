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
**397** verified bundles / **546** topic repositories examined / **546** reported by GitHub

Other: 161 · UI / TUI: 70 · MCP Bridge: 24 · Model & Routing: 22 · Browser: 20 · Coding: 19 · Developer Tools: 19 · Token & Cost: 17 · Memory: 16 · Long-running: 10 · Security: 7 · Office: 5 · Finance: 4 · Research: 3

| Plugin | Category | Stars | License | Evidence | Install |
|---|---:|---:|---|---|---|
| [@liustack/modlens](https://github.com/liustack/modlens)<br><sub>liustack/modlens</sub> | Other | 688 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:liustack/modlens` |
| [@linxin666/dsh-client-ui-aionui-panel](https://github.com/zhu1090093659/dsh-web-ui)<br><sub>zhu1090093659/dsh-web-ui</sub> | UI / TUI | 469 | — | `packages/dsh-aionui-panel/package.json` → `packages/dsh-aionui-panel/cordis.patch.yml` | See package docs |
| [dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui)<br><sub>ccch1mneyyy/dsh-cc-tui</sub> | UI / TUI | 184 | BSD-3-Clause | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ccch1mneyyy/dsh-cc-tui` |
| [@dsh-external/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit)<br><sub>Anionex/dsh-vision-toolkit</sub> | UI / TUI | 142 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-vision-toolkit` |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<br><sub>omdsh-dev/DSH-better-sidebar</sub> | UI / TUI | 115 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<br><sub>Small-tailqwq/dsh-deep-whale</sub> | UI / TUI | 106 | — | `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` | See package docs |
| [@dsh-external/dsh-ads](https://github.com/Nagi-ovo/dsh-ads)<br><sub>Nagi-ovo/dsh-ads</sub> | Other | 96 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [@huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui)<br><sub>huiliyi37/dsh-tianshu-tui</sub> | UI / TUI | 73 | Apache-2.0 | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<br><sub>NanmiCoder/dsh-agent-teams</sub> | Long-running | 66 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [@taxueseek/argo-dsh](https://github.com/taxueseek/argo)<br><sub>taxueseek/argo</sub> | MCP Bridge | 56 | MIT | `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` | See package docs |
| [@mstar-harness/dsh](https://github.com/btspoony/mstar-harness)<br><sub>btspoony/mstar-harness</sub> | Other | 39 | MIT | `packages/dsh/package.json` → `packages/dsh/bundle/cordis.patch.yml` | See package docs |
| [@dsh-external/workflow](https://github.com/icetomoyo/dsh_workflow)<br><sub>icetomoyo/dsh_workflow</sub> | Long-running | 34 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:icetomoyo/dsh_workflow` |
| [dsh-open-in-vscode](https://github.com/omdsh-dev/dsh-open-in-vscode)<br><sub>omdsh-dev/dsh-open-in-vscode</sub> | Other | 34 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-open-in-vscode` |
| [@zseven-w/dsh-openpencil](https://github.com/ZSeven-W/dsh-openpencil)<br><sub>ZSeven-W/dsh-openpencil</sub> | Other | 33 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ZSeven-W/dsh-openpencil` |
| [@dsh-external/dsh-visualize](https://github.com/Nagi-ovo/dsh-visualize)<br><sub>Nagi-ovo/dsh-visualize</sub> | Other | 29 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Nagi-ovo/dsh-visualize` |
| [dsh-at-file](https://github.com/omdsh-dev/dsh-at-file)<br><sub>omdsh-dev/dsh-at-file</sub> | Other | 24 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-at-file` |
| [whale-girl](https://github.com/vlln/whale-girl)<br><sub>vlln/whale-girl</sub> | Other | 24 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:vlln/whale-girl` |
| [@dsh-external/turn-rewind](https://github.com/Anionex/dsh-turn-rewind)<br><sub>Anionex/dsh-turn-rewind</sub> | Other | 22 | BSD-3-Clause | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-turn-rewind` |
| [dsh-notification](https://github.com/omdsh-dev/dsh-notification)<br><sub>omdsh-dev/dsh-notification</sub> | Browser | 22 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-notification` |
| [dsh-ui-status-label](https://github.com/alingalingling/ui-status-label)<br><sub>alingalingling/ui-status-label</sub> | Model & Routing | 21 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:alingalingling/ui-status-label` |
| [dsh-custom-tool](https://github.com/omdsh-dev/dsh-custom-tool)<br><sub>omdsh-dev/dsh-custom-tool</sub> | UI / TUI | 18 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-custom-tool` |
| [@omdsh-dev/dsh-annotation](https://github.com/omdsh-dev/dsh-annotation)<br><sub>omdsh-dev/dsh-annotation</sub> | Other | 16 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-annotation` |
| [dsh-interconnect](https://github.com/Chinesezjc/dsh-interconnect)<br><sub>Chinesezjc/dsh-interconnect</sub> | MCP Bridge | 14 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Chinesezjc/dsh-interconnect` |
| [@omdsh-dev/dsh-genui](https://github.com/omdsh-dev/dsh-genui)<br><sub>omdsh-dev/dsh-genui</sub> | Browser | 14 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-genui` |
| [@dsh-external/dsh-computer-use](https://github.com/Anionex/dsh-computer-use)<br><sub>Anionex/dsh-computer-use</sub> | Other | 12 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-computer-use` |
| [@loserfox/distill](https://github.com/LoserFox/distill)<br><sub>LoserFox/distill</sub> | Other | 12 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:LoserFox/distill` |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit)<br><sub>Moeblack/dsh-message-edit</sub> | Other | 11 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Moeblack/dsh-message-edit` |
| [@dsh-external/dsh-share](https://github.com/hellodigua/dsh-share)<br><sub>hellodigua/dsh-share</sub> | Other | 10 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:hellodigua/dsh-share` |
| [@deepseek-ai/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)<br><sub>omdsh-dev/dsh-plugin-check</sub> | Other | 10 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-plugin-check` |
| [@deepseek-ai/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)<br><sub>omdsh-dev/dsh-toolkit</sub> | Developer Tools | 10 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-toolkit` |

The homepage shows the top 30 repositories once each; multi-bundle repositories and all records remain in [data/plugins.json](data/plugins.json). Snapshot: 2026-08-13T18:32:51.201Z.
<!-- RADAR:END -->

The full machine-readable records live in [`data/plugins.json`](data/plugins.json). Topic-tagged repositories that do not yet pass bundle verification remain visible in [`data/candidates.json`](data/candidates.json); they are never silently presented as installable plugins.

## Search from the terminal

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
npx github:dongsheng123132/awesome-dsh-plugins runtime skillport
```

The CLI reads the committed snapshot, so normal searches do not require a GitHub token.

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
| [dsh-switch](https://github.com/https://github.com/dongsheng123132/dsh-switch) | **verified** | Model & Routing | Evidence-first provider health probes and optimistic-lock model switching for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-switch/tree/42db01a1f873753e90699f6281094040acca04e6), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-switch/actions/runs/31733424075), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| `dsh-cost` | **planned** | Token & Cost | Cost, budget and per-project attribution above DSH token-meter events. | None yet |
| `dsh-2origin` | **planned** | Memory | Executable 2Origin state, projection, diff and freeze capabilities for DSH. | None yet |
| `dsh-cad-review` | **planned** | CAD / Engineering | Structured CAD evidence extraction and rule-backed drawing review. | None yet |
| `dsh-novel` | **planned** | Writing / Novel | Long-running story state with timeline, knowledge boundaries and contradiction checks. | None yet |
<!-- LABS:END -->

Lab status is evidence-gated:

- `planned`: problem and acceptance target exist, but there is no runnable repository.
- `experimental`: a runnable repository exists; compatibility is not yet demonstrated.
- `verified`: installation and a declared smoke test were observed against a named DSH revision.
- `deprecated`: the experiment is no longer maintained.

Plugin runtime code stays in separate repositories. This repository owns discovery, evidence, comparison, and experiment status—not a monolithic plugin implementation.

## Automation

The scheduled workflow scans the public [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic, inspects package manifests and patch paths, regenerates the radar, runs checks, and opens or updates a reviewable pull request. It does not auto-merge ecosystem claims into `main`.

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

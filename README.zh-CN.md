# Awesome DSH Plugins

> 有证据的 DeepSeek Harness 插件雷达 + 2Origin 自家插件实验室。

[English](README.md) · [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness) · [插件 Topic](https://github.com/topics/dsh-plugin)

本仓刻意区分“提到了 DSH 的仓库”和“DSH 真正能激活的 profile bundle”。扫描器只有同时找到下面两项，才授予 **Verified Bundle**：

1. `package.json` 中存在 `dsh.bundle.patch` 声明；
2. 同一 Git tree 中确实存在该声明指向的 patch 文件。

这是结构验证，不是安全审计，也不等于插件一定兼容今天的 DSH main 分支。
分类只是启发式导航；决定验证状态的是 manifest 与 patch 证据，不是分类标签。

## 插件雷达

<!-- RADAR:START -->
**397** 个 Verified Bundle / 检查 **546** 个 topic 仓库 / GitHub 报告总数 **546**

Other: 163 · UI / TUI: 70 · MCP Bridge: 26 · Model & Routing: 22 · Browser: 20 · Coding: 19 · Token & Cost: 17 · Memory: 16 · Developer Tools: 15 · Long-running: 10 · Security: 7 · Office: 5 · Finance: 4 · Research: 3

| 插件 | 分类 | Stars | License | 证据 | 安装 |
|---|---:|---:|---|---|---|
| [@liustack/modlens](https://github.com/liustack/modlens)<br><sub>liustack/modlens</sub> | Other | 688 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:liustack/modlens` |
| [@linxin666/dsh-client-ui-aionui-panel](https://github.com/zhu1090093659/dsh-web-ui)<br><sub>zhu1090093659/dsh-web-ui</sub> | UI / TUI | 469 | — | `packages/dsh-aionui-panel/package.json` → `packages/dsh-aionui-panel/cordis.patch.yml` | 需看包说明 |
| [dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui)<br><sub>ccch1mneyyy/dsh-cc-tui</sub> | UI / TUI | 184 | BSD-3-Clause | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ccch1mneyyy/dsh-cc-tui` |
| [@dsh-external/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit)<br><sub>Anionex/dsh-vision-toolkit</sub> | UI / TUI | 142 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-vision-toolkit` |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<br><sub>omdsh-dev/DSH-better-sidebar</sub> | UI / TUI | 115 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<br><sub>Small-tailqwq/dsh-deep-whale</sub> | UI / TUI | 106 | — | `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` | 需看包说明 |
| [@dsh-external/dsh-ads](https://github.com/Nagi-ovo/dsh-ads)<br><sub>Nagi-ovo/dsh-ads</sub> | Other | 96 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [@huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui)<br><sub>huiliyi37/dsh-tianshu-tui</sub> | UI / TUI | 73 | Apache-2.0 | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<br><sub>NanmiCoder/dsh-agent-teams</sub> | Long-running | 66 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [@taxueseek/argo-dsh](https://github.com/taxueseek/argo)<br><sub>taxueseek/argo</sub> | MCP Bridge | 56 | MIT | `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` | 需看包说明 |
| [@mstar-harness/dsh](https://github.com/btspoony/mstar-harness)<br><sub>btspoony/mstar-harness</sub> | Other | 39 | MIT | `packages/dsh/package.json` → `packages/dsh/bundle/cordis.patch.yml` | 需看包说明 |
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

首页按仓库去重展示 Stars 前 30 项；同仓多 bundle 与全部结果见 [data/plugins.json](data/plugins.json)。快照：2026-08-13T18:32:51.201Z。
<!-- RADAR:END -->

完整机器可读记录在 [`data/plugins.json`](data/plugins.json)。只贴了 topic、尚未通过 bundle 验证的仓库保留在 [`data/candidates.json`](data/candidates.json)，不会悄悄混进“可安装插件”。

## 命令行搜索

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
```

CLI 读取仓库已经提交的快照，普通搜索不需要 GitHub Token。

## 2Origin 插件实验室

<!-- LABS:START -->
| 项目 | 状态 | 分类 | 要解决的问题 | 证据 |
|---|---|---|---|---|
| `dsh-switch` | **planned** | Model & Routing | Provider health, latency, model identity and fallback routing for DSH. | 尚无 |
| `dsh-cost` | **planned** | Token & Cost | Cost, budget and per-project attribution above DSH token-meter events. | 尚无 |
| `dsh-2origin` | **planned** | Memory | Executable 2Origin state, projection, diff and freeze capabilities for DSH. | 尚无 |
| `dsh-cad-review` | **planned** | CAD / Engineering | Structured CAD evidence extraction and rule-backed drawing review. | 尚无 |
| `dsh-novel` | **planned** | Writing / Novel | Long-running story state with timeline, knowledge boundaries and contradiction checks. | 尚无 |
<!-- LABS:END -->

实验状态必须有证据才能升级：

- `planned`：已有问题定义和验收目标，但还没有可运行仓库。
- `experimental`：已有可运行仓库，但兼容性尚未得到证明。
- `verified`：在明确的 DSH revision 上观察到安装成功，并跑过声明的 smoke test。
- `deprecated`：实验不再维护。

正式插件运行时代码继续独立分仓。本仓只负责发现、证据、比较和实验状态，不把几十个插件塞进一个大仓库。

## 自动维护

定时工作流扫描公开 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic，检查 package manifest 与 patch 路径，重生成雷达，跑完验证后创建或更新 PR。生态事实不会未经 review 自动合并进 `main`。

本地更新：

```bash
GITHUB_TOKEN=github_token npm run update-radar
```

小范围扫描也可以匿名运行：

```bash
npm run discover -- --limit 25
```

## 参与贡献

见 [CONTRIBUTING.md](CONTRIBUTING.md)。添加 `dsh-plugin` topic 能帮助发现，但是否通过验证仍以 bundle manifest 和 patch 文件为准。

## 免责声明

本项目是独立社区项目，不代表 DeepSeek 官方背书。第三方插件会执行代码，并可能改变 Agent 的工具、提示词、权限、界面或数据访问。安装前请审查源码、依赖、许可证、权限与维护状态。

MIT © 2026 hfshfg

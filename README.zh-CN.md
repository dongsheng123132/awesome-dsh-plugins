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
**488** 个 Verified Bundle / 检查 **666** 个 topic 仓库 / GitHub 报告总数 **666**

Other: 185 · UI / TUI: 91 · MCP Bridge: 34 · Model & Routing: 26 · Developer Tools: 24 · Token & Cost: 24 · Coding: 23 · Browser: 22 · Memory: 18 · Long-running: 15 · Security: 13 · Office: 7 · Finance: 4 · Research: 2

| 插件 | 分类 | Stars | License | 证据 | 安装 |
|---|---:|---:|---|---|---|
| [@liustack/modlens](https://github.com/liustack/modlens)<br><sub>liustack/modlens</sub> | MCP Bridge | 703 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:liustack/modlens` |
| [@linxin666/dsh-client-ui-aionui-panel](https://github.com/zhu1090093659/dsh-web-ui)<br><sub>zhu1090093659/dsh-web-ui</sub> | UI / TUI | 508 | — | `packages/dsh-aionui-panel/package.json` → `packages/dsh-aionui-panel/cordis.patch.yml` | 需看包说明 |
| [dsh-cc-tui](https://github.com/ccch1mneyyy/dsh-cc-tui)<br><sub>ccch1mneyyy/dsh-cc-tui</sub> | UI / TUI | 198 | BSD-3-Clause | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ccch1mneyyy/dsh-cc-tui` |
| [@dsh-external/dsh-vision-toolkit](https://github.com/Anionex/dsh-vision-toolkit)<br><sub>Anionex/dsh-vision-toolkit</sub> | UI / TUI | 152 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-vision-toolkit` |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<br><sub>omdsh-dev/DSH-better-sidebar</sub> | UI / TUI | 127 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<br><sub>Small-tailqwq/dsh-deep-whale</sub> | UI / TUI | 119 | — | `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` | 需看包说明 |
| [@dsh-external/dsh-ads](https://github.com/Nagi-ovo/dsh-ads)<br><sub>Nagi-ovo/dsh-ads</sub> | UI / TUI | 105 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Nagi-ovo/dsh-ads` |
| [@huiliyi37/dsh-tianshu-tui](https://github.com/huiliyi37/dsh-tianshu-tui)<br><sub>huiliyi37/dsh-tianshu-tui</sub> | UI / TUI | 73 | Apache-2.0 | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:huiliyi37/dsh-tianshu-tui` |
| [dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<br><sub>NanmiCoder/dsh-agent-teams</sub> | Long-running | 72 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [@taxueseek/argo-dsh](https://github.com/taxueseek/argo)<br><sub>taxueseek/argo</sub> | MCP Bridge | 56 | MIT | `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` | 需看包说明 |
| [@mstar-harness/dsh](https://github.com/btspoony/mstar-harness)<br><sub>btspoony/mstar-harness</sub> | Long-running | 39 | MIT | `packages/dsh/package.json` → `packages/dsh/bundle/cordis.patch.yml` | 需看包说明 |
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
| [@dsh-external/plugin-console](https://github.com/vlln/plugin-registry)<br><sub>vlln/plugin-registry</sub> | UI / TUI | 13 | MIT | `packages/plugin/console/package.json` → `packages/plugin/console/cordis.patch.yml` | 需看包说明 |
| [@dsh-external/dsh-computer-use](https://github.com/Anionex/dsh-computer-use)<br><sub>Anionex/dsh-computer-use</sub> | Other | 12 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Anionex/dsh-computer-use` |
| [@loserfox/distill](https://github.com/LoserFox/distill)<br><sub>LoserFox/distill</sub> | Other | 12 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:LoserFox/distill` |
| [@dsh-external/dsh-share](https://github.com/hellodigua/dsh-share)<br><sub>hellodigua/dsh-share</sub> | Other | 11 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:hellodigua/dsh-share` |
| [dsh-message-edit](https://github.com/Moeblack/dsh-message-edit)<br><sub>Moeblack/dsh-message-edit</sub> | Other | 11 | — | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:Moeblack/dsh-message-edit` |
| [@deepseek-ai/dsh-plugin-check](https://github.com/omdsh-dev/dsh-plugin-check)<br><sub>omdsh-dev/dsh-plugin-check</sub> | Other | 11 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/dsh-plugin-check` |

首页按仓库去重展示 Stars 前 30 项；同仓多 bundle 与全部结果见 [data/plugins.json](data/plugins.json)。快照：2026-08-13T21:32:46.503Z。
<!-- RADAR:END -->

完整机器可读记录在 [`data/plugins.json`](data/plugins.json)。只贴了 topic、尚未通过 bundle 验证的仓库保留在 [`data/candidates.json`](data/candidates.json)，不会悄悄混进“可安装插件”。

## 命令行搜索

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
npx github:dongsheng123132/awesome-dsh-plugins runtime skillport
npx github:dongsheng123132/awesome-dsh-plugins risk process-execution
```

CLI 读取仓库已经提交的快照，普通搜索不需要 GitHub Token。

## 静态审查信号

雷达还会读取每个已验证 bundle 的 patch 和运行依赖，标记秘密配置、进程执行、文件系统、网络/浏览器、MCP 外部工具与 Web 客户端扩展等审查信号。第一轮 488 个 bundle 中有 163 个至少命中一项；这些信号带有 `patch` 或 `dependencies` 来源，只用于决定人工审查优先级，**不是漏洞结论，也不是安全认证**。完整记录在 [`data/plugins.json`](data/plugins.json)，命令行可用 `risk [signal]` 查询。

## 运行时兼容证据层

`Verified Bundle` 只证明仓库同时存在 `dsh.bundle.patch` 声明和它引用的 patch 文件。真正的运行证据单独放在 [`data/runtime-compat.json`](data/runtime-compat.json)：每份报告钉死 DSH commit 与 Node 运行时，在全新的临时 profile 中安装、组合 patch 栈，再真实启动 Web profile，直到 DSH 自己打印 readiness URL。

第一次审计已经说明为什么必须分层：审计时 `@dsh-skillport/bundle` 尚未出现在 npm，因此 README 中的 registry 安装路径真实失败；但同一源码 commit 本地构建后，在 Node 24.19.0、已有构建产物的 DSH `47f943859bef` 检出上完成安装、组合并启动到真实 readiness URL。干净 detached DSH 检出能安装、组合插件，但因缺少 DSH Web client bundle 被阻塞；继续构建该检出又先在 DSH 自身的 `tsdown` 缺 `unrun` 处失败。因此目前证据只支持“兼容已有构建产物的检出”，还不支持“干净源码可复现”。Node 22.14 那次另记为 `blocked-environment`，因为它不满足 DSH 自己声明的最低引擎要求，不能算插件失败。

可复跑命令：

```bash
node scripts/runtime-verify.mjs --spec <包名或已构建检出目录> \
  --dsh-repo /path/to/deepseek-harness \
  --node /path/to/node-24 \
  --record data/runtime-compat.json
```

## 2Origin 插件实验室

<!-- LABS:START -->
| 项目 | 状态 | 分类 | 要解决的问题 | 证据 |
|---|---|---|---|---|
| [dsh-switch](https://github.com/dongsheng123132/dsh-switch) | **verified** | Model & Routing | Evidence-first provider health probes and optimistic-lock model switching for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-switch/tree/42db01a1f873753e90699f6281094040acca04e6), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-switch/actions/runs/31733424075), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-cost](https://github.com/dongsheng123132/dsh-cost) | **verified** | Token & Cost | Durable usage-cost ledger, explicit evidence gaps and fail-closed budget checks for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-cost/tree/82b41f21a66f71ee44042d2ea9d3fe64419c4a2d), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-cost/actions/runs/31733968794), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
| [dsh-2origin](https://github.com/dongsheng123132/dsh-2origin) | **verified** | Memory | Integrity-checked 2Origin state projection, semantic diff and optimistic-lock immutable freeze for DSH. | [Immutable plugin source and smoke commands](https://github.com/dongsheng123132/dsh-2origin/tree/40dca1937a21f3d82922ec41353dce4810e10f64), [Clean GitHub Actions run](https://github.com/dongsheng123132/dsh-2origin/actions/runs/31745733515), [DSH revision used for isolated profile install](https://github.com/deepseek-ai/deepseek-harness/commit/47f943859bef60e4160492346772ded9b24f765a) |
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

定时工作流每 4 小时扫描公开 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic，检查 package manifest、patch 路径与静态审查信号，重生成雷达，跑完验证后创建或更新 PR。昂贵的真运行验证只对高价值候选或版本变化触发，不盲目按 4 小时全量重跑。生态事实不会未经 review 自动合并进 `main`。

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

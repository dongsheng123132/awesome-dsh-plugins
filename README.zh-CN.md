![Awesome DSH Plugins——有证据的插件雷达](docs/assets/awesome-dsh-plugins-hero.png)

# Awesome DSH Plugins

> 发现真正可安装的 DeepSeek Harness 插件，查看每条收录背后的证据，并探索 2Origin 插件实验室。

[![仓库检查](https://github.com/dongsheng123132/awesome-dsh-plugins/actions/workflows/check.yml/badge.svg)](https://github.com/dongsheng123132/awesome-dsh-plugins/actions/workflows/check.yml)
[![MIT 许可证](https://img.shields.io/github/license/dongsheng123132/awesome-dsh-plugins)](LICENSE)
[![DSH 插件 Topic](https://img.shields.io/badge/GitHub_topic-dsh--plugin-0969da)](https://github.com/topics/dsh-plugin)
[![Awesome](https://awesome.re/badge-flat2.svg)](https://awesome.re)

[English](README.md) · [DeepSeek Harness 官方仓库](https://github.com/deepseek-ai/deepseek-harness) · [浏览已验证 Bundle](#插件雷达) · [终端搜索](#在终端里搜索) · [2Origin 插件实验室](#2origin-插件实验室)

## 从这里开始

| 我想…… | 去这里 |
|---|---|
| 找一个真正可安装的 DSH profile bundle | [插件雷达](#插件雷达) |
| 估算把 Agent Skill 移植进 DSH 的工作量 | [能力移植评分](#能力移植评分) |
| 在终端离线搜索插件 | [CLI 搜索](#在终端里搜索) |
| 查看带可复现运行证据的插件 | [运行时兼容性层](#运行时兼容性层) |
| 探索本实验室孵化的证据优先插件 | [2Origin 插件实验室](#2origin-插件实验室) |

普通 CLI 搜索只读仓库内已提交的快照，不需要 GitHub token：

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
```

本仓刻意区分“提到了 DSH 的仓库”和“DSH 真正能激活的 profile bundle”。扫描器只有同时找到下面两项，才授予 **Verified Bundle**：

1. `package.json` 中存在 `dsh.bundle.patch` 声明；
2. 同一 Git tree 中确实存在该声明指向的 patch 文件。

这是结构验证，不是安全审计，也不等于插件一定兼容今天的 DSH main 分支。
分类只是启发式导航；决定验证状态的是 manifest 与 patch 证据，不是分类标签。

## 插件雷达

<!-- RADAR:START -->
**1098** 个 Verified Bundle / 检查 **1003** 个 topic 仓库 / GitHub 报告总数 **11490**

Other: 329 · UI / TUI: 225 · Token & Cost: 68 · Browser: 67 · MCP Bridge: 63 · Security: 61 · Memory: 55 · Model & Routing: 54 · Coding: 34 · Office: 32 · Developer Tools: 28 · Finance: 28 · Long-running: 22 · Writing / Novel: 19 · Research: 12 · Provenance & Lineage: 1

| 插件 | 分类 | Stars | License | 证据 | 安装 |
|---|---:|---:|---|---|---|
| [@open-design/dsh-runtime](https://github.com/nexu-io/open-design)<br><sub>nexu-io/open-design</sub> | Office | 91246 | Apache-2.0 | `packages/dsh-runtime/package.json` → `packages/dsh-runtime/cordis.patch.yml` | 需看包说明 |
| [dsh-plugin-reactive-resume](https://github.com/amruthpillai/reactive-resume)<br><sub>amruthpillai/reactive-resume</sub> | MCP Bridge | 41696 | MIT | `packages/dsh-plugin/package.json` → `packages/dsh-plugin/cordis.patch.yml` | 需看包说明 |
| [@openviking/dsh-memory-plugin](https://github.com/volcengine/OpenViking)<br><sub>volcengine/OpenViking</sub> | Memory | 33116 | AGPL-3.0 | `examples/dsh-memory-plugin/package.json` → `examples/dsh-memory-plugin/cordis.patch.yml` | 需看包说明 |
| [@wxg-prc-cpg/dsh-weknora](https://github.com/Tencent/WeKnora)<br><sub>Tencent/WeKnora</sub> | Office | 20577 | NOASSERTION | `packages/dsh-weknora/package.json` → `packages/dsh-weknora/cordis.patch.yml` | 需看包说明 |
| [dsh-plugin-desktop](https://github.com/anywhere-labs/dsh-desktop)<br><sub>anywhere-labs/dsh-desktop</sub> | Other | 19998 | MIT | `dsh-plugin-desktop/package.json` → `dsh-plugin-desktop/cordis.patch.yml` | 需看包说明 |
| [@tt-a1i/archify-dsh](https://github.com/tt-a1i/archify)<br><sub>tt-a1i/archify</sub> | Long-running | 15658 | MIT | `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` | 需看包说明 |
| [@memtensor/memos-local-plugin](https://github.com/MemTensor/MemOS)<br><sub>MemTensor/MemOS</sub> | Token & Cost | 10966 | Apache-2.0 | `apps/memos-local-plugin/package.json` → `apps/memos-local-plugin/adapters/deepseek-harness/cordis.patch.yml` | 需看包说明 |
| [@dsh-external/dsh-super-injector](https://github.com/yjh051108/dsh-routing-suite)<br><sub>yjh051108/dsh-routing-suite</sub> | Model & Routing | 6777 | MIT | `injector/package.json` → `injector/cordis.patch.yml` | 需看包说明 |
| [@dsh-web/files](https://github.com/zhu1090093659/dsh-web)<br><sub>zhu1090093659/dsh-web</sub> | Browser | 6005 | Apache-2.0 | `market/shell/packages/dsh-web-files/package.json` → `market/shell/packages/dsh-web-files/cordis.patch.yml` | 需看包说明 |
| [dsh-ouroboros](https://github.com/Q00/ouroboros)<br><sub>Q00/ouroboros</sub> | Long-running | 5657 | MIT | `integrations/dsh-plugin/package.json` → `integrations/dsh-plugin/cordis.patch.yml` | 需看包说明 |
| [deepseek-idesign](https://github.com/Devin-AXIS/iPolloWork)<br><sub>Devin-AXIS/iPolloWork</sub> | Other | 4774 | NOASSERTION | `external-plugins/deepseek-harness/design-studio/package.json` → `external-plugins/deepseek-harness/design-studio/cordis.patch.yml` | 需看包说明 |
| [@petdex/dsh-plugin](https://github.com/crafter-station/petdex)<br><sub>crafter-station/petdex</sub> | Other | 3974 | MIT | `packages/petdex-desktop-native/integrations/dsh/package.json` → `packages/petdex-desktop-native/integrations/dsh/cordis.patch.yml` | 需看包说明 |
| [@liustack/modlens](https://github.com/liustack/modlens)<br><sub>liustack/modlens</sub> | MCP Bridge | 3644 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:liustack/modlens` |
| [@struktoai/mirage-dsh](https://github.com/strukto-ai/mirage)<br><sub>strukto-ai/mirage</sub> | Other | 3563 | Apache-2.0 | `typescript/packages/dsh/package.json` → `typescript/packages/dsh/cordis.patch.yml` | 需看包说明 |
| [@agentscope-ai/reme](https://github.com/agentscope-ai/ReMe)<br><sub>agentscope-ai/ReMe</sub> | Memory | 3344 | Apache-2.0 | `packages/typescript/package.json` → `packages/typescript/dsh/cordis.patch.yml` | 需看包说明 |
| [dsh-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)<br><sub>omdsh-dev/DSH-better-sidebar</sub> | UI / TUI | 2861 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:omdsh-dev/DSH-better-sidebar` |
| [dsh-codex-taskboard](https://github.com/chuspeeism/dashi-taskboard)<br><sub>chuspeeism/dashi-taskboard</sub> | Other | 2541 | Apache-2.0 | `integrations/deepseek-harness/package.json` → `integrations/deepseek-harness/cordis.patch.yml` | 需看包说明 |
| [@deepseek-harness-tui/dsh-tui](https://github.com/ccch1mneyyy/dsh-TUI)<br><sub>ccch1mneyyy/dsh-TUI</sub> | UI / TUI | 2511 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ccch1mneyyy/dsh-TUI` |
| [@zilliz/memsearch-dsh](https://github.com/zilliztech/memsearch)<br><sub>zilliztech/memsearch</sub> | Memory | 2503 | MIT | `plugins/dsh/package.json` → `plugins/dsh/cordis.patch.yml` | 需看包说明 |
| [dshmarket](https://github.com/dsh-market/dsh-market)<br><sub>dsh-market/dsh-market</sub> | Finance | 2299 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:dsh-market/dsh-market` |
| [@dsh-external/dsh-client-ui-skin-maid-atelier](https://github.com/Small-tailqwq/dsh-deep-whale)<br><sub>Small-tailqwq/dsh-deep-whale</sub> | UI / TUI | 1696 | — | `maid-atelier/package.json` → `maid-atelier/cordis.patch.yml` | 需看包说明 |
| [@wxg-prc-cpg/browser-skill-dsh-plugin](https://github.com/Tencent/BrowserSkill)<br><sub>Tencent/BrowserSkill</sub> | Browser | 1310 | MIT | `packages/dsh-plugin-browserskill/package.json` → `packages/dsh-plugin-browserskill/cordis.patch.yml` | 需看包说明 |
| [@mem9/dsh-plugin](https://github.com/mem9-ai/mem9)<br><sub>mem9-ai/mem9</sub> | Memory | 1199 | Apache-2.0 | `dsh-plugin/package.json` → `dsh-plugin/cordis.patch.yml` | 需看包说明 |
| [aegis](https://github.com/GanyuanRan/Aegis)<br><sub>GanyuanRan/Aegis</sub> | Coding | 1129 | MIT | `package.json` → `extensions/dsh/cordis.patch.yml` | `dsh plugin --profile web add github:GanyuanRan/Aegis` |
| [@open-pets/dsh](https://github.com/alvinunreal/openpets)<br><sub>alvinunreal/openpets</sub> | Coding | 1115 | MIT | `packages/dsh/package.json` → `packages/dsh/cordis.patch.yml` | 需看包说明 |
| [@agentrq/dsh-plugin-agentrq](https://github.com/agentrq/agentrq)<br><sub>agentrq/agentrq</sub> | Long-running | 1088 | Apache-2.0 | `plugins/deepseek-harness/package.json` → `plugins/deepseek-harness/cordis.patch.yml` | 需看包说明 |
| [dsh-context](https://github.com/bowenliang123/dsh-context)<br><sub>bowenliang123/dsh-context</sub> | Browser | 1018 | Apache-2.0 | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:bowenliang123/dsh-context` |
| [@nanmicoder/dsh-agent-teams](https://github.com/NanmiCoder/dsh-agent-teams)<br><sub>NanmiCoder/dsh-agent-teams</sub> | Long-running | 980 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:NanmiCoder/dsh-agent-teams` |
| [dsh-vision-router](https://github.com/ysr666/dsh-vision-router)<br><sub>ysr666/dsh-vision-router</sub> | Model & Routing | 969 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:ysr666/dsh-vision-router` |
| [dsh-whale-widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget)<br><sub>MeteorNOX/DeepSeek-Balance-Whale-Widget</sub> | Other | 934 | MIT | `package.json` → `cordis.patch.yml` | `dsh plugin --profile web add github:MeteorNOX/DeepSeek-Balance-Whale-Widget` |

首页按仓库去重展示 Stars 前 30 项；同仓多 bundle 与全部结果见 [data/plugins.json](data/plugins.json)。快照：2026-08-25T08:59:38.471Z。
<!-- RADAR:END -->

完整机器可读记录在 [`data/plugins.json`](data/plugins.json)。只贴了 topic、尚未通过 bundle 验证的仓库保留在 [`data/candidates.json`](data/candidates.json)，不会悄悄混进“可安装插件”。

## Capability Port Score

第二张雷达从 Claude、Codex、共享 `.agents`、OpenClaw 与 SkillHub 定向搜索中发现公开 `SKILL.md` 候选，但不复制或重新发布其指令正文。每条记录先钉死仓库 commit、文件路径、Git blob、内容 SHA-256、许可证证据来源和逐行适配信号，再给出有证据的迁移路径：

- `copy`：未观察到运行时、随包资源、可执行命令或权限依赖的自包含指令；
- `wrapper`：需要命令、随包资源、网络、密钥、写入或 Shell 适配层；
- `bridge`：必须翻译 Harness hook、插件协议或运行时专属配置；
- `unclassified`：缺少必要的身份信息，保持未分类。

<!-- CAPABILITIES:START -->
**49** 条固定 revision 候选：Copy 15 · Wrapper 30 · Bridge 2 · 未分类 2

| 能力 | 来源 | 移植路径 | 分数 | License | 固定证据 |
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

完整记录、分项得分与逐行信号见 [data/capabilities.json](data/capabilities.json)。快照：2026-08-13T22:47:12.754Z。分数只衡量观测到的适配工作量，不代表兼容、安全、质量或许可证已获准。
<!-- CAPABILITIES:END -->

## 命令行搜索

```bash
npx github:dongsheng123132/awesome-dsh-plugins search memory
npx github:dongsheng123132/awesome-dsh-plugins trending
npx github:dongsheng123132/awesome-dsh-plugins verified
npx github:dongsheng123132/awesome-dsh-plugins experimental
npx github:dongsheng123132/awesome-dsh-plugins runtime skillport
npx github:dongsheng123132/awesome-dsh-plugins risk process-execution
npx github:dongsheng123132/awesome-dsh-plugins ports cad
```

CLI 读取仓库已经提交的快照，普通搜索不需要 GitHub Token。

## 静态审查信号

雷达还会读取每个已验证 bundle 的 patch 和运行依赖，标记秘密配置、进程执行、文件系统、网络/浏览器、MCP 外部工具与 Web 客户端扩展等审查信号。第一轮 488 个 bundle 中有 163 个至少命中一项；这些信号带有 `patch` 或 `dependencies` 来源，只用于决定人工审查优先级，**不是漏洞结论，也不是安全认证**。完整记录在 [`data/plugins.json`](data/plugins.json)，命令行可用 `risk [signal]` 查询。

## 运行时兼容证据层

`Verified Bundle` 只证明仓库同时存在 `dsh.bundle.patch` 声明和它引用的 patch 文件。真正的运行证据单独放在 [`data/runtime-compat.json`](data/runtime-compat.json)：每份报告钉死 DSH commit 与 Node 运行时，在全新的临时 profile 中安装、组合 patch 栈，再真实启动 Web profile，直到 DSH 自己打印 readiness URL。

第一次审计已经说明为什么必须分层：审计时 `@dsh-skillport/bundle` 尚未出现在 npm，因此 README 中的 registry 安装路径真实失败；但同一源码 commit 本地构建后，在 Node 24.19.0、已有构建产物的 DSH `47f943859bef` 检出上完成安装、组合并启动到真实 readiness URL。干净 detached DSH 检出能安装、组合插件，但因缺少 DSH Web client bundle 被阻塞；继续构建该检出又先在 DSH 自身的 `tsdown` 缺 `unrun` 处失败。因此目前证据只支持“兼容已有构建产物的检出”，还不支持“干净源码可复现”。Node 22.14 那次另记为 `blocked-environment`，因为它不满足 DSH 自己声明的最低引擎要求，不能算插件失败。

下一层现已机器化：[`data/runtime-targets.json`](data/runtime-targets.json) 同时钉死 0.1.1 之前的兼容锚点与官方 `dsh-v0.1.1-rc.2` 两条具名 DSH 基线、四个观察型社区插件 commit 和一个必须通过的 2Origin 阳性对照。[运行时兼容矩阵](.github/workflows/runtime-compat.yml) 在 Ubuntu 与 Windows 上运行完整的“基线 × OS × package”笛卡尔积，先启动每条 stock DSH Web 基线作为仪器阳性对照，再在全新 `DSH_HOME` 中逐一安装、组合和启动各元组。基线 ID、固定 revision、报告路径、缓存键与 artifact 名互相隔离，升级证据不能覆盖旧锚点。基线生命周期脚本由各固定 DSH commit 自己的失败闭合 `strictDepBuilds` 与逐项审核 `allowBuilds` 策略管控，插件侧仍只精确放行目标声明的一个固定包。报告还会解析已安装包声明的入口；若构建产物缺失，则记为 `package-artifact-missing`，不再与 Harness 启动故障混为一谈。每次运行都会在移除凭据形与 CI 控制环境变量后上传只创建不覆盖、内容寻址的报告。`observe` 目标的有效负报告会记录生态兼容事实但不会把仪器本身判红；`required` 目标必须通过，证据缺失或格式错误始终失败。通过只证明指定组合兼容，不是安全认证。

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
| [dsh-attestation-proof](https://github.com/dongsheng123132/dsh-attestation-proof) | **verified** | supply-chain-evidence | Offline, content-addressed DSSE/in-toto release evidence with SHA-256-pinned public keys, distinct-signer thresholds, subject/predicate/hashed-claim policy checks, proof-only MCP and real DSH ToolRuntime verification without returning signed payloads. | [Immutable plugin source, formal Codex manifest, proof-only MCP and real DSH ToolRuntime smoke commands](https://github.com/dongsheng123132/dsh-attestation-proof/tree/633b61ba73ec2ba2b8a66298eb1d0c4ef3eec85e), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-attestation-proof/actions/runs/32844058718), [DSH 0.1.0-rc.7 revision used for isolated path and fixed-commit GitHub installs](https://github.com/deepseek-ai/deepseek-harness/commit/528c682e061696f5a160f363f236ecbf53cbd006) |
| [dsh-retention-settlement-proof](https://github.com/dongsheng123132/dsh-retention-settlement-proof) | **verified** | retention-evidence | Body-free, content-addressed proof that an approved deletion request settled into a bound tombstone and remained absent across required DSH persistence, session and workspace projections after restart, with freshness, missing-surface and resurrection disclosure and no destructive actions. | [Immutable plugin source, formal Codex manifest, proof-only MCP and real DSH ToolRuntime smoke commands](https://github.com/dongsheng123132/dsh-retention-settlement-proof/tree/05ad32d7741dd1b96b7e3653d38c85a9308c4f2c), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-retention-settlement-proof/actions/runs/32851911092), [DSH 0.1.0-rc.7 revision used for isolated path and fixed-commit GitHub installs](https://github.com/deepseek-ai/deepseek-harness/commit/528c682e061696f5a160f363f236ecbf53cbd006) |
| [dsh-tool-surface-proof](https://github.com/dongsheng123132/dsh-tool-surface-proof) | **verified** | tool-surface-evidence | Offline, content-addressed conformance proof for explicitly recorded model-visible DSH tool surfaces across deployment revision, agent scope, permission mode and presentation mode, with hashed add/remove/schema/order drift and no schema, description or secret disclosure. | [Immutable plugin source, formal Codex manifest, redacted MCP and real DSH ToolRuntime smoke commands](https://github.com/dongsheng123132/dsh-tool-surface-proof/tree/547284bb71b68a96467379aa60ad1f3a8aa98f00), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-tool-surface-proof/actions/runs/32876330180), [DSH 0.1.0-rc.7 used for isolated local-path and fixed-commit GitHub installs](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.1.0-rc.7) |
| [dsh-windows-settlement-proof](https://github.com/dongsheng123132/dsh-windows-settlement-proof) | **verified** | windows-operations-evidence | Offline, content-addressed proof that an approved Windows control-plane change settled across required service, scheduled-task, event and policy surfaces at the required restart epoch, with hash-only drift disclosure and no PowerShell, registry, service or task execution. | [Immutable plugin source, formal Codex manifest, redacted MCP and real DSH ToolRuntime settlement smoke](https://github.com/dongsheng123132/dsh-windows-settlement-proof/tree/1ae1c2f70223cd984cc980fea6c7c1da26988e46), [Ubuntu and Windows GitHub Actions run](https://github.com/dongsheng123132/dsh-windows-settlement-proof/actions/runs/32887770116), [DSH 0.1.0-rc.7 used for isolated local-path and fixed-commit GitHub installs](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.1.0-rc.7) |
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

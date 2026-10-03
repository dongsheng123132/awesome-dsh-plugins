# Contributing

## Quick submission / 快速投稿

You do not need to edit a generated README table. The shortest path is:

1. make the plugin repository public;
2. add the GitHub topic [`dsh-plugin`](https://github.com/topics/dsh-plugin);
3. confirm that its `package.json` declares `dsh.bundle.patch` and that the patch file exists; and
4. wait for the scheduled radar PR, or open a [plugin review issue](https://github.com/dongsheng123132/awesome-dsh-plugins/issues/new?template=add-plugin.yml) with the repository URL for faster review.

无需手改自动生成的 README 表格。最短投稿路径是：公开插件仓库、添加 [`dsh-plugin`](https://github.com/topics/dsh-plugin) topic、确认 `package.json` 声明了 `dsh.bundle.patch` 且 patch 文件存在，然后等待定时雷达 PR；如需加速，可提交 [插件审核 Issue](https://github.com/dongsheng123132/awesome-dsh-plugins/issues/new?template=add-plugin.yml)。

Pull requests that correct source-tagged categories, descriptions, evidence, or documentation are welcome. Do not edit content between generated markers (`RADAR`, `CAPABILITIES`, or `LABS`) by hand; `npm run generate` owns those sections.

## Add or correct a plugin

The normal discovery path is automatic:

1. make the repository public;
2. add the GitHub topic `dsh-plugin`;
3. declare `dsh.bundle.patch` in the installable package's `package.json`;
4. commit the referenced patch file; and
5. wait for the scheduled radar pull request or run the workflow manually.

If the scanner finds the wrong manifest, category, installation target, or description, open an issue with the repository URL and the exact field that needs correction. A future manual override must explain why the automatically observed value is insufficient; overrides must not erase the underlying evidence.

## Add a 2Origin lab project

Edit `data/labs.json`. Status changes need the following evidence:

- `planned → experimental`: a public runnable repository and an explicit smoke-test command.
- `experimental → verified`: a named DSH commit or release, the install command, the smoke command, and an immutable run or CI URL.
- `* → deprecated`: a short reason and replacement when one exists.

## Runtime compatibility evidence

Structural bundle verification is not runtime compatibility. Record the latter in an isolated Harness home:

```bash
node scripts/runtime-verify.mjs \
  --spec <package-or-built-checkout> \
  --dsh-repo /path/to/deepseek-harness \
  --node /path/to/a-supported-node \
  --allow-build @scope/exact-package \
  --artifact-dir artifacts/runtime \
  --record data/runtime-compat.json
```

The runner removes credential-shaped and CI-control environment variables, allows lifecycle builds for exactly the named pinned package, installs into a new temporary `DSH_HOME`, composes the profile, boots the real Web profile on an OS-assigned loopback port, waits for DSH's readiness URL, and records the DSH revision plus manifest and patch hashes. `--artifact-dir` writes a create-only, content-addressed report. A report may be `passed`, `failed`, `blocked-environment`, or `blocked-harness`; never present a blocked run as a plugin failure.

The scheduled matrix is declared in `data/runtime-targets.json`. Every DSH and plugin source must be pinned to a full commit and one exact `allowBuild` package. The workflow installs and builds the pinned DSH baseline under that commit's own `strictDepBuilds` and reviewed `allowBuilds` policy, caches one baseline per OS/revision, and boots stock DSH as the instrument's positive control. Because Windows cache archives do not preserve every pnpm workspace link, Windows consumers run one frozen, offline install with optimistic repeat disabled to rehydrate links from the cached virtual store. The workflow then tests SkillPort, Pack-Agent, a high-adoption plugin, a static-review-priority plugin and a pinned 2Origin positive control on Ubuntu and Windows. Community targets use `observe`: a valid negative compatibility report remains evidence and does not make the instrument itself red. Targets we maintain use `required` and must pass. Missing or invalid reports always fail. Selection is triage, not endorsement; runtime success is compatibility evidence, not a safety certification.

## Development

Requires Node.js 22 or later and no third-party runtime dependencies.

```bash
npm test
npm run discover -- --limit 25
npm run generate
npm run check
```

`data/plugins.json` contains structurally verified bundles plus static, source-tagged review signals. Those signals are triage hints, never vulnerability findings or certification. `data/candidates.json` contains topic results that did not pass structural verification. `data/runtime-compat.json` contains the separate install/compose/boot evidence. Audited category corrections live in `data/category-overrides.json` and must retain a reason and source. Do not manually promote a candidate by editing generated data.

## Badge / 徽章

If your plugin is listed, you may add this badge to its README:

```markdown
[![Listed on Awesome DSH Plugins](https://img.shields.io/badge/listed-Awesome%20DSH%20Plugins-2ea44f?logo=github)](https://github.com/dongsheng123132/awesome-dsh-plugins)
```

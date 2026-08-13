# Contributing

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
  --record data/runtime-compat.json
```

The runner installs into a new temporary `DSH_HOME`, composes the profile, boots the real Web profile on an OS-assigned loopback port, waits for DSH's readiness URL, and records the DSH revision plus manifest and patch hashes. A report may be `passed`, `failed`, `blocked-environment`, or `blocked-harness`; never present a blocked run as a plugin failure.

## Development

Requires Node.js 22 or later and no third-party runtime dependencies.

```bash
npm test
npm run discover -- --limit 25
npm run generate
npm run check
```

`data/plugins.json` contains structurally verified bundles plus static, source-tagged review signals. Those signals are triage hints, never vulnerability findings or certification. `data/candidates.json` contains topic results that did not pass structural verification. `data/runtime-compat.json` contains the separate install/compose/boot evidence. Audited category corrections live in `data/category-overrides.json` and must retain a reason and source. Do not manually promote a candidate by editing generated data.

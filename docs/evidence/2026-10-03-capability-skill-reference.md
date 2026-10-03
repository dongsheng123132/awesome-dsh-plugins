# Capability Port Score: nested skill reference calibration

The 2026-10-02 [automated capability scan](https://github.com/dongsheng123132/awesome-dsh-plugins/pull/3) inspected 246/246 pinned candidates. That moving PR is a triage snapshot, not a compatibility or license approval; this calibration does not merge it.

Audited example: [TencentEdgeOne/edgeone-makers-tools `SKILL.md`](https://github.com/TencentEdgeOne/edgeone-makers-tools/blob/008dd4dfd987de3d33932fe243db8e248d221c1d/SKILL.md), commit `008dd4dfd987de3d33932fe243db8e248d221c1d`, Git blob `aeb684aaeb7d6864307464b3361ae20f601c2799`, normalized content SHA-256 `9dff80a6b6b6f1d93a3e8f8921f8798227b2d1b24ac4ba59a8f22ee339fd6c9f`. The pinned source SHA-256 was independently reread and matched the scanner's observation. Lines 23–31 tell the reader to open nine relative `skills/<name>/SKILL.md` files; none of those instructions is present if only the entry file is copied.

Before calibration, this entry was `copy` at 90/100 because the resource detector recognized assets, references, templates and examples, but not nested skill files. The new `nested-skill` resource signal makes it `wrapper` at the 79/100 class cap. A matching line number is retained in machine-readable evidence. This means the referenced skill closure needs review and packaging; it does **not** establish that the closure works in DSH. An HTTPS URL containing `/skills/` is not treated as a bundled relative dependency.

Regression test: `npm test` covers the positive nested-skill and negative external-URL cases. `npm run generate` and `npm run check` confirm the existing 49-candidate committed snapshot is unchanged. The next full scan must reclassify the moving 246-candidate branch before it can be considered for main.

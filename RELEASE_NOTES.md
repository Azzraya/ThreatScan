# ThreatScan v5.0.0 — Release Notes

Release date: 2025-11-15

## Overview

ThreatScan v5.0.0 prepares the project for public distribution and MSP-focused go-to-market. This release contains repository hygiene improvements, documentation, pricing guidance, CI automation, and PR templates to support contributors and early adopters.

## Highlights

- Public release preparation: `LICENSE` (MIT), `README_PUBLIC.md`, and `CHANGELOG.md`.
- Pricing & GTM: `PRICING.md` with recommended MSP tiers and a short ROI example.
- Developer ergonomics: `.gitignore` added and previously tracked local artifacts untracked.
- CI and contribution: a basic GitHub Actions workflow (`.github/workflows/ci.yml`) and PR templates under `.github/PULL_REQUEST_TEMPLATE/`.
- Recovered conversation: human-readable summary saved as `RECOVERED_CHAT_URL-Shortener.md` to preserve important GTM chat content.

## Upgrade / install notes

If you are upgrading from a prior local branch, no breaking changes were introduced in this release; the changes are primarily documentation and repository configuration.

To clone and run the project:

```powershell
git clone https://github.com/Azzraya/ThreatScan.git
cd ThreatScan
npm ci
node index.js --help
```

## Notes for maintainers

- Keep `package-lock.json` committed for reproducible installs.
- CI currently runs a syntax check and attempts lint/tests if configured. Add a `lint` script and tests to improve CI coverage.
- Sensitive or large local outputs (for example `report.json` and `results.json`) are intentionally ignored by `.gitignore`.

## Contact & support

For release-related questions, PR reviews, or to request enterprise features (SSO, on-prem agent, integrations), open an issue or email the maintainer.

## Publishing this release

The repository is tagged `v5.0.0`. To publish an official GitHub Release, copy these notes into the release description and use the web UI or the `gh` CLI, for example:

```powershell
gh release create v5.0.0 -t "ThreatScan v5.0.0" -n "$(Get-Content RELEASE_NOTES.md -Raw)"
```

![download-and-extract](https://github.com/liveahero-community/archives/workflows/download-and-extract/badge.svg)

---

* All Artifacts (ignored sensitive data): https://github.com/liveahero-community/archives/tree/artifacts
* Histories: https://github.com/liveahero-community/archives/commits/artifacts

---

## Quick start

Checkout `./.github/workflows/download-and-extract.yml`

* Download official bundles (Only diff with previous version)
* Extract bundles (Base on AssetStudio)
* Filter assets (Ignore sensitive data and duplication)
* Commit asset list info to `main` branch
* Commit artifacts to `artifacts` branch

## About extracting asset bundles

It based on **AssetStudio**, `./AssetStudioWrapper` supports CLI version to extract assets by folder.

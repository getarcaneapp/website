---
title: "Verify Artifacts"
description: "Verify Arcane release artifacts and container images with Cosign."
---

Use [Cosign](https://docs.sigstore.dev/cosign/system_config/installation/) to check that an Arcane binary or image is exactly what we published. The public key is at [getarcane.app/cosign.pub](https://getarcane.app/cosign.pub) and in the Arcane GitHub repository root.

> [!NOTE]
> Signatures cover binaries on GitHub Releases and S3, and container images, for every release after `v1.17.4` and all `next` images.

## Verify binaries

1. Install Cosign.
2. Download the checksum file and its Sigstore bundle from the same place as your binary (see [Checksum files](#checksum-files)).
3. Verify the checksum file's signature:

   ```bash
   cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane_checksums.txt.sigstore.json" "arcane_checksums.txt"
   ```

4. Check the binaries you downloaded against it:

   ```bash
   sha256sum -c arcane_checksums.txt --ignore-missing
   ```

   Drop `--ignore-missing` to check every file in the list.

### Checksum files

| Source               | Checksum file                    | Bundle                                         |
| -------------------- | -------------------------------- | ---------------------------------------------- |
| GitHub Releases      | `arcane_<version>_checksums.txt` | `arcane_<version>_checksums.txt.sigstore.json` |
| S3 (`next` binaries) | `arcane_checksums.txt`           | `arcane_checksums.txt.sigstore.json`           |
| S3 (`next` CLI)      | `arcane-cli_checksums.txt`       | `arcane-cli_checksums.txt.sigstore.json`       |

Releases `v2.4.0` and earlier also have a per-file Sigstore bundle you can verify directly:

```bash
cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane-cli_linux_amd64.sigstore.json" "arcane-cli"
```

## Verify container images

1. Find the image digest (the `sha256:` hash of one exact image). For a local image:

   ```bash
   docker image inspect <IMAGE_NAME_OR_ID> --format '{{index .RepoDigests 0}}'
   ```

   Or without pulling:

   ```bash
   docker buildx imagetools inspect ghcr.io/getarcaneapp/manager:latest --format "{{json .Manifest}}" | jq -r .digest
   ```

2. Verify the image by digest:

   ```bash
   cosign verify --key "https://getarcane.app/cosign.pub" ghcr.io/getarcaneapp/manager@sha256:...
   ```

---
title: 'Verify Artifacts'
description: 'Verify Arcane release artifacts and container images with Cosign.'
---

Use Cosign, Sigstore's signing tool, to check that an Arcane binary or image is exactly what we published. Install Cosign ([guide](https://docs.sigstore.dev/cosign/system_config/installation/)). The public key is at [getarcane.app/cosign.pub](https://getarcane.app/cosign.pub) and in the Arcane GitHub repository root.

> [!NOTE]
> This covers binaries on GitHub Releases and S3, and container images, for every release after `v1.17.4` and all `next` images.

## Verify checksums

Verify the checksum file's signature, then check your files against it with `sha256sum`. The checksum file and its Sigstore bundle sit next to your artifacts:

| Source               | Checksum file                    | Bundle                                         |
| -------------------- | -------------------------------- | ---------------------------------------------- |
| GitHub Releases      | `arcane_<version>_checksums.txt` | `arcane_<version>_checksums.txt.sigstore.json` |
| S3 (`next` binaries) | `arcane_checksums.txt`           | `arcane_checksums.txt.sigstore.json`           |
| S3 (`next` CLI)      | `arcane-cli_checksums.txt`       | `arcane-cli_checksums.txt.sigstore.json`       |

```bash
cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane_checksums.txt.sigstore.json" "arcane_checksums.txt"
```

```bash
sha256sum -c arcane_checksums.txt
```

To check only the binaries you downloaded:

```bash
sha256sum -c arcane_checksums.txt --ignore-missing
```

Releases `v2.4.0` and earlier also have a per-file Sigstore bundle you can verify directly:

```bash
cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane-cli_linux_amd64.sigstore.json" "arcane-cli"
```

## Verify container images

Verify an image by its digest, the `sha256:` hash of one exact image, from your pull or the release:

```bash
cosign verify --key "https://getarcane.app/cosign.pub" ghcr.io/getarcaneapp/manager@sha256:...
```

> [!TIP]
> To find the digest of a local image:
>
> ```bash
> docker image inspect <IMAGE_NAME_OR_ID> --format '{{index .RepoDigests 0}}'
> ```
>
> To find it without pulling:
>
> ```bash
> docker buildx imagetools inspect ghcr.io/getarcaneapp/manager:latest --format "{{json .Manifest}}" | jq -r .digest
> ```

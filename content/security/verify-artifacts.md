---
title: 'Verify Artifacts'
description: 'Verify Arcane release artifacts and container images with Cosign.'
---

<script lang="ts">
import { Link } from '#lib/components/ui/link/index.js';
import { Snippet } from '#lib/components/ui/snippet/index.js';
</script>

Use Cosign, Sigstore's signing tool, to check that an Arcane binary or container image is exactly what we published.

> [!NOTE]
> This covers binaries on GitHub Releases and S3, and container images, for every release after `v1.17.4` and all `next` images.

You need Cosign installed (see the <Link href="https://docs.sigstore.dev/cosign/system_config/installation/">Cosign installation guide</Link>). The Arcane public key is at <Link href="https://getarcane.app/cosign.pub">getarcane.app/cosign.pub</Link> and in the root of the Arcane GitHub repository.

## Verify checksums

First verify the signature on the checksum file, then check your downloaded files against it with `sha256sum`.

The checksum file and its Sigstore bundle sit next to each other wherever you got your artifacts:

| Source               | Checksum file                    | Bundle                                         |
| -------------------- | -------------------------------- | ---------------------------------------------- |
| GitHub Releases      | `arcane_<version>_checksums.txt` | `arcane_<version>_checksums.txt.sigstore.json` |
| S3 (`next` binaries) | `arcane_checksums.txt`           | `arcane_checksums.txt.sigstore.json`           |
| S3 (`next` CLI)      | `arcane-cli_checksums.txt`       | `arcane-cli_checksums.txt.sigstore.json`       |

<Snippet text='cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane_checksums.txt.sigstore.json" "arcane_checksums.txt"' class="mt-2" />

<Snippet text="sha256sum -c arcane_checksums.txt" class="mt-2" />

## Verify a release binary

Binaries are covered by the signed checksum file. Verify the checksum file as above, then check only the files you downloaded:

<Snippet text='sha256sum -c arcane_checksums.txt --ignore-missing' class="mt-2" />

Releases `v2.4.0` and earlier also have a Sigstore bundle per file, which you can verify directly:

<Snippet text='cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane-cli_linux_amd64.sigstore.json" "arcane-cli"' class="mt-2" />

## Verify container images

Verify an image by its digest, the `sha256:` hash that identifies one exact image. Use the digest you pulled or the one published with the release:

<Snippet text='cosign verify --key "https://getarcane.app/cosign.pub" ghcr.io/getarcaneapp/manager@sha256:...' class="mt-2" />

> [!TIP]
> To find the digest of a local image:
>
> <Snippet text={"docker image inspect <IMAGE_NAME_OR_ID> --format '{{index .RepoDigests 0}}'"} class="mt-2" />
>
> To find it without pulling:
>
> <Snippet text={'docker buildx imagetools inspect ghcr.io/getarcaneapp/manager:latest --format "{{json .Manifest}}" | jq -r .digest'} class="mt-2" />

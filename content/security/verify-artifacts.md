---
title: 'Verify Artifacts'
description: 'Verify Arcane release artifacts and container images with Cosign.'
order: 1
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
import { Snippet } from '$lib/components/ui/snippet/index.js';
</script>

> [!NOTE]
> These steps apply to every Arcane release after `v1.17.4`, including all `next` images.
>
> Starting with releases after `v2.4.0`, only the checksums file carries a Sigstore bundle — individual binaries and archives are verified through it. Releases `v2.4.0` and earlier also shipped a `.sigstore.json` bundle per file.

If you want to double-check that the Arcane binary or image you downloaded is really the one we published, you can verify it with Cosign.

This includes binaries published to S3, binaries attached to GitHub Releases, and container images.

If you do not have Cosign installed yet, follow the <Link href="https://docs.sigstore.dev/cosign/system_config/installation/">official Cosign installation guide</Link>.

The Arcane public key lives at <Link href="https://getarcane.app/cosign.pub">getarcane.app/cosign.pub</Link> or in the root of the arcane github repo.

## Verify checksums

The verification flow is: verify the checksum file's signature first, then use `sha256sum` to confirm the individual files you downloaded against it.

The checksum file and its Sigstore bundle sit next to each other wherever you got your artifacts:

- GitHub Releases: `arcane_<version>_checksums.txt` and `arcane_<version>_checksums.txt.sigstore.json`
- S3 (`next` binaries): `arcane_checksums.txt` and `arcane_checksums.txt.sigstore.json`
- S3 (`next` CLI): `arcane-cli_checksums.txt` and `arcane-cli_checksums.txt.sigstore.json`

<Snippet text='cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane_checksums.txt.sigstore.json" "arcane_checksums.txt"' class="mt-2" />

<Snippet text="sha256sum -c arcane_checksums.txt" class="mt-2" />

## Verify a release binary

For releases after `v2.4.0`, individual binaries are covered by the signed checksum file — verify the checksum file as above, then check the binary against it:

<Snippet text='sha256sum -c arcane_checksums.txt --ignore-missing' class="mt-2" />

For releases `v2.4.0` and earlier, each file also has its own Sigstore bundle you can verify directly:

<Snippet text='cosign verify-blob --key "https://getarcane.app/cosign.pub" --bundle "arcane-cli_linux_amd64.sigstore.json" "arcane-cli"' class="mt-2" />

## Verify container images

Container images work the same way. Use the image digest you pulled, or the one published with the release:

<Snippet text='cosign verify --key "https://getarcane.app/cosign.pub" ghcr.io/getarcaneapp/manager@sha256:...' class="mt-2" />

> [!TIP]
> Need the image digest first? Here are a few easy ways to find it.
>
> For local images:
>
> <Snippet text="docker images --digests" class="mt-2" />
>
> <Snippet text={"docker image inspect <IMAGE_NAME_OR_ID> --format '{{index .RepoDigests 0}}'"} class="mt-2" />
>
> <Snippet text="docker inspect <IMAGE_NAME_OR_ID> | grep sha256" class="mt-2" />
>
> For remote images without pulling:
>
> <Snippet text={'docker buildx imagetools inspect ghcr.io/getarcaneapp/manager:latest --format "{{json .Manifest}}" | jq -r .digest'} class="mt-2" />
>
> If you prefer the GitHub UI, open the Arcane repository on GitHub, go to **Packages**, open the `arcane` container package, and copy the digest for the tag you want.
>
> Once you have the digest, replace `sha256:...` in the Cosign command with the real value.

That works for both stable releases and `next` images.

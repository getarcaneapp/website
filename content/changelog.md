---
title: 'Changelog'
description: 'Release notes for Arcane'
---

## v1.8.0 - 2025-11-07

[Release](https://github.com/getarcaneapp/arcane/releases/tag/v1.8.0)

> [!IMPORTANT]
> The docker images have changed to `ghcr.io/getarcaneapp/arcane` and `ghcr.io/getarcaneapp/arcane-headless` for all releases going forward.

### New features

* show image repo on untagged images ([#809](https://github.com/getarcaneapp/arcane/pull/809) by @kmendell)
* save compose files to local templates ([#834](https://github.com/getarcaneapp/arcane/pull/834) by @cabaucom376)
* merge oidc users with existing users toggle ([#860](https://github.com/getarcaneapp/arcane/pull/860) by @kmendell)

### Bug fixes

* pass version to docker file builds([c28abd4](https://github.com/getarcaneapp/arcane/commit/c28abd4798dfea7dbcb6ec9ecaef902ca785f117) by @kmendell)
* syntax highlighting not showing on code-editors([ab03008](https://github.com/getarcaneapp/arcane/commit/ab0300866f30231bb629c7158f6eec6d387e0375) by @kmendell)
* show ansi colors in log viewer([a6be63d](https://github.com/getarcaneapp/arcane/commit/a6be63d70d555a2c594390051cac0c697a4eb0df) by @kmendell)
* status badges not reactive to states([88fb669](https://github.com/getarcaneapp/arcane/commit/88fb669c5acc39752344e6ccf09e7dee4b52a491) by @kmendell)
* unable to create ipvlan or macvlan networks([5f4e9e0](https://github.com/getarcaneapp/arcane/commit/5f4e9e02eb0697789230c313e22e2c72492a8cb4) by @kmendell)
* unpinned sidebar overflow scrolling in non-expanded state ([#831](https://github.com/getarcaneapp/arcane/pull/831) by @cabaucom376)
* volumes not removed when selected on container removal dialog([bb928fe](https://github.com/getarcaneapp/arcane/commit/bb928fe72af2fadb912e7b4685667592f48101d6) by @kmendell)
* use proper derived logic for status baddge([e0d66b5](https://github.com/getarcaneapp/arcane/commit/e0d66b58bd45da4ad9e2a594bdee9dc0c8a41942) by @kmendell)

### Dependencies

* update module github.com/compose-spec/compose-go/v2 to v2.9.1 ([#810](https://github.com/getarcaneapp/arcane/pull/810) by @renovate[bot])
* update module github.com/docker/compose/v2 to v2.40.3 ([#811](https://github.com/getarcaneapp/arcane/pull/811) by @renovate[bot])
* update dependency svelte to v5.43.1 ([#814](https://github.com/getarcaneapp/arcane/pull/814) by @renovate[bot])
* update dependency eslint-plugin-svelte to v3.13.0 ([#813](https://github.com/getarcaneapp/arcane/pull/813) by @renovate[bot])
* update dependency svelte to v5.43.2 ([#816](https://github.com/getarcaneapp/arcane/pull/816) by @renovate[bot])
* update dependency @sveltejs/kit to v2.48.4 ([#819](https://github.com/getarcaneapp/arcane/pull/819) by @renovate[bot])
* update module github.com/shirou/gopsutil/v4 to v4.25.10 ([#827](https://github.com/getarcaneapp/arcane/pull/827) by @renovate[bot])
* update dependency @lucide/svelte to ^0.552.0 ([#822](https://github.com/getarcaneapp/arcane/pull/822) by @renovate[bot])
* update dependency bits-ui to v2.14.2 ([#826](https://github.com/getarcaneapp/arcane/pull/826) by @renovate[bot])
* update dependency globals to v16.5.0 ([#828](https://github.com/getarcaneapp/arcane/pull/828) by @renovate[bot])
* update eslint monorepo to v9.39.0 ([#825](https://github.com/getarcaneapp/arcane/pull/825) by @renovate[bot])
* update dependency isomorphic-dompurify to v2.31.0 ([#832](https://github.com/getarcaneapp/arcane/pull/832) by @renovate[bot])
* update module gorm.io/gorm to v1.31.1 ([#833](https://github.com/getarcaneapp/arcane/pull/833) by @renovate[bot])
* update dependency typescript-eslint to v8.46.3 ([#840](https://github.com/getarcaneapp/arcane/pull/840) by @renovate[bot])
* update dependency svelte to v5.43.3 ([#843](https://github.com/getarcaneapp/arcane/pull/843) by @renovate[bot])
* update dependency @codemirror/lint to v6.9.2 ([#838](https://github.com/getarcaneapp/arcane/pull/838) by @renovate[bot])
* update eslint monorepo to v9.39.1 ([#841](https://github.com/getarcaneapp/arcane/pull/841) by @renovate[bot])
* update dependency @types/node to v24.10.0 ([#836](https://github.com/getarcaneapp/arcane/pull/836) by @renovate[bot])
* update dependency axios to v1.13.2 ([#844](https://github.com/getarcaneapp/arcane/pull/844) by @renovate[bot])
* update dependency @uiw/codemirror-theme-github to v4.25.3 ([#846](https://github.com/getarcaneapp/arcane/pull/846) by @renovate[bot])
* update dependency @uiw/codemirror-themes to v4.25.3 ([#847](https://github.com/getarcaneapp/arcane/pull/847) by @renovate[bot])
* update dependency vite to v7.2.0 ([#849](https://github.com/getarcaneapp/arcane/pull/849) by @renovate[bot])
* update dependency sveltekit-superforms to v2.28.1 ([#848](https://github.com/getarcaneapp/arcane/pull/848) by @renovate[bot])
* update dependency svelte to v5.43.4 ([#858](https://github.com/getarcaneapp/arcane/pull/858) by @renovate[bot])
* bump github.com/containerd/containerd/v2 from 2.1.4 to 2.1.5 in /backend in the go_modules group across 1 directory ([#857](https://github.com/getarcaneapp/arcane/pull/857) by @dependabot[bot])
* update dependency vite to v7.2.1 ([#854](https://github.com/getarcaneapp/arcane/pull/854) by @renovate[bot])
* update module github.com/docker/docker to v28.5.2+incompatible ([#852](https://github.com/getarcaneapp/arcane/pull/852) by @renovate[bot])
* update module github.com/docker/cli to v28.5.2+incompatible ([#851](https://github.com/getarcaneapp/arcane/pull/851) by @renovate[bot])
* update module github.com/go-co-op/gocron/v2 to v2.18.0 ([#853](https://github.com/getarcaneapp/arcane/pull/853) by @renovate[bot])
* update tailwindcss monorepo to v4.1.17 ([#859](https://github.com/getarcaneapp/arcane/pull/859) by @renovate[bot])
* update dependency vite to v7.2.2 ([#864](https://github.com/getarcaneapp/arcane/pull/864) by @renovate[bot])
* update dependency @lucide/svelte to ^0.553.0 ([#865](https://github.com/getarcaneapp/arcane/pull/865) by @renovate[bot])
* update dependency react-email to v5 ([#868](https://github.com/getarcaneapp/arcane/pull/868) by @renovate[bot])
* update dependency @react-email/preview-server to v5 ([#867](https://github.com/getarcaneapp/arcane/pull/867) by @renovate[bot])
* update dependency @react-email/components to v1 ([#866](https://github.com/getarcaneapp/arcane/pull/866) by @renovate[bot])
* update dependency vite to v7.2.2 ([#869](https://github.com/getarcaneapp/arcane/pull/869) by @renovate[bot])

### Other

* responsive create container dialog ([#830](https://github.com/getarcaneapp/arcane/pull/830) by @cabaucom376)
* use depot builders and images([2bb159d](https://github.com/getarcaneapp/arcane/commit/2bb159d6996abcc223c73ccce9a39b1f42af1283) by @kmendell)
* fix typo in image name([2e49791](https://github.com/getarcaneapp/arcane/commit/2e49791c40ccc55b50d6736eab9dec98e4f97236) by @kmendell)
* build e2e tests image with depot([52aaac4](https://github.com/getarcaneapp/arcane/commit/52aaac459c6cb27f0cde0ea0c3649b306a6f86ef) by @kmendell)
* use depot token([6ad13a3](https://github.com/getarcaneapp/arcane/commit/6ad13a3dfa9f540650350afc1568e24f8c4f95c0) by @kmendell)
* remove double outputs([3a619d0](https://github.com/getarcaneapp/arcane/commit/3a619d0e24a85080a7dc3aa467d45c07a4a32404) by @kmendell)
* use depot registry([0cebb42](https://github.com/getarcaneapp/arcane/commit/0cebb42cd164b6703d7e99df77b0d0c3d5ae1aa3) by @kmendell)
* use depot token for all builds([65601d5](https://github.com/getarcaneapp/arcane/commit/65601d55e294710625d184a8adae6acc5024b1a0) by @kmendell)
* use go cache from depot([e83c717](https://github.com/getarcaneapp/arcane/commit/e83c717a96cc4e346d2e6edb67b11a922db0cb38) by @kmendell)
* revert depot usage for some workflows([fd369d1](https://github.com/getarcaneapp/arcane/commit/fd369d1d39b3e3e98c3608e36e23ce58d2ba634a) by @kmendell)
* extended dashboard tables ([#871](https://github.com/getarcaneapp/arcane/pull/871) by @kmendell)



**Full Changelog**: https://github.com/getarcaneapp/arcane/compare/v1.7.2...v1.8.0


## v1.7.2 - 2025-10-30

[Release](https://github.com/ofkm/arcane/releases/tag/v1.7.2)

### Bug fixes

* syntax highlighting not showing on code-editors([027155e](https://github.com/ofkm/arcane/commit/027155e092d0b91ff6c9b52d77149456deac9f72) by @kmendell)
* pass version to docker file builds([8a136cd](https://github.com/ofkm/arcane/commit/8a136cd51e52f4721452e1a32d4a17523a22de1c) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.7.1...v1.7.2


## v1.7.1 - 2025-10-30

[Release](https://github.com/ofkm/arcane/releases/tag/v1.7.1)


### Bug fixes

* mobile overscroll issues([fa0a7d2](https://github.com/ofkm/arcane/commit/fa0a7d254cf2339a55ba76303b585d43b93dda1c) by @kmendell)
* use correct background colors for components when glass is disabled([615c21f](https://github.com/ofkm/arcane/commit/615c21f13244a95c00bdb22e62209a8876b16a89) by @kmendell)
* event details dialog header padding([55dca66](https://github.com/ofkm/arcane/commit/55dca6690e811e06cbb9e4cd159fefb4847903fc) by @kmendell)
* cpu count not showing under cpu meter([30cab56](https://github.com/ofkm/arcane/commit/30cab5657f79cccf9e07fb4394ced5db9e4d8f31) by @kmendell)
* settings state not persisted across settings pages([46bbe93](https://github.com/ofkm/arcane/commit/46bbe93c862d8f7014e2303f8280e33a293dae10) by @kmendell)
* notification settings does not show on the settings overview page([6354f9c](https://github.com/ofkm/arcane/commit/6354f9c3cf73a7fe96815b39634d3ad54feecfd2) by @kmendell)
* properly log error events to event table([caef210](https://github.com/ofkm/arcane/commit/caef21052fb92be51588da7eff5d301612f2e59a) by @kmendell)

### Other

* bump svelte from 5.42.3 to 5.43.0 in the prod-dependencies group ([#796](https://github.com/ofkm/arcane/pull/796) by @dependabot[bot])
* bump @types/node from 24.9.1 to 24.9.2 in the dev-dependencies group ([#797](https://github.com/ofkm/arcane/pull/797) by @dependabot[bot])
* Configure Renovate ([#803](https://github.com/ofkm/arcane/pull/803) by @renovate[bot])
* remove dependabot config([019f3d6](https://github.com/ofkm/arcane/commit/019f3d6ee8279cf3173de51a048121721e45616e) by @kmendell)
* update renovate config to include semantic commit type for chores([a2f24ce](https://github.com/ofkm/arcane/commit/a2f24ce4f1c836a6a89fec0525fa9fff8d3674d1) by @kmendell)
* disable renovate dashboard([dc79404](https://github.com/ofkm/arcane/commit/dc7940466ac2a8672797434208b9b8d255431757) by @kmendell)
* update dependency @sveltejs/kit to v2.48.3 ([#802](https://github.com/ofkm/arcane/pull/802) by @renovate[bot])
* update dependency @eslint/compat to v1.4.1 ([#801](https://github.com/ofkm/arcane/pull/801) by @renovate[bot])
* upgrade github.com/shirou/gopsutil to v4([57fa42c](https://github.com/ofkm/arcane/commit/57fa42c4f18c1eb1854d46b939694e2ec4561599) by @kmendell)
* layout and design of docker info dialog([3004447](https://github.com/ofkm/arcane/commit/300444703d6770f5372a28c2cec852ddaeeeca7d) by @kmendell)
* use SettingsForm hook for managing settings logic and state([e09a808](https://github.com/ofkm/arcane/commit/e09a808d09f7f1593969be11a43707224d6c7398) by @kmendell)
* fix backend linter([d36f6ad](https://github.com/ofkm/arcane/commit/d36f6ad566d504ad03126a52583c1493bff8fe54) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.7.0...v1.7.1


## v1.7.0 - 2025-10-29

[Release](https://github.com/ofkm/arcane/releases/tag/v1.7.0)

### New features

* arcane cli `generate secret` command ([#760](https://github.com/ofkm/arcane/pull/760) by @kmendell)
* notification system for container and image updates ([#730](https://github.com/ofkm/arcane/pull/730) by @kmendell)
* add hostname to dashboard([492222d](https://github.com/ofkm/arcane/commit/492222d26872fd51879760345bdfa4bfe1c66e39) by @kmendell)
* arcane self-updater ([#744](https://github.com/ofkm/arcane/pull/744) by @kmendell)

### Bug fixes

* text inputs not using correct string or number type for input boxes([215d8ed](https://github.com/ofkm/arcane/commit/215d8ed6e3847f7405607118f0ac986f089e5ae2) by @kmendell)
* project env interpolation not parsing env files in correct order ([#751](https://github.com/ofkm/arcane/pull/751) by @kmendell)
* load project services concurrently ([#758](https://github.com/ofkm/arcane/pull/758) by @kmendell)
* only log entrypoint when running the base arcane command([e95093f](https://github.com/ofkm/arcane/commit/e95093f2ad90b878d43ffb91b8d7a12eaf654f0c) by @kmendell)
* refresh environment on all pages([44501d4](https://github.com/ofkm/arcane/commit/44501d492f88f5b8e6f938e4844b3568406012e9) by @kmendell)
* properly persist local vs environment settings ([#775](https://github.com/ofkm/arcane/pull/775) by @kmendell)
* remove default route from customize overview ([#776](https://github.com/ofkm/arcane/pull/776) by @cabaucom376)
* responsive dialog overflow ([#786](https://github.com/ofkm/arcane/pull/786) by @cabaucom376)
* scroll-to-hide by mode, fix detachment ([#781](https://github.com/ofkm/arcane/pull/781) by @cabaucom376)
* containers unable to be sorted by name([f1905ed](https://github.com/ofkm/arcane/commit/f1905ed1b95caef0f7637de8058aeae338a83ba8) by @kmendell)
* stat card columns([ac05b46](https://github.com/ofkm/arcane/commit/ac05b463c7ed7537d1ebcf2f08aca2c87071654c) by @kmendell)
* date locale cant be loaded from date-fns if locale is en([947655c](https://github.com/ofkm/arcane/commit/947655c30dd9be29c81a42a0ccce35d1a6fdb858) by @kmendell)
* popovers fully transparent without glassmorphism ([#793](https://github.com/ofkm/arcane/pull/793) by @cabaucom376)
* encryption key validation errors([b3c7cb5](https://github.com/ofkm/arcane/commit/b3c7cb5bd64c6a5d49a0950ae7bde01f42910f4d) by @kmendell)
* sessions not using refresh tokens ([#795](https://github.com/ofkm/arcane/pull/795) by @kmendell)

### Other

* bump the dev-dependencies group with 3 updates ([#743](https://github.com/ofkm/arcane/pull/743) by @dependabot[bot])
* bump github.com/docker/compose/v2 from 2.40.0 to 2.40.1 in /backend in the backend-dependencies group ([#745](https://github.com/ofkm/arcane/pull/745) by @dependabot[bot])
* bump the prod-dependencies group with 6 updates ([#742](https://github.com/ofkm/arcane/pull/742) by @dependabot[bot])
* use ellipsis instead of three dots in source strings ([#748](https://github.com/ofkm/arcane/pull/748) by @blfpd)
* use ellipsis instead of three dots in translated strings ([#749](https://github.com/ofkm/arcane/pull/749) by @blfpd)
* add greptile.json configuration file([7e3c645](https://github.com/ofkm/arcane/commit/7e3c645e0cc8c75d245338840a343cf1664088b9) by @kmendell)
* bump vite from 7.1.10 to 7.1.11 in the npm_and_yarn group across 1 directory ([#752](https://github.com/ofkm/arcane/pull/752) by @dependabot[bot])
* move settings/customize search to backend ([#739](https://github.com/ofkm/arcane/pull/739) by @kmendell)
* bump @types/node from 24.8.1 to 24.9.1 in the dev-dependencies group ([#754](https://github.com/ofkm/arcane/pull/754) by @dependabot[bot])
* bump the prod-dependencies group with 4 updates ([#753](https://github.com/ofkm/arcane/pull/753) by @dependabot[bot])
* fix linter about complexity([bc99f5a](https://github.com/ofkm/arcane/commit/bc99f5af5d03ddf01854140d335d309b005322e3) by @kmendell)
* remove onboarding screens with simple change password dialog ([#759](https://github.com/ofkm/arcane/pull/759) by @kmendell)
* bump isomorphic-dompurify from 2.29.0 to 2.30.0 in the prod-dependencies group ([#761](https://github.com/ofkm/arcane/pull/761) by @dependabot[bot])
* bump pnpm to 10.19.0([7046e7e](https://github.com/ofkm/arcane/commit/7046e7e1f3e7ee79f21095c41bc8b25251a1e2e0) by @kmendell)
* show correct version on non-release builds([d0b6b35](https://github.com/ofkm/arcane/commit/d0b6b354de711e6abc392c7e5eb2ac4238bef744) by @kmendell)
* pass version arguments to next build([be7222a](https://github.com/ofkm/arcane/commit/be7222ae7eb707c306be9ae593071a7ca81c52e4) by @kmendell)
* bump frontend and tests pnpm version to 10.19.0([a441293](https://github.com/ofkm/arcane/commit/a441293ad308d9c06dbbb7347e5db146f6762755) by @kmendell)
* tweak glass-ui styling([f6edd50](https://github.com/ofkm/arcane/commit/f6edd5025e9522e7f0978c26bf8fc37521073c0b) by @kmendell)
* bump vite from 7.1.11 to 7.1.12 in the dev-dependencies group ([#769](https://github.com/ofkm/arcane/pull/769) by @dependabot[bot])
* bump the prod-dependencies group across 1 directory with 9 updates ([#774](https://github.com/ofkm/arcane/pull/774) by @dependabot[bot])
* tweak glass ui on sheets and dialogs([051fee6](https://github.com/ofkm/arcane/commit/051fee6d18d729bd52b49435fc6a0db1fec83516) by @kmendell)
* update backend deps([7de538c](https://github.com/ofkm/arcane/commit/7de538c550da99aaa6bc54e3f2536afa79ebdff5) by @kmendell)
* use env interpolation in project tests([7ba22ce](https://github.com/ofkm/arcane/commit/7ba22ceaef0b6c80a76a688185114696bbb02a37) by @kmendell)
* use correct project logs heading selector([2742223](https://github.com/ofkm/arcane/commit/2742223e8b191c032543bd610ccafc7227794451) by @kmendell)
* use correct project logs button selectors([dbecb46](https://github.com/ofkm/arcane/commit/dbecb460bffed17089d3ae527b9e989b4549bc58) by @kmendell)
* use drawers on mobile and dialogs on desktop([89beadc](https://github.com/ofkm/arcane/commit/89beadc5dcdbcc03ccd4426e494803179a760a95) by @kmendell)
* better align glass ui in production builds([ed9b171](https://github.com/ofkm/arcane/commit/ed9b1715542fd145c7f9618fe77eff8cb1a00c24) by @kmendell)
* login screen styling ([#780](https://github.com/ofkm/arcane/pull/780) by @cabaucom376)
* bump the prod-dependencies group with 4 updates ([#784](https://github.com/ofkm/arcane/pull/784) by @dependabot[bot])
* bump actions/upload-artifact from 4 to 5 ([#782](https://github.com/ofkm/arcane/pull/782) by @dependabot[bot])
* bump actions/download-artifact from 5 to 6 ([#783](https://github.com/ofkm/arcane/pull/783) by @dependabot[bot])
* update dialog overflow ([#788](https://github.com/ofkm/arcane/pull/788) by @cabaucom376)
* use accent color for card header ([#789](https://github.com/ofkm/arcane/pull/789) by @cabaucom376)
* table styling ([#787](https://github.com/ofkm/arcane/pull/787) by @cabaucom376)
* run formatter([a89581e](https://github.com/ofkm/arcane/commit/a89581e2a3229c29bc6cd9628edbc3191ba0795c) by @kmendell)
* restore solid backgrounds for non-glass ui([38f919b](https://github.com/ofkm/arcane/commit/38f919b3e6fbe834ee0108a33bc94e0a068405e1) by @kmendell)
* use dropdown card component for group by project([b26f873](https://github.com/ofkm/arcane/commit/b26f87347697187fee4d8a717d10e17061a9f3bb) by @kmendell)
* use new ubuntu-slim runner for smaller workflows([51213a4](https://github.com/ofkm/arcane/commit/51213a40ed798a7b6f9124a75a6027e64d35c7ef) by @kmendell)
* revert ubuntu-slim workflows([6ead191](https://github.com/ofkm/arcane/commit/6ead191a36e5e38f06b6db8d87c0482d7b5d8a28) by @kmendell)
* bump validator.js to 13.15.20([db216dd](https://github.com/ofkm/arcane/commit/db216dd5383e2f53f8d3453868996a234d7a6e5d) by @kmendell)
* bump pnpm to 10.20.0([5241be7](https://github.com/ofkm/arcane/commit/5241be7aeb2aae2202d0e00a371cfe0d6426d3a0) by @kmendell)
* table cell newline wrapping fix ([#792](https://github.com/ofkm/arcane/pull/792) by @cabaucom376)
* bump the prod-dependencies group across 1 directory with 6 updates ([#794](https://github.com/ofkm/arcane/pull/794) by @dependabot[bot])
* bump @types/dockerode from 3.3.44 to 3.3.45 in the dev-dependencies group ([#785](https://github.com/ofkm/arcane/pull/785) by @dependabot[bot])
* change upgrader image tag to 'latest'([882edae](https://github.com/ofkm/arcane/commit/882edae20675cb23f22e33fd8e01b9219592b06b) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.6.0...v1.7.0

---
title: 'Changelog'
description: 'Release notes for Arcane'
---

## v1.6.0 - 2025-10-19

[Release](https://github.com/ofkm/arcane/releases/tag/v1.6.0)


### New features

* redeisgned templates pages ([#648](https://github.com/ofkm/arcane/pull/648) by @cabaucom376)
* show project status reason ([#708](https://github.com/ofkm/arcane/pull/708) by @kmendell)
* configurable hover and pinned states for sidebar ([#720](https://github.com/ofkm/arcane/pull/720) by @kmendell)
* add glass effect ui preview (disabled by default) ([#733](https://github.com/ofkm/arcane/pull/733) by @kmendell)

### Bug fixes

* mobile navigation glitches and scrolling issues ([#709](https://github.com/ofkm/arcane/pull/709) by @kmendell)
* show users full name instead of username in mobile user card([0086f31](https://github.com/ofkm/arcane/commit/0086f314fecacd4f37794992f42d299b85b46502) by @kmendell)
* display toast at the top on mobile and tablet devices([80decef](https://github.com/ofkm/arcane/commit/80decefdf27621a8373a0b009da1cbed0736bc8b) by @kmendell)
* save button showing behind mobile nav bar([574e22c](https://github.com/ofkm/arcane/commit/574e22c6ec0ab2c6f6eb2df4cb8d2fff34df6ba4) by @kmendell)
* environment hostname text showing under select input on mobile sheet([ac0f1fa](https://github.com/ofkm/arcane/commit/ac0f1fa671a045aecd4792825d44b6af7eda16ff) by @kmendell)
* card headers not reactive to mode-watchers theme([6aad161](https://github.com/ofkm/arcane/commit/6aad16113316fbcea28c14785074f620fe363ae9) by @kmendell)
* display full image sha256 on image details page([2f0bab5](https://github.com/ofkm/arcane/commit/2f0bab53a9089f23ed00b4975109231e1b825f3c) by @kmendell)
* show customization sub routes in mobile navigation([07713ce](https://github.com/ofkm/arcane/commit/07713ced938195def6852ac8dc35d8f9d1b5f009) by @kmendell)
* mobile nav sheet not working on small desktop screens([14bd338](https://github.com/ofkm/arcane/commit/14bd338107b2e8136599599116fe88cd0fee015d) by @kmendell)
* velocity to open nav sheet in mobile view([3d436a1](https://github.com/ofkm/arcane/commit/3d436a13ff78f48d9922affdfd4d7e9d0e6deda6) by @kmendell)
* sub nav items now showing in hover mode([c60e954](https://github.com/ofkm/arcane/commit/c60e954a7ffd92319bd028111fccc3bd035c34d9) by @kmendell)
* include version in jwt for auth sessions after updating the server ([#724](https://github.com/ofkm/arcane/pull/724) by @kmendell)
* update file permissions to 0644 for project and template file creations([ca66f44](https://github.com/ofkm/arcane/commit/ca66f44df33f8f5520776371b3c2303f4b9ff42e) by @kmendell)
* handle Docker socket GID conflict in entrypoint  ([#735](https://github.com/ofkm/arcane/pull/735) by @jae-jae)
* hidden table columns data still showing even if the column is hidden([aced2a6](https://github.com/ofkm/arcane/commit/aced2a6eefaaba89525b8cbfd180e826fac92891) by @kmendell)
* update icon import ([#737](https://github.com/ofkm/arcane/pull/737) by @cabaucom376)
* z-index of search icons on settings and customize pages([87af81c](https://github.com/ofkm/arcane/commit/87af81c68475c84acdfe46c62ae97e34370320a5) by @kmendell)
* sidebar items not expanding in non hover mode([515d442](https://github.com/ofkm/arcane/commit/515d4420ff3ef5e231b0175b9f388165a7929295) by @kmendell)

### Other

* add Deutsch files([31dfa46](https://github.com/ofkm/arcane/commit/31dfa46d96e254f3bc72d48e7b56d24da4fc20c4) by @kmendell)
* bump github.com/go-co-op/gocron/v2 from 2.16.6 to 2.17.0 in /backend in the backend-dependencies group ([#701](https://github.com/ofkm/arcane/pull/701) by @dependabot[bot])
* bump the prod-dependencies group with 3 updates ([#699](https://github.com/ofkm/arcane/pull/699) by @dependabot[bot])
* bump @types/node from 24.7.1 to 24.7.2 in the dev-dependencies group ([#700](https://github.com/ofkm/arcane/pull/700) by @dependabot[bot])
* restructure scripts directory([9cd3333](https://github.com/ofkm/arcane/commit/9cd3333f2744ef7f391a31f7049e8980e4ff0617) by @kmendell)
* service worker caching tweaks([86057f1](https://github.com/ofkm/arcane/commit/86057f1c96976e8237122c2734c5451a360b9b4e) by @kmendell)
* update runner tags([c04af97](https://github.com/ofkm/arcane/commit/c04af97593922143035586f499df9524d00d1a9b) by @kmendell)
* upgrade deps([614130a](https://github.com/ofkm/arcane/commit/614130aace9470669acc4c4af5da9f6a0099a225) by @kmendell)
* remove docker build cloud from ci/cd([3063dc1](https://github.com/ofkm/arcane/commit/3063dc161fa9a72f31cdbad2a7064cf0cdeb3b32) by @kmendell)
* pin runed to 0.34.0([2946ad7](https://github.com/ofkm/arcane/commit/2946ad79d0a40596be020cef2c4b431778ebb982) by @kmendell)
* fix linter([d6290b6](https://github.com/ofkm/arcane/commit/d6290b67823c29713ab3b2a6674f5c202b98f41c) by @kmendell)
* fix after last merge([4a73728](https://github.com/ofkm/arcane/commit/4a73728f12eb8410f3547a93b6cc58491fb4f275) by @kmendell)
* bump the dev-dependencies group with 2 updates ([#716](https://github.com/ofkm/arcane/pull/716) by @dependabot[bot])
* bump the prod-dependencies group across 1 directory with 3 updates ([#717](https://github.com/ofkm/arcane/pull/717) by @dependabot[bot])
* pin setup-node to latest commit hash of v5([4851729](https://github.com/ofkm/arcane/commit/48517296c3650059a0e5d705e7a0235541b5f652) by @kmendell)
* bump sveltekit-superforms from 2.27.3 to 2.27.4 in the npm_and_yarn group across 1 directory ([#719](https://github.com/ofkm/arcane/pull/719) by @dependabot[bot])
* consolidate build next workflows using matrix([5e4229b](https://github.com/ofkm/arcane/commit/5e4229b39bce53e1cb452505c4d80e7eb3fa8270) by @kmendell)
* build next images one after another([d06ec48](https://github.com/ofkm/arcane/commit/d06ec48070012393f59f547b1d14d28008f334b0) by @kmendell)
* use ubuntu-latest for workflow builds([e2e62b6](https://github.com/ofkm/arcane/commit/e2e62b6048ca75be27f9cfe1ebe9ba8abda59ec7) by @kmendell)
* unify project, env, and template file writing logic ([#725](https://github.com/ofkm/arcane/pull/725) by @kmendell)
* bump the dev-dependencies group with 2 updates ([#728](https://github.com/ofkm/arcane/pull/728) by @dependabot[bot])
* bump the prod-dependencies group with 5 updates ([#727](https://github.com/ofkm/arcane/pull/727) by @dependabot[bot])
* replace custom sheet with drawer component ([#726](https://github.com/ofkm/arcane/pull/726) by @kmendell)
* tweak dockerfile([e640439](https://github.com/ofkm/arcane/commit/e6404392c811bbf7dadd2c773f7f184c011c5360) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.5.2...v1.6.0


## v1.5.2 - 2025-10-13

[Release](https://github.com/ofkm/arcane/releases/tag/v1.5.2)


### Bug fixes

* remove custom timestamps and rely solely on dockers log timestamps([c69e00a](https://github.com/ofkm/arcane/commit/c69e00a30f9b546a3b095faef010bff746197e5d) by @kmendell)
* container metrics not respecting the cpu limit / count([f9840de](https://github.com/ofkm/arcane/commit/f9840de4f06cf5a844731af804b6b19d82bf0c8a) by @kmendell)
* registry credentials not reliably being passed to remote environments([31cfd54](https://github.com/ofkm/arcane/commit/31cfd540dbd7130876685f56055a361e9a7f1d68) by @kmendell)
* revert development compose deploy limits ([#697](https://github.com/ofkm/arcane/pull/697) by @cabaucom376)
* update registry template url to new domain([1ee3f1c](https://github.com/ofkm/arcane/commit/1ee3f1c7634b68dbb40969b30945659f18a71962) by @kmendell)

### Performance Improvements

* use service-worker and better caching headers to better manage cache problems after updates([3200b39](https://github.com/ofkm/arcane/commit/3200b395bcef1c7f9fee3954c8b327fbb3d023a9) by @kmendell)

### Other

* fix go import check([fd2a50b](https://github.com/ofkm/arcane/commit/fd2a50b49b4801f6fe682b3e878d64f2a87579fb) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.5.1...v1.5.2


## v1.5.1 - 2025-10-12

[Release](https://github.com/ofkm/arcane/releases/tag/v1.5.1)


### Bug fixes

* do not log _app directory([a9efa58](https://github.com/ofkm/arcane/commit/a9efa586d5e20c3b6ea171adb6eccb7c9ef9c68e) by @kmendell)
* selected environment id not persisting across refreshes([d87db5b](https://github.com/ofkm/arcane/commit/d87db5b83cfa05c0a995dfb9a1bbf5219ad3e7c3) by @kmendell)
* accent color not reset after settings form reset([99fb83d](https://github.com/ofkm/arcane/commit/99fb83d273bcd4a4266a9ac8a735c67a1dc306d6) by @kmendell)
* project -> service back button not returning to project page([cbb6faa](https://github.com/ofkm/arcane/commit/cbb6faa9129cf5e9e950c635f3d0d68f2c9f459f) by @kmendell)
* rework project redeploy logic to use compose pull & compose up -d([a5e377b](https://github.com/ofkm/arcane/commit/a5e377bee5f1871133cd0fb5351758c4f12a43c4) by @kmendell)
* use project/container name in action toast messages([3a7ea34](https://github.com/ofkm/arcane/commit/3a7ea34e272d220b777642dc4a8134169867f711) by @kmendell)
* use accent color for code editor highlighter([ee6a0ad](https://github.com/ofkm/arcane/commit/ee6a0adb68fbb87386730351416811d57d702369) by @kmendell)
* proper light and dark modes for container terminal([5c624c1](https://github.com/ofkm/arcane/commit/5c624c1114b652c589ad8720aebd08130382800f) by @kmendell)
* tail container and project logs properly on all ws hubs([b861c19](https://github.com/ofkm/arcane/commit/b861c19757bcdbd52a4ee109e497a323900d0b66) by @kmendell)
* show exposed non published ports for containers([1dcc8b2](https://github.com/ofkm/arcane/commit/1dcc8b2c19dc7f53be28dedab276d3c850284f32) by @kmendell)
* log viewer column layout duplicating timestamps, and un-needed scrollbars([3a1aeb5](https://github.com/ofkm/arcane/commit/3a1aeb5b6b7cf26c92b9d39c5c7150f2c75f8946) by @kmendell)
* volumes not showing containers they are being used by([6eac860](https://github.com/ofkm/arcane/commit/6eac860bcc93f91b4d9d0708bbc1867f581377b3) by @kmendell)
* cache diskUsagePath setting to stop repeated database calls([4cd637b](https://github.com/ofkm/arcane/commit/4cd637b439bb19979eccfd99fcf4765e58f09ef8) by @kmendell)

### Other

* use parent layout settings to avoid duplicate api calls([fb89650](https://github.com/ofkm/arcane/commit/fb89650b37bb8756ecf3eb8febe6079ddf6d722b) by @kmendell)
* bump to 10.18.2([8812a58](https://github.com/ofkm/arcane/commit/8812a58d3e5f6978eaa861934f99ad4674c38bc7) by @kmendell)
* run formatter([57300b9](https://github.com/ofkm/arcane/commit/57300b9a5aac0ea3e1a413da2f9917099790ef21) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.5.0...v1.5.1


## v1.5.0 - 2025-10-11

[Release](https://github.com/ofkm/arcane/releases/tag/v1.5.0)

### New features

* docker socket proxy support via environment variable ([#616](https://github.com/ofkm/arcane/pull/616) by @kmendell)
* configurable disk usage path ([#650](https://github.com/ofkm/arcane/pull/650) by @kmendell)
* health status on project service card ([#658](https://github.com/ofkm/arcane/pull/658) by @kmendell)
* customizable accent color ([#678](https://github.com/ofkm/arcane/pull/678) by @kmendell)
* allow filtering events by severity([65c7c75](https://github.com/ofkm/arcane/commit/65c7c75d7f988e5fa59613abddf478ee13a2939a) by @kmendell)
* show volume size in table ([#685](https://github.com/ofkm/arcane/pull/685) by @kmendell)

### Bug fixes

* remove tag based update logic and only use digests ([#627](https://github.com/ofkm/arcane/pull/627) by @kmendell)
* allow both pkce and plain auth challenges([fb4ac74](https://github.com/ofkm/arcane/commit/fb4ac74c0897cb8a1eaabe54dd98a6fa88242d2e) by @kmendell)
* use 'up' and 'down' labels for project table actions([e9d8d38](https://github.com/ofkm/arcane/commit/e9d8d38507f9c5b22197e88f129f215ec155dfbc) by @kmendell)
* use proper --all filter for volume pruning([734015b](https://github.com/ofkm/arcane/commit/734015ba290d954c68349a3f65d8d873ac806155) by @kmendell)
* use correct response messages for container registry test ([#665](https://github.com/ofkm/arcane/pull/665) by @kmendell)
* memory leak in websocket connections ([#664](https://github.com/ofkm/arcane/pull/664) by @kmendell)
* default shell not able to be overridden([2d65952](https://github.com/ofkm/arcane/commit/2d65952525b5a94c19e107579aa817148cb3e068) by @kmendell)
* unable to set global env when ui config is disabled([dfb9192](https://github.com/ofkm/arcane/commit/dfb91924c57d5591aebb600843292cbfe94bc5e4) by @kmendell)
* project editor height on project creation page([7d1ff5b](https://github.com/ofkm/arcane/commit/7d1ff5b227636641a31ba64834d75fa6f753bee5) by @kmendell)
* add proper borders to event stat cards([4523985](https://github.com/ofkm/arcane/commit/45239859233d1185cdcf672113969682ef7a1c20) by @kmendell)

### Other

* fix ES translations ([#630](https://github.com/ofkm/arcane/pull/630) by @vsc55)
* bump the backend-dependencies group in /backend with 2 updates ([#646](https://github.com/ofkm/arcane/pull/646) by @dependabot[bot])
* move compose examples to separate folder([aab7d3a](https://github.com/ofkm/arcane/commit/aab7d3ab966ab9b0697aeb9b93b3a11e5b752650) by @kmendell)
* update readme note([8f32754](https://github.com/ofkm/arcane/commit/8f32754f1e262334c9c4dd26f62c8c9ad29dfb32) by @kmendell)
* bump the prod-dependencies group with 4 updates ([#644](https://github.com/ofkm/arcane/pull/644) by @dependabot[bot])
* bump eslint from 9.36.0 to 9.37.0 in the dev-dependencies group ([#645](https://github.com/ofkm/arcane/pull/645) by @dependabot[bot])
* ensure proper handling of contexts and spec ([#647](https://github.com/ofkm/arcane/pull/647) by @kmendell)
* cleanup and simplify application bootstrap ([#651](https://github.com/ofkm/arcane/pull/651) by @kmendell)
* bump the prod-dependencies group with 4 updates ([#654](https://github.com/ofkm/arcane/pull/654) by @dependabot[bot])
* fix logic with e2e tests caching([f910e39](https://github.com/ofkm/arcane/commit/f910e3989104528e732921a53ca782133ab47629) by @kmendell)
* use up and down selectors([d3d0607](https://github.com/ofkm/arcane/commit/d3d060703a27b4301338764b59b855404db4bc22) by @kmendell)
* bump the dev-dependencies group with 2 updates ([#655](https://github.com/ofkm/arcane/pull/655) by @dependabot[bot])
* bump the prod-dependencies group with 3 updates ([#660](https://github.com/ofkm/arcane/pull/660) by @dependabot[bot])
* fix internal response of challenge manager([3d7187d](https://github.com/ofkm/arcane/commit/3d7187dda8b5b3cb578f010de6e593ca5b80b02c) by @kmendell)
* update readme with new logo([4b34d0c](https://github.com/ofkm/arcane/commit/4b34d0caa92ebb39c75217f91e03f18998c5c840) by @kmendell)
* serve images from backend vs static frontend assets ([#671](https://github.com/ofkm/arcane/pull/671) by @kmendell)
* bump the backend-dependencies group in /backend with 4 updates ([#667](https://github.com/ofkm/arcane/pull/667) by @dependabot[bot])
* bump the prod-dependencies group with 3 updates ([#666](https://github.com/ofkm/arcane/pull/666) by @dependabot[bot])
* bump @types/node from 24.7.0 to 24.7.1 in the dev-dependencies group ([#672](https://github.com/ofkm/arcane/pull/672) by @dependabot[bot])
* update pwa assets ([#673](https://github.com/ofkm/arcane/pull/673) by @kmendell)
* use docker build cloud([01a6dc2](https://github.com/ofkm/arcane/commit/01a6dc217eb0adaf02113376c35e109ecff75b77) by @kmendell)
* add docker build cloud for release and e2e tests([7a981ce](https://github.com/ofkm/arcane/commit/7a981ce1231c383460c03c42eecfc7462e1add2d) by @kmendell)
* remove docker build cloud for e2e tests([2675285](https://github.com/ofkm/arcane/commit/2675285f0013fb696bdd69ffb3e05c12108ff0e5) by @kmendell)
* improve types on loading indicator([2118d6f](https://github.com/ofkm/arcane/commit/2118d6fddcf7409b497728c85fe27db93a529465) by @kmendell)
* use root page for /customize route ([#675](https://github.com/ofkm/arcane/pull/675) by @kmendell)
* use new empty component([dad95bc](https://github.com/ofkm/arcane/commit/dad95bc371205816a22f7af123131c4dfe444904) by @kmendell)
* use shadcn spinner component ([#676](https://github.com/ofkm/arcane/pull/676) by @kmendell)
* update global variable input design([87f60d6](https://github.com/ofkm/arcane/commit/87f60d696b98651c8ae252e6d1d5b974cb461786) by @kmendell)
* bump github.com/quic-go/quic-go from 0.54.0 to 0.54.1 in /backend in the go_modules group across 1 directory ([#679](https://github.com/ofkm/arcane/pull/679) by @dependabot[bot])
* cleanup svelte components ([#681](https://github.com/ofkm/arcane/pull/681) by @kmendell)
* remove stat cards from users page([bfcfc84](https://github.com/ofkm/arcane/commit/bfcfc849ecfe2023caa5d074e854d1e4e5c3f502) by @kmendell)
* simplify stat card([319557e](https://github.com/ofkm/arcane/commit/319557eb723faa68a666af0175d8424bcb65881f) by @kmendell)
* skip volume test if no inuse volumes([324edbf](https://github.com/ofkm/arcane/commit/324edbf380969f9a396f139224b0225c851dffd3) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.4.0...v1.5.0


## v1.4.0 - 2025-10-05

[Release](https://github.com/ofkm/arcane/releases/tag/v1.4.0)

### New features

* interactive shell access to containers ([#611](https://github.com/ofkm/arcane/pull/611) by @kmendell )
* container stats websocket, and overhaul ([#612](https://github.com/ofkm/arcane/pull/612) by @kmendell)
* configure settings on environments via the web ui ([#613](https://github.com/ofkm/arcane/pull/613) by @kmendell)
* global compose and env defaults configuration ([#617](https://github.com/ofkm/arcane/pull/617) by @kmendell)
* global environment variables ([#620](https://github.com/ofkm/arcane/pull/620) by @cabaucom376)
* mobile responsive tables ([#597](https://github.com/ofkm/arcane/pull/597) by @cabaucom376)
* option to group containers by project ([#625](https://github.com/ofkm/arcane/pull/625) by @cabaucom376)

### Bug fixes

* remove trailing slashing for all resource links([1d2e41c](https://github.com/ofkm/arcane/commit/1d2e41c0030b29bedb2ecb93cdc5740c88c32b52) by @kmendell)
* only show docker / general settings on environment page([57cff79](https://github.com/ofkm/arcane/commit/57cff793ba3cd32b6c4d3e3bdcb0c4a5d4d470ec) by @kmendell)
* add missing context([ba4d20b](https://github.com/ofkm/arcane/commit/ba4d20b78a252a17ebfc479841e5566411e60671) by @kmendell)

### Other

* fix locators for container tests([10edce8](https://github.com/ofkm/arcane/commit/10edce81d7c40111cb1701d3ab658fbf8a6f912b) by @kmendell)
* bump the prod-dependencies group with 4 updates ([#614](https://github.com/ofkm/arcane/pull/614) by @dependabot[bot])
* update readme screenshot([a18e3c0](https://github.com/ofkm/arcane/commit/a18e3c0090a27de6c608aeeb9d6ec11a53313f66) by @kmendell)
* bump the backend-dependencies group in /backend with 2 updates ([#623](https://github.com/ofkm/arcane/pull/623) by @dependabot[bot])
* bump the prod-dependencies group with 4 updates ([#622](https://github.com/ofkm/arcane/pull/622) by @dependabot[bot])
* bump the dev-dependencies group across 1 directory with 2 updates ([#621](https://github.com/ofkm/arcane/pull/621) by @dependabot[bot])



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.3.0...v1.4.0


## v1.3.0 - 2025-10-01

[Release](https://github.com/ofkm/arcane/releases/tag/v1.3.0)


### New features

* mobile navigation ([#537](https://github.com/ofkm/arcane/pull/537) by @cabaucom376)
* redesigned dashboard stats and docker info cards ([#607](https://github.com/ofkm/arcane/pull/607) by @kmendell)

### Bug fixes

* correct display of user label in event details ([#563](https://github.com/ofkm/arcane/pull/563) by @neilsb)
* use display: fullscreen for app.webmanifest([d711d44](https://github.com/ofkm/arcane/commit/d711d44831e740be72f5e87c43e64805fe3ce12a) by @kmendell)
* refresh container list when environment changes ([#573](https://github.com/ofkm/arcane/pull/573) by @neilsb)
* environment handler not registering correctly([05a1806](https://github.com/ofkm/arcane/commit/05a180686c7cd2aaab4b1f2cb4912d73ff70f67a) by @kmendell)
* remove unused argument for environment handler([b3effbb](https://github.com/ofkm/arcane/commit/b3effbbad1bc65e75088b70998fcc66c4711eb08) by @kmendell)
* add work directory and config files labels to projects([1c25aa8](https://github.com/ofkm/arcane/commit/1c25aa840f59c6f9392b7e28dec9373c8e84534c) by @kmendell)
* properly align login screen elements when only oidc is enabled([4aeb845](https://github.com/ofkm/arcane/commit/4aeb845d5289cc0580a918fa045b08553324562f) by @kmendell)
* sort and filter properly using docker api ([#593](https://github.com/ofkm/arcane/pull/593) by @kmendell)
* project title not saving([fe4e8b4](https://github.com/ofkm/arcane/commit/fe4e8b43a4160a56470c1082eef2e3822fdb0bce) by @kmendell)
* use live project status vs stored value([1426374](https://github.com/ofkm/arcane/commit/14263744ebbc899b649fc205316dfe00599c4f84) by @kmendell)
* image update item not retrieving the correct update data([d6c449c](https://github.com/ofkm/arcane/commit/d6c449cabae66a87a94e31d7ebf604283e5a9568) by @kmendell)
* skip onboarding when UI configuration is disabled ([#602](https://github.com/ofkm/arcane/pull/602) by @kmendell)
* pass registry credentials to environments ([#603](https://github.com/ofkm/arcane/pull/603) by @kmendell)
* remove trailing slash on projectId route([f824aa4](https://github.com/ofkm/arcane/commit/f824aa4d4dc87145a0ad771c2ce9567f25a7f807) by @kmendell)
* use correct destructive variant for registry delete item([cd4a49b](https://github.com/ofkm/arcane/commit/cd4a49ba5b352e36f3b672161a9024d7b871c3a7) by @kmendell)
* use correct status badge for container registry table([9fdbe02](https://github.com/ofkm/arcane/commit/9fdbe025de0bf4bb68129b6f1c09a65a17bd2c0f) by @kmendell)
* restrict docker dialog to screen bounds([2f74a3e](https://github.com/ofkm/arcane/commit/2f74a3e74df15d4992a00bb568437b1e09c79761) by @kmendell)

### Other

* bump @playwright/test from 1.55.0 to 1.55.1 in the dev-dependencies group ([#560](https://github.com/ofkm/arcane/pull/560) by @dependabot[bot])
* bump the prod-dependencies group across 1 directory with 5 updates ([#565](https://github.com/ofkm/arcane/pull/565) by @dependabot[bot])
* bump github.com/go-co-op/gocron/v2 from 2.16.5 to 2.16.6 in /backend in the backend-dependencies group ([#570](https://github.com/ofkm/arcane/pull/570) by @dependabot[bot])
* generalize environment routes into individual handlers ([#568](https://github.com/ofkm/arcane/pull/568) by @kmendell)
* non env endpoints registered before env middleware ([#580](https://github.com/ofkm/arcane/pull/580) by @kmendell)
* bump the prod-dependencies group across 1 directory with 5 updates ([#577](https://github.com/ofkm/arcane/pull/577) by @dependabot[bot])
* use coreos/go-oidc library for oidc auth([80317bb](https://github.com/ofkm/arcane/commit/80317bbf9301cd70d9a2e5900643650a359c5eb8) by @kmendell)
* add APP_URL to .env.dev([17738b1](https://github.com/ofkm/arcane/commit/17738b181af781c9045ba6ab7147d485adaf2fb8) by @kmendell)
* improve ui consistency and maintainability ([#582](https://github.com/ofkm/arcane/pull/582) by @cabaucom376)
* bump @codemirror/view from 6.38.3 to 6.38.4 in the prod-dependencies group ([#594](https://github.com/ofkm/arcane/pull/594) by @dependabot[bot])
* update package manager to 10.17.1([6b287e8](https://github.com/ofkm/arcane/commit/6b287e8accbac215897514b87766c2fcf8f52c69) by @kmendell)
* add CODEOWNERS([c621fab](https://github.com/ofkm/arcane/commit/c621fab260156eb757bb0f81c5ac9b422034ca00) by @kmendell)
* tweak the styling of resource detail pages ([#595](https://github.com/ofkm/arcane/pull/595) by @cabaucom376)
* enhance the development pipeline by incorporating caching and troubleshooting tools ([#596](https://github.com/ofkm/arcane/pull/596) by @cabaucom376)
* bump typescript-eslint from 8.44.1 to 8.45.0 in the prod-dependencies group ([#599](https://github.com/ofkm/arcane/pull/599) by @dependabot[bot])
* bump @types/node from 24.5.2 to 24.6.0 in the dev-dependencies group ([#598](https://github.com/ofkm/arcane/pull/598) by @dependabot[bot])
* bump the dev-dependencies group with 2 updates ([#606](https://github.com/ofkm/arcane/pull/606) by @dependabot[bot])
* bump the prod-dependencies group with 3 updates ([#605](https://github.com/ofkm/arcane/pull/605) by @dependabot[bot])



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.2.2...v1.3.0


## v1.2.2 - 2025-09-24

[Release](https://github.com/ofkm/arcane/releases/tag/v1.2.2)


### Bug fixes

* container registry test connection not checking the correct endpoint([9d2c251](https://github.com/ofkm/arcane/commit/9d2c2513a2f6b610d895002af00ade1a0f1c0cc5) by @kmendell)
* project save button not the correct size([7872080](https://github.com/ofkm/arcane/commit/787208046bebf153ad2fbc807f921a119e60723f) by @kmendell)
* use correct headers and cors values for websockets ([#553](https://github.com/ofkm/arcane/pull/553) by @kmendell)
* remove project updater logic, prune images after updating ([#556](https://github.com/ofkm/arcane/pull/556) by @kmendell)
* don't override env vars with default settings ([#558](https://github.com/ofkm/arcane/pull/558) by @kmendell)
* use correct json body for system prune([13e35fd](https://github.com/ofkm/arcane/commit/13e35fdcb7541bdfcecc8f85a01802d50cf723f9) by @kmendell)

### Performance Improvements

* optimize dockerfile([f2e8bd3](https://github.com/ofkm/arcane/commit/f2e8bd375f2b8f4c852b13d235d72f15f9bdf411) by @kmendell)

### Other

* add pull request title validation([e129344](https://github.com/ofkm/arcane/commit/e1293448843f429cd6510594575ec564a581a68c) by @kmendell)
* add recommended extensions([539e00b](https://github.com/ofkm/arcane/commit/539e00ba00b668b5ff573a9b36d354782b03f7a0) by @kmendell)
* .github/workflows: Migrate workflows to Blacksmith runners ([#555](https://github.com/ofkm/arcane/pull/555) by @blacksmith-sh[bot])
* extract digest retrieval logic into a separate function([5b012ff](https://github.com/ofkm/arcane/commit/5b012ffa51a237eeb3efdad1c09ce1180abade07) by @kmendell)
* remove blacksmith runners([0b4fee5](https://github.com/ofkm/arcane/commit/0b4fee5309cf9b5e5153337e59495b70562869cb) by @kmendell)
* fix go linter([274cb4a](https://github.com/ofkm/arcane/commit/274cb4af8ca9ee24624ab642fc601a278880fcb7) by @kmendell)
* ignore linter on init function([b3d5974](https://github.com/ofkm/arcane/commit/b3d5974fd9d4d54476265ee4bab6e8e1e9b9385f) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.2.1...v1.2.2


## v1.2.1 - 2025-09-23

[Release](https://github.com/ofkm/arcane/releases/tag/v1.2.1)


### Bug fixes

* use correct settings return type([02db09a](https://github.com/ofkm/arcane/commit/02db09a0402c62087cf3a6aa89b80fe684b3f9d9) by @kmendell)
* use correct running container count in dashboard metric([98a9cfa](https://github.com/ofkm/arcane/commit/98a9cfafb5505553252fc88b4f45dbf3d7ae3eb4) by @kmendell)
* show correct stats for remote environments on dashboard ([#549](https://github.com/ofkm/arcane/pull/549) by @kmendell)

### Dependencies

* bump the backend-dependencies group in /backend with 3 updates ([#540](https://github.com/ofkm/arcane/pull/540) by @dependabot[bot])
* bump the prod-dependencies group with 6 updates ([#548](https://github.com/ofkm/arcane/pull/548) by @dependabot[bot])

### Other

* fix changelog with correct information([f20de40](https://github.com/ofkm/arcane/commit/f20de405d07377a5d0974a37f6938047c5bfa108) by @kmendell)
* bump the prod-dependencies group with 6 updates ([#538](https://github.com/ofkm/arcane/pull/538) by @dependabot[bot])
* bump the dev-dependencies group across 1 directory with 3 updates ([#545](https://github.com/ofkm/arcane/pull/545) by @dependabot[bot])
* add concurrency settings to E2E tests workflow([fe7ee76](https://github.com/ofkm/arcane/commit/fe7ee76dec653fc7f00874b26d613e903e138234) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.2.0...v1.2.1


## v1.2.0 - 2025-09-21

[Release](https://github.com/ofkm/arcane/releases/tag/v1.2.0)

### New features

* analytics plugin for number of instances ([#483](https://github.com/ofkm/arcane/pull/483) by @kmendell)
* use websockets for streaming logs ([#495](https://github.com/ofkm/arcane/pull/495) by @kmendell)
* use websockets for dashboard stats ([#496](https://github.com/ofkm/arcane/pull/496) by @kmendell)
* add pull progress popover when deploying project ([#512](https://github.com/ofkm/arcane/pull/512) by @kmendell)
* add build cache checkbox to prune dialog([5db08fc](https://github.com/ofkm/arcane/commit/5db08fc2ea41630cac69ba15c42bfcda885d4f83) by @kmendell)
* screen responsive navigation ([#516](https://github.com/ofkm/arcane/pull/516) by @cabaucom376)
* redesigned projects page ([#464](https://github.com/ofkm/arcane/pull/464) by @kmendell)
* settings page ui refresh ([#518](https://github.com/ofkm/arcane/pull/518) by @cabaucom376)
* ui configuration from env variables ([#526](https://github.com/ofkm/arcane/pull/526) by @kmendell)
* support PWA icons ([#529](https://github.com/ofkm/arcane/pull/529) by @cabaucom376)

### Bug fixes

* update default admin user printed in logs, also print the default admin password on first run([5d3a66c](https://github.com/ofkm/arcane/commit/5d3a66cdce07cb8cd509be729a880a8e81877ac9) by @kmendell)
* update network usage detection to account for networks in use([4170985](https://github.com/ofkm/arcane/commit/417098513f0621bcc2e4cd7c7040994a4187a702) by @kmendell)
* use distribution reference for image digests ([#484](https://github.com/ofkm/arcane/pull/484) by @kmendell)
* load working directory before dotenv for projects([232d62e](https://github.com/ofkm/arcane/commit/232d62ec19c191873861e31bfb27be08401fa512) by @kmendell)
* correctly validate and parse compose projects on load ([#492](https://github.com/ofkm/arcane/pull/492) by @kmendell)
* reload interface when switching environments([53c0aa4](https://github.com/ofkm/arcane/commit/53c0aa43dc7d43582a4b64ef3a4618613178d004) by @kmendell)
* dashboard not showing remote environment information([3a7b858](https://github.com/ofkm/arcane/commit/3a7b858a89dee7948326542796afdcbfa993bf9b) by @kmendell)
* image polling value allows any number ([#501](https://github.com/ofkm/arcane/pull/501) by @kmendell)
* password change not being accepted by the backend([e82b114](https://github.com/ofkm/arcane/commit/e82b11489acd8d790ed8573ba32079561d8ccf97) by @kmendell)
* use better wording on project action buttons and redploy dialog([bb25ac2](https://github.com/ofkm/arcane/commit/bb25ac240327054a444d220b721f33af98ff3179) by @kmendell)
* only watch env or compose files in filesystem watcher job([c957681](https://github.com/ofkm/arcane/commit/c957681dc46e43e7f963d22a4721499056def220) by @kmendell)
* templates wouldnt allow empty files to be loaded in the ui([33b8303](https://github.com/ofkm/arcane/commit/33b8303b09b126de76bb008eae5be2ec6e6336f2) by @kmendell)
* use projectId for saving instead of projectName([1cb7ab2](https://github.com/ofkm/arcane/commit/1cb7ab2f93a86f281903e3b72726e6c5e9be4794) by @kmendell)
* ignore root files in template directory([637460a](https://github.com/ofkm/arcane/commit/637460ab4628719a298d7790e57193da084107dd) by @kmendell)
* minor styling issue ([#528](https://github.com/ofkm/arcane/pull/528) by @cabaucom376)
* dont skip .env resolution([d8af378](https://github.com/ofkm/arcane/commit/d8af378f04dd1081f51d9aa3f06f81cdeae2b65d) by @kmendell)

### Performance Improvements

* improve websocket logs performance ([#534](https://github.com/ofkm/arcane/pull/534) by @kmendell)

### Dependencies

* bump the prod-dependencies group with 4 updates ([#480](https://github.com/ofkm/arcane/pull/480) by @dependabot[bot])
* bump the backend-dependencies group across 1 directory with 2 updates([ec7e6cb](https://github.com/ofkm/arcane/commit/ec7e6cb725e7cab70a6c9cd0da5664c4dba5d3a1) by @dependabot[bot])
* bump the backend-dependencies group across 1 directory with 2 updates ([#485](https://github.com/ofkm/arcane/pull/485) by @dependabot[bot])
* bump the prod-dependencies group with 7 updates ([#522](https://github.com/ofkm/arcane/pull/522) by @dependabot[bot])

### Other

* add service unit tests([99e8a68](https://github.com/ofkm/arcane/commit/99e8a68d87dcc815d3b4b66e5998a77cfa7451ab) by @kmendell)
* fix lints in tests([d3d50fb](https://github.com/ofkm/arcane/commit/d3d50fbf943b9bdb1b8804ae8e3f8fbfbf30731f) by @kmendell)
* move the app version check to the backend ([#473](https://github.com/ofkm/arcane/pull/473) by @kmendell)
* inject default http client into services([441f8a4](https://github.com/ofkm/arcane/commit/441f8a429798c250c9cf52442ed7a883740d2582) by @kmendell)
* make helper in loading projects([694607c](https://github.com/ofkm/arcane/commit/694607c4a4e7b5a2de916e28ece7372435b00431) by @kmendell)
* bump @types/node in the dev-dependencies group([e9f2f74](https://github.com/ofkm/arcane/commit/e9f2f7444bd5efe18da4251cc544b6c798e4f148) by @dependabot[bot])
* bump @types/node from 24.3.1 to 24.4.0 in the dev-dependencies group ([#481](https://github.com/ofkm/arcane/pull/481) by @dependabot[bot])
* use correct analytics host([c44aaec](https://github.com/ofkm/arcane/commit/c44aaec2b92bf191a5e684624f38bbff9c25a5fd) by @kmendell)
* bump @types/node from 24.4.0 to 24.5.0 in the dev-dependencies group ([#494](https://github.com/ofkm/arcane/pull/494) by @dependabot[bot])
* bump the prod-dependencies group across 1 directory with 3 updates ([#499](https://github.com/ofkm/arcane/pull/499) by @dependabot[bot])
* add download docker script([d61d12a](https://github.com/ofkm/arcane/commit/d61d12a95e04d9428d7f98f9681a2e2af4c0c7c4) by @kmendell)
* use compose-go for project related functions ([#508](https://github.com/ofkm/arcane/pull/508) by @kmendell)
* add ARG TARGETARCH back to static docker files([86e799f](https://github.com/ofkm/arcane/commit/86e799f288c784c2b9534a8a9b7711a868e0aeee) by @kmendell)
* bump the prod-dependencies group with 3 updates ([#504](https://github.com/ofkm/arcane/pull/504) by @dependabot[bot])
* container-based development workflow with hot reload and VS Code integration ([#509](https://github.com/ofkm/arcane/pull/509) by @cabaucom376)
* cleanup go module([932824c](https://github.com/ofkm/arcane/commit/932824c1ba805a663512b8c19fa87330253dcd93) by @kmendell)
* Auto close VSCode terminals when tasks are finished ([#511](https://github.com/ofkm/arcane/pull/511) by @cabaucom376)
* include version in changelog([80fd46e](https://github.com/ofkm/arcane/commit/80fd46eea69ee92c082288361215b18a9e942900) by @kmendell)
* use local build for arcane-agent([f9a962e](https://github.com/ofkm/arcane/commit/f9a962e63ed4e7e7b10e1951726c6605fc4fe83f) by @kmendell)
* split logic for stats ws([d43a256](https://github.com/ofkm/arcane/commit/d43a25650692290b7b9ca03e30c6fb802ad4c2ac) by @kmendell)
* bump svelte from 5.38.10 to 5.39.1 in the prod-dependencies group ([#513](https://github.com/ofkm/arcane/pull/513) by @dependabot[bot])
* bump the dev-dependencies group with 2 updates ([#505](https://github.com/ofkm/arcane/pull/505) by @dependabot[bot])
* add merge conflict labeler action([04a6c2b](https://github.com/ofkm/arcane/commit/04a6c2b313a1815ff41dbf536ab9db0101602886) by @kmendell)
* simplify filesystem watcher([ae159f9](https://github.com/ofkm/arcane/commit/ae159f9d38faf191f9f64cc6db31455162fb4947) by @kmendell)
* cleanup sidebar translation keys([b5615c4](https://github.com/ofkm/arcane/commit/b5615c449a996516f6bc0037b5670310c5bed193) by @kmendell)
* fix updated sidebar text([2440475](https://github.com/ofkm/arcane/commit/24404754d98820c1fddf6c890289a3089b471337) by @kmendell)
* update projects header to new key([4912746](https://github.com/ofkm/arcane/commit/49127464754cd920e3215790ca375b543dfbbe5a) by @kmendell)
* bump vite from 7.1.5 to 7.1.6 in the dev-dependencies group ([#521](https://github.com/ofkm/arcane/pull/521) by @dependabot[bot])
* cleanup template service ([#523](https://github.com/ofkm/arcane/pull/523) by @kmendell)
* remove dead and unused code ([#525](https://github.com/ofkm/arcane/pull/525) by @kmendell)
* use git cliff for releases (thanks pocket-id :))([d742817](https://github.com/ofkm/arcane/commit/d742817ccd9c01abeaed366bb87c1576f67e4f0f) by @kmendell)
* refine settings pages ([#532](https://github.com/ofkm/arcane/pull/532) by @cabaucom376)
* update cliff.toml to include deps([9101ca3](https://github.com/ofkm/arcane/commit/9101ca3113edb284b0c188128e611a86f00c06df) by @kmendell)



**Full Changelog**: https://github.com/ofkm/arcane/compare/v1.1.0...v1.2.0

## v1.1.0 - 2025-09-14

[Release](https://github.com/ofkm/arcane/releases/tag/v1.1.0)

### Features

* add usage badge to network table ([6019045](https://github.com/ofkm/arcane/commit/60190456dd4687ac360610dd3c9a941c7d36d2a3))
* allow underscores in project names ([2b464db](https://github.com/ofkm/arcane/commit/2b464db4a851eaba3e88295237f0be0b7f350815))
* container port links and overview ([#457](https://github.com/ofkm/arcane/issues/457)) ([154107d](https://github.com/ofkm/arcane/commit/154107da7e0d9f480d9744332abf3c8ab3c2e502))
* move quick actions to the header for more simplified look ([f0b43b6](https://github.com/ofkm/arcane/commit/f0b43b67f645c1ef842e5ce215dd8e8c349fe573))
* persistent table filters, page size, and column headers ([#449](https://github.com/ofkm/arcane/issues/449)) ([a7a899a](https://github.com/ofkm/arcane/commit/a7a899a7fb4ec9c29d21aecb23239e7d755ee449))

### Bug Fixes

* add /api/health endpoint to agent mode ([83f0bc0](https://github.com/ofkm/arcane/commit/83f0bc0b3305ecbc420b05968bfe79f3dd47c344))
* allow use of the local templates directory ([#462](https://github.com/ofkm/arcane/issues/462)) ([cae0df4](https://github.com/ofkm/arcane/commit/cae0df4fd3a2afddd016062d6574500094ffd730))
* check for updates only checking the current page of images ([0da46a0](https://github.com/ofkm/arcane/commit/0da46a046aabfcc2721996583a8ad73ccf07277c))
* do not recursive chown the /app/data/projects directory in entrypoint ([368612a](https://github.com/ofkm/arcane/commit/368612a8f072e59d63745a700f6de9f8c588b033))
* do not stop arcanes container it self when using the quick action ([0166084](https://github.com/ofkm/arcane/commit/016608442b052df71ede8c94dff1346c4e4f6551))
* dont allow the auto updater to update arcane it self ([4b0931e](https://github.com/ofkm/arcane/commit/4b0931e52935580d3040aced090ce8c39850d51b))
* make auto-update off by default on fresh installs ([129c5c5](https://github.com/ofkm/arcane/commit/129c5c5e1f8e69efbc8b9af496baa56046e3b6e4))
* project save button not using the correct styles ([9825c4a](https://github.com/ofkm/arcane/commit/9825c4aa15a59c626580e5aa6f6d39cc23843613))
* projects are not searchable ([31ce3e9](https://github.com/ofkm/arcane/commit/31ce3e9866981f16cb2e838c7e419ef332c67249))
* reschedule jobs when polling or autoupdate job settings is changed ([5c3f168](https://github.com/ofkm/arcane/commit/5c3f1687dd6ab5dfb06526fb2af9b40693e60b2c))
* update banner link not clickable ([69e95e0](https://github.com/ofkm/arcane/commit/69e95e0457f5a317f1b7928039bd3719dd70471d))
* use correct running container count on dashboard ([3dad327](https://github.com/ofkm/arcane/commit/3dad32721a0e53e6f44e2f73959e1d315835d36a))
* use correct time for auto update job ([e7a5a31](https://github.com/ofkm/arcane/commit/e7a5a3173f8f24ceccf34497915e1b845d377b43))



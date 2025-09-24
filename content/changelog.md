---
title: 'Changelog'
description: 'Release notes for Arcane'
---

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


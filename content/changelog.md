---
title: 'Changelog'
description: 'Release notes for Arcane'
---
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
* make auto-update off by defualt on fresh installs ([129c5c5](https://github.com/ofkm/arcane/commit/129c5c5e1f8e69efbc8b9af496baa56046e3b6e4))
* project save button not using the correct styles ([9825c4a](https://github.com/ofkm/arcane/commit/9825c4aa15a59c626580e5aa6f6d39cc23843613))
* projects are not searchable ([31ce3e9](https://github.com/ofkm/arcane/commit/31ce3e9866981f16cb2e838c7e419ef332c67249))
* reschedule jobs when polling or autoupdate job settings is changed ([5c3f168](https://github.com/ofkm/arcane/commit/5c3f1687dd6ab5dfb06526fb2af9b40693e60b2c))
* update banner link not clickable ([69e95e0](https://github.com/ofkm/arcane/commit/69e95e0457f5a317f1b7928039bd3719dd70471d))
* use correct running container count on dashboard ([3dad327](https://github.com/ofkm/arcane/commit/3dad32721a0e53e6f44e2f73959e1d315835d36a))
* use correct time for auto update job ([e7a5a31](https://github.com/ofkm/arcane/commit/e7a5a3173f8f24ceccf34497915e1b845d377b43))


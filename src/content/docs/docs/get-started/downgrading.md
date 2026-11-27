---
title: "Downgrading"
description: "Roll back to an older Arcane version without losing data."
---

Arcane migrates its database automatically when you upgrade, so an older version won't start unless you explicitly allow a downgrade.

## Downgrade Arcane

1. Back up the Arcane database.
2. Set `ARCANE_ALLOW_DOWNGRADE=true` in the Arcane container's environment.
3. Start the older version, and Arcane will roll the database back.
4. Once Arcane starts cleanly, remove `ARCANE_ALLOW_DOWNGRADE` or set it to `false`.

## Recover if the downgrade is refused

An older release can only roll back migrations it knows about. If the log says rollback migrations are unavailable:

1. Restore your pre-upgrade backup.
2. Start the older version.

## Downgrade from 3.0 to 2.x

Arcane 3.0 can't roll back past its v2.17.1 database baseline, so you'll need to restore a backup:

1. Restore the backup you took before upgrading to 3.0.
2. Start 2.17.1.

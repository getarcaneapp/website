---
title: 'Downgrading'
description: 'Roll back to an older Arcane version without losing data.'
---

Roll back Arcane to an older version safely. Because Arcane migrates its database on upgrade, older versions stop at startup unless you explicitly allow a downgrade.

## Downgrade Arcane

1. Back up the Arcane database.
2. Set `ARCANE_ALLOW_DOWNGRADE=true` in the Arcane container's environment.
3. Start the older version so Arcane rolls the database back.
4. Remove `ARCANE_ALLOW_DOWNGRADE` (or set it to `false`) after Arcane starts cleanly.

## Recover if the downgrade is refused

An older release can only roll back database migrations it knows about. If the log reports that rollback SQL is unavailable, restore your pre-upgrade database backup and start the older version.

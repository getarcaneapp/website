---
title: 'Try the 1.0 Preview'
description: 'How to try the Arcane 1.0 Preview release and provide feedback.'
---

<script lang="ts">
import { Link } from '$lib/components/ui/link/index.js';
</script>

### Before you start

- Use a fresh database as one from pre 1.0 wont be able to apply the migrations and yes sadly that means you have to setup, settings, users and templates again.... Im sorry :(
- See the new <Link href="/docs/configuration">Configuration</Link> to make sure the correct variables are set in the environment.

#### Overview of the major breaking changes:

- The port Arcane runs on has changed from `3000` to `3552` by default.
- The OIDC Configuration now uses the `.well-known/openid-configuration` endpoint to auto discover the correct endpoints, see <Link href="/docs/users/sso">here</Link> for the new configuration.
- Agents have been replaced with remote environments, this will use a simplified version of arcane it self, vs a separate agent (this is still a work in progress)
- Image Maturity has been removed, and replaced with a much more simple update available indicator on the images page.
- Compose projects (Stacks) now no longer need to be imported, Arcane will just read from the mounted stacks directory, and run the commands directly from that folder. The database is still used for some metadata, but the source of truth is the stacks folder.


### Get started with the preview now!
Below is a just an **example** of a compose file with all the new variables.

Update your `compose.yaml` file with the updated tag and configuration or <br />
use the new  <Link href="/generator">Compose Generator</Link> to generate a 1.0 config

```yaml
  services:
    arcane:
      image: ghcr.io/ofkm/arcane:1.0-public-beta
      container_name: arcane
      volumes:
        - /var/run/docker.sock:/var/run/docker.sock
        - arcane-data:/app/data
      environment:
        - PUID=1000
        - PGID=1000
        - ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxx
        - JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxx
      ports:
        - "3552:3552"
```

Open [http://localhost:3552](http://localhost:3552) in your browser to start working with Arcane 1.0!

> **Important**: In order to make Arcane the best project we can, provide feedback on Github using the Issue Template at the link below. This way we can make sure all major issues are worked out before the official 1.0 release. <br/> <Link href="https://github.com/ofkm/arcane/issues/new?template=1.0-feedback.yml">Give Feedback Here</Link>

import type { BuildableConfig } from "$lib/types/buildable.type.js";

export const buildables: BuildableConfig[] = [
  {
    name: "Autologin",
    feature: "autologin",
    description: "Automatically sign in using build-time enabled credentials.",
    docsHref: "/docs/guides/buildables/autologin",
    source: "Official",
    envVars: ["AUTO_LOGIN_USERNAME", "AUTO_LOGIN_PASSWORD"],
  },
];

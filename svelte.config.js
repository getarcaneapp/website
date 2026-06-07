import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import { mdsvexConfig } from "./mdsvex.config.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: [mdsvex(mdsvexConfig), vitePreprocess()],
  extensions: [".svelte", ".md"],

  kit: {
    adapter: adapter({
      fallback: "index.html",
      pages: "./build",
    }),
    alias: {
      "$velite/*": ".velite/*",
    },
  },
};

export default config;

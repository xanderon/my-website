import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkBlog from "./src/lib/markdown/remark-blog";

// https://astro.build/config
export default defineConfig({
  site: "https://alexnutu.vercel.app",
  output: "server",
  markdown: {
    remarkPlugins: [remarkMath, remarkBlog],
    rehypePlugins: [rehypeKatex],
  },
  adapter: vercel({
    analytics: true,
  }),
});

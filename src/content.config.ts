import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const imageSchema = z.union([
  z.string(),
  z.object({
    path: z.string(),
    alt: z.string().optional(),
    lqip: z.string().optional(),
  }),
]);

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,markdown}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    description: z.string().optional(),
    date: z.date(),
    updatedDate: z.date().optional(),
    categories: z.array(z.string()).max(2).default([]),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    image: imageSchema.optional(),
    mediaSubpath: z.string().optional(),
    author: z.string().optional(),
    authors: z.array(z.string()).optional(),
    toc: z.boolean().optional(),
    math: z.boolean().optional(),
    mermaid: z.boolean().optional(),
    pin: z.boolean().optional(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  blog,
};

import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    tags: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = {
  blog,
};

import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog"> & {
  permalink: string;
  readingTime: string;
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "long" });

export async function getAllPosts() {
  const entries = await getCollection("blog", ({ data }) => !data.draft);

  return entries
    .sort((a, b) => {
      return b.data.date.getTime() - a.data.date.getTime();
    })
    .map((entry) => ({
      ...entry,
      permalink: `/blog/${entry.slug}`,
      readingTime: getReadingTime(entry.body),
    }));
}

export async function getPostBySlug(slug: string) {
  const posts = await getAllPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostsByTag(tag: string) {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    post.data.tags.some((value) => slugifyTag(value) === tag),
  );
}

export async function getAllTags() {
  const posts = await getAllPosts();
  const tags = new Map<string, { label: string; slug: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = slugifyTag(tag);
      const existing = tags.get(slug);

      if (existing) {
        existing.count += 1;
      } else {
        tags.set(slug, { label: tag, slug, count: 1 });
      }
    }
  }

  return [...tags.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function formatDate(value: Date) {
  return dateFormatter.format(value);
}

export function slugifyTag(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAdjacentPosts(posts: BlogPost[], slug: string) {
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    next: index > 0 ? posts[index - 1] : undefined,
    previous: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function getRelatedPosts(posts: BlogPost[], currentPost: BlogPost) {
  const currentTags = new Set(currentPost.data.tags);

  return posts
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => ({
      post,
      score: post.data.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.post);
}

export function getHeadingsFromMarkdown(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{2,4})\s+(.+)$/))
    .filter(Boolean)
    .map((match) => ({
      depth: match[1].length,
      text: match[2].trim(),
      slug: slugifyTag(match[2]),
    }));
}

function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 190));
  return `${minutes} min read`;
}

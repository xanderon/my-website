import { getCollection, type CollectionEntry } from "astro:content";
import { blogAuthors, defaultBlogAuthor, type BlogAuthor } from "../data/authors";

export type BlogPost = CollectionEntry<"blog"> & {
  slug: string;
  permalink: string;
  readingTime: string;
  description: string;
  cover: { path?: string; alt?: string; lqip?: string };
  authorsResolved: BlogAuthor[];
};

const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "long" });

export async function getAllPosts() {
  const entries = await getCollection("blog", ({ data }) => !data.draft);

  return entries
    .sort((a, b) => {
      if (a.data.pin && !b.data.pin) return -1;
      if (!a.data.pin && b.data.pin) return 1;
      return b.data.date.getTime() - a.data.date.getTime();
    })
    .map((entry) => ({
      ...entry,
      slug: entry.id.replace(/\.(md|markdown)$/i, ""),
      permalink: `/blog/${entry.id.replace(/\.(md|markdown)$/i, "")}`,
      readingTime: getReadingTime(entry.body),
      description: getPostDescription(entry),
      cover: getPostCover(entry),
      authorsResolved: getPostAuthors(entry),
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

export async function getPostsByCategory(category: string) {
  const posts = await getAllPosts();
  return posts.filter((post) =>
    (post.data.categories ?? []).some((value) => slugifyTag(value) === category),
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

export function getAllCategories(posts: BlogPost[]) {
  const categories = new Map<string, { label: string; slug: string; count: number }>();

  for (const post of posts) {
    for (const category of post.data.categories ?? []) {
      const slug = slugifyTag(category);
      const existing = categories.get(slug);
      if (existing) existing.count += 1;
      else categories.set(slug, { label: category, slug, count: 1 });
    }
  }

  return [...categories.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function getArchiveGroups(posts: BlogPost[]) {
  const groups = new Map<string, { year: number; month: string; posts: BlogPost[] }>();

  for (const post of posts) {
    const date = post.data.date;
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    const month = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
    const existing = groups.get(key);
    if (existing) {
      existing.posts.push(post);
    } else {
      groups.set(key, {
        year: date.getUTCFullYear(),
        month,
        posts: [post],
      });
    }
  }

  return [...groups.values()].sort((a, b) => {
    const aDate = a.posts[0]?.data.date.getTime() ?? 0;
    const bDate = b.posts[0]?.data.date.getTime() ?? 0;
    return bDate - aDate;
  });
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

export function getPinnedPosts(posts: BlogPost[]) {
  return posts.filter((post) => post.data.pin || post.data.featured);
}

export function getPostDescription(post: CollectionEntry<"blog"> | BlogPost) {
  return post.data.description ?? post.data.excerpt ?? post.data.title;
}

export function getPostCover(post: CollectionEntry<"blog"> | BlogPost) {
  const image = post.data.image;
  const mediaSubpath = post.data.mediaSubpath;
  const normalize = (path?: string) => {
    if (!path) return undefined;
    if (path.startsWith("/") || /^(?:[a-z]+:)?\/\//i.test(path)) return path;
    if (!mediaSubpath) return path;
    return `${mediaSubpath.replace(/\/+$/, "")}/${path.replace(/^\.?\//, "")}`;
  };

  if (typeof image === "string") {
    return { path: normalize(image), alt: post.data.coverAlt };
  }

  if (image?.path) {
    return {
      path: normalize(image.path),
      alt: image.alt ?? post.data.coverAlt ?? post.data.title,
      lqip: image.lqip,
    };
  }

  return {
    path: normalize(post.data.coverImage),
    alt: post.data.coverAlt ?? post.data.title,
  };
}

export function getPostAuthors(post: CollectionEntry<"blog"> | BlogPost) {
  const ids = post.data.authors?.length ? post.data.authors : post.data.author ? [post.data.author] : [defaultBlogAuthor.id];
  return ids.map((id) => blogAuthors[id] ?? { ...defaultBlogAuthor, id });
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
  const plainText = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 225));
  return `${minutes} min read`;
}

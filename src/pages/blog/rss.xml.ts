import rss from "@astrojs/rss";
import { getAllPosts } from "../../lib/blog";
import { blogConfig } from "../../data/blog-config";

export async function GET(context: any) {
  const posts = await getAllPosts();

  return rss({
    title: `Alex Nutu | ${blogConfig.title}`,
    description: blogConfig.description,
    site: context.site ?? "https://alexnutu.vercel.app",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.description,
      link: post.permalink,
      pubDate: post.data.updatedDate ?? post.data.date,
    })),
    customData: `<language>en</language>`,
  });
}

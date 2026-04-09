export interface BlogAuthor {
  id: string;
  name: string;
  role?: string;
  bio?: string;
  url?: string;
  twitter?: string;
  avatar?: string;
}

export const blogAuthors: Record<string, BlogAuthor> = {
  alex: {
    id: "alex",
    name: "Alex Nutu",
    role: "Software Engineer",
    bio: "Writing about practical systems, useful software, 3D printing, and small builds worth documenting.",
    url: "/",
    twitter: "alexnutu",
    avatar: "/static/portrait-light-xxxxs.jpg",
  },
};

export const defaultBlogAuthor = blogAuthors.alex;

export type BlogPost = {
  id: number;
  title: string;
  date: string;
  lastModified?: string;
  readTime: string;
  tags: string[];
  content: string;
};

export async function loadBlogPosts(): Promise<BlogPost[]> {
  const extractId = (filename: string) => {
    const m = filename.match(/^(\d+)/);
    return m ? Number(m[1]) : 0;
  };

  try {
    // Expect public/posts/index.json to be an array of filenames, e.g.:
    // ["001 - Building Terminal Interfaces in React.json", ...]
    const baseFromEnv =
      (typeof process !== "undefined" && process.env.NEXT_PUBLIC_POSTS_BASE) ||
      "";
    const postsBase =
      baseFromEnv && baseFromEnv.trim().length > 0
        ? baseFromEnv.replace(/\/+$/, "")
        : typeof window !== "undefined"
          ? `${window.location.origin}/posts`
          : "/posts";
    const res = await fetch(`${postsBase}/index.json`);
    if (!res.ok) {
      return [];
    }
    const files: string[] = await res.json();

    const posts: BlogPost[] = [];
    for (const file of files) {
      try {
        const r = await fetch(`${postsBase}/${encodeURIComponent(file)}`);
        if (!r.ok) continue;
        const p = (await r.json()) as BlogPost;
        if (!p.id) p.id = extractId(file);
        posts.push(p);
      } catch {
        // skip malformed or unreadable entries
      }
    }

    // Sort by date desc, then by id asc
    posts.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date > b.date ? -1 : 1;
      }
      return (a.id ?? 0) - (b.id ?? 0);
    });

    return posts;
  } catch {
    return [];
  }
}

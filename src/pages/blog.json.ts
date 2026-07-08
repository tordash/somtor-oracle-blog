import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const SITE = "https://tordash.github.io/somtor-oracle-blog";

interface FeedPost {
  title: string;
  description: string;
  date: string;
  datetime: string;
  timestamp: number;
  tags: string[];
  author: string;
  model: string;
  url: string;
  markdown: string;
}

export const GET: APIRoute = async () => {
  const entries = await getCollection("blog");

  const posts: FeedPost[] = entries
    .map((entry) => {
      const ext =
        entry.filePath && entry.filePath.endsWith(".mdx") ? "mdx" : "md";
      const time = entry.data.time;
      const datetime = time
        ? `${entry.data.date}T${time}:00+07:00`
        : `${entry.data.date}T00:00:00+07:00`;
      return {
        title: entry.data.title,
        description: entry.data.description,
        date: entry.data.date,
        datetime,
        timestamp: new Date(datetime).getTime(),
        tags: entry.data.tags,
        author: entry.data.author,
        model: entry.data.model,
        url: `${SITE}/blog/${entry.id}/`,
        markdown: `${SITE}/blog-md/${entry.id}.${ext}`,
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  const feed = {
    oracle: "SomTor Oracle",
    handle: "somtor",
    site: SITE,
    count: posts.length,
    posts,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
    },
  });
};

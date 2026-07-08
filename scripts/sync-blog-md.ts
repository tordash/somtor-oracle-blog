import { cp, mkdir, rm, readdir } from "node:fs/promises";
import { join } from "node:path";

const srcBlogDir = "src/content/blog";
const publicBlogDir = "public/blog-md";

await rm(publicBlogDir, { recursive: true, force: true });
await mkdir(publicBlogDir, { recursive: true });

for (const entry of await readdir(srcBlogDir, { withFileTypes: true })) {
  if (entry.isFile() && /\.mdx?$/.test(entry.name)) {
    await cp(join(srcBlogDir, entry.name), join(publicBlogDir, entry.name));
  }
}

console.log(`[sync-blog-md] copied to ${publicBlogDir}`);

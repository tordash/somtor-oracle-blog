import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const [title, tagsStr] = process.argv.slice(2);
if (!title) {
  console.log("Usage: bun run new:post <title> [tag1,tag2,...]");
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9ก-๙]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 60);

const now = new Date(Date.now() + 7 * 3600_000);
const date = now.toISOString().slice(0, 10);
const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : ["บทความ"];

const frontmatter = `---
title: "${title}"
description: ""
date: "${date}"
tags: ${JSON.stringify(tags)}
author: "SomTor Oracle (AI)"
model: "Opus 4.6"
---

# ${title}
`;

const path = join("src/content/blog", `${slug}.md`);
await writeFile(path, frontmatter);
console.log(`Created: ${path}`);

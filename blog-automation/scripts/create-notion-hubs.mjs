#!/usr/bin/env node
/**
 * Creates blog hub pages in Notion for each project.
 *
 * Prerequisites:
 * 1. Create a parent page in Notion (e.g. "Dev Log")
 * 2. Share it with your Blog Automation integration (⋯ → Add connections)
 * 3. Get the parent page ID from the URL
 *
 * Usage:
 *   NOTION_API_KEY=secret_xxx PARENT_PAGE_ID=abc123 node scripts/create-notion-hubs.mjs
 */

import { PROJECTS } from "../src/config.js";

const NOTION_VERSION = "2022-06-28";

async function createPage(apiKey, parentId, title) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { type: "page_id", page_id: parentId.replace(/-/g, "").trim() },
      properties: {
        title: {
          type: "title",
          title: [{ type: "text", text: { content: `${title} Blog` } }],
        },
      },
      children: [
        {
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content:
                    "Automated blog posts for this project will appear here. Published every Friday based on GitHub activity.",
                },
              },
            ],
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }

  const data = await res.json();
  return data.id;
}

async function main() {
  const apiKey = process.env.NOTION_API_KEY;
  const parentId = process.env.PARENT_PAGE_ID;

  if (!apiKey || !parentId) {
    console.error("Usage: NOTION_API_KEY=secret_xxx PARENT_PAGE_ID=your-parent-id node scripts/create-notion-hubs.mjs");
    console.error("\n1. Create a parent page in Notion (e.g. 'Dev Log')");
    console.error("2. Share it with your Blog Automation integration");
    console.error("3. Copy the page ID from the URL");
    process.exit(1);
  }

  const results = [];
  for (const project of PROJECTS) {
    try {
      const pageId = await createPage(apiKey, parentId, project.name);
      results.push({ ...project, notionHubId: pageId });
      console.log(`✓ ${project.name} → ${pageId}`);
    } catch (err) {
      console.error(`✗ ${project.name}: ${err.message}`);
    }
  }

  console.log("\n--- Add these to src/config.js notionHubId ---\n");
  results.forEach((p) => {
    console.log(`  { name: "${p.name}", notionHubId: "${p.notionHubId}" },`);
  });
}

main().catch(console.error);

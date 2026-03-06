/**
 * Blog Automation Worker
 * Runs on cron (Fridays), fetches GitHub commits for each project,
 * generates blog posts via Workers AI, publishes to Notion.
 */

import { PROJECTS } from "./config.js";

const NOTION_VERSION = "2022-06-28";

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(runAutomation(env));
  },

  async fetch(request, env, ctx) {
    // Allow manual trigger via GET (e.g. for testing)
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/" && url.searchParams.get("trigger") === "run") {
      const auth = request.headers.get("Authorization");
      if (!auth || auth !== `Bearer ${env.MANUAL_TRIGGER_SECRET || "dev"}`) {
        return new Response("Unauthorized", { status: 401 });
      }
      ctx.waitUntil(runAutomation(env));
      return new Response(JSON.stringify({ ok: true, message: "Automation triggered" }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("Blog Automation Worker. Use ?trigger=run with Bearer token to run manually.", {
      status: 200,
    });
  },
};

async function runAutomation(env) {
  const results = { processed: 0, skipped: 0, errors: [] };

  for (const project of PROJECTS) {
    if (!project.notionHubId) {
      results.skipped++;
      continue;
    }

    try {
      const since = await getLastRun(env, project);
      const commits = await fetchCommits(env, project, since);

      if (!commits || commits.length === 0) {
        results.skipped++;
        continue;
      }

      const postContent = await generateBlogPost(env, project, commits);
      await publishToNotion(env, project, postContent);
      await setLastRun(env, project, new Date().toISOString());

      results.processed++;
    } catch (err) {
      results.errors.push({ project: project.name, error: err.message });
    }
  }

  console.log("Blog automation complete:", JSON.stringify(results));
}

async function getLastRun(env, project) {
  const key = `last:${project.github.owner}:${project.github.repo}`;
  const value = await env.BLOG_KV.get(key);
  if (!value) {
    // Default: last 7 days
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString();
  }
  return value;
}

async function setLastRun(env, project, iso) {
  const key = `last:${project.github.owner}:${project.github.repo}`;
  await env.BLOG_KV.put(key, iso);
}

async function fetchCommits(env, project, since) {
  const { owner, repo } = project.github;
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?since=${encodeURIComponent(since)}&per_page=30`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.map((c) => ({
    sha: c.sha?.slice(0, 7),
    message: c.commit?.message || "",
    date: c.commit?.committer?.date,
    url: c.html_url,
  }));
}

async function generateBlogPost(env, project, commits) {
  const commitSummary = commits
    .map((c) => `- [${c.sha}] ${c.message.split("\n")[0]}`)
    .join("\n");

  const systemPrompt = `You are a technical writer who creates blog posts for a developer's project updates. Write in a tone that is:
- Intellectual: thoughtful, precise, and substantive
- Playful: light humor, wit, and personality without being unprofessional
- Professional: clear, well-structured, appropriate for a portfolio audience
- Semantic: uses proper headings, logical flow, and meaningful structure

Output ONLY the blog post body in clean markdown. No meta-commentary or "Here's the post:" prefix. Use ## for section headings. Keep it concise (roughly 200-400 words).`;

  const userPrompt = `Write a short blog post about these recent updates to the project "${project.name}"${project.domain ? ` (${project.domain})` : ""}.

Recent commits:
${commitSummary}

Write 2-4 short paragraphs. Include a catchy intro, a section summarizing what shipped or improved, and a brief closing. Add a touch of personality or wit.`;

  const response = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 800,
  });

  const text = response?.response ?? response?.result?.response ?? (typeof response === "string" ? response : "");
  if (!text) {
    throw new Error("Workers AI returned no response");
  }

  return String(text).trim();
}

function markdownToNotionBlocks(markdown) {
  const lines = markdown.split("\n");
  const blocks = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      blocks.push({
        heading_2: {
          rich_text: [{ type: "text", text: { content: trimmed.slice(3) } }],
        },
      });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({
        heading_3: {
          rich_text: [{ type: "text", text: { content: trimmed.slice(4) } }],
        },
      });
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({
        bulleted_list_item: {
          rich_text: [{ type: "text", text: { content: trimmed.slice(2) } }],
        },
      });
    } else {
      blocks.push({
        paragraph: {
          rich_text: [{ type: "text", text: { content: trimmed } }],
        },
      });
    }
  }

  return blocks;
}

async function publishToNotion(env, project, markdown) {
  const blocks = markdownToNotionBlocks(markdown);

  const now = new Date();
  const title = `Week of ${now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — ${project.name} updates`;

  const pagePayload = {
    parent: { type: "page_id", page_id: project.notionHubId },
    properties: {
      title: {
        type: "title",
        title: [{ type: "text", text: { content: title } }],
      },
    },
    children: blocks.slice(0, 100), // Notion limit
  };

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify(pagePayload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API error: ${res.status} ${body}`);
  }
}

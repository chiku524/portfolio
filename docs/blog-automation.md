# Blog Automation Worker

Automatically generates and publishes blog posts to Notion based on your GitHub activity. Runs every Friday (or on a schedule you configure), fetches recent commits for each project, uses Cloudflare Workers AI to write an intellectual, playful, and professional post, and publishes to dedicated blog hub pages in Notion.

## Architecture

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Cron (Fridays)     │────▶│  Cloudflare      │────▶│  Notion         │
│  or manual trigger  │     │  Worker          │     │  Blog Hubs      │
└─────────────────────┘     │  - GitHub API    │     └─────────────────┘
                            │  - Workers AI    │
                            │  - KV (state)    │
                            └──────────────────┘
```

## Prerequisites

- Cloudflare account (Workers, Workers AI, KV)
- GitHub Personal Access Token (repo scope)
- Notion workspace + Internal Integration

---

## 1. Notion setup

### Create an Internal Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. **New integration** → name it "Blog Automation"
3. Copy the **Internal Integration Secret** (starts with `secret_`)
4. Under **Capabilities** → enable **Read content**, **Update content**, **Insert content**

### Create the Blog Hub structure

**Option A – Script (recommended):** Create all hub pages automatically:

1. Create one parent page in Notion (e.g. "Dev Log")
2. Share it with your Blog Automation integration (`⋯` → Add connections)
3. Copy the parent page ID from the URL
4. Run:
   ```bash
   cd blog-automation
   NOTION_API_KEY=secret_xxx PARENT_PAGE_ID=your-parent-id npm run create-hubs
   ```
5. Copy the printed `notionHubId` values into `src/config.js`

**Option B – Manual:** Create hubs by hand:

1. **Master hub** (optional): Create a page e.g. "Dev Log" or "Project Blogs". This will be the parent of all project hubs.
2. **Project hubs:** For each project (Blockchain Vibe, Micro Paywall, etc.), create a child page under the master hub:
   - Right‑click the master hub → **Add a page** → name it e.g. "Blockchain Vibe Blog"
3. **Share with integration:** For the master hub and each project hub:
   - Open the page → `⋯` → **Add connections** → select "Blog Automation"
4. **Get page IDs:** Open each project hub page in the browser. The URL is:
   ```
   https://www.notion.so/WorkspaceName/PAGE_ID?v=...
   ```
   The `PAGE_ID` is the 32-character hex string (with optional hyphens). Paste each ID into `src/config.js` for the corresponding project’s `notionHubId`.

### Update project config

Edit `blog-automation/src/config.js` and set `notionHubId` for each project:

```js
{
  name: "Blockchain Vibe",
  github: { owner: "chiku524", repo: "blockchain-vibe" },
  notionHubId: "your-32-char-page-id-here",
  domain: "blockchainvibe.news",
},
```

---

## 2. GitHub token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. **Generate new token (classic)** → grant `repo` scope
3. Copy the token (you won’t see it again)

## 3. Cloudflare setup

### Create KV namespace

```bash
cd blog-automation
npx wrangler kv namespace create BLOG_KV
```

Copy the **id** from the output and put it in `wrangler.toml`:

```toml
kv_namespaces = [
  { binding = "BLOG_KV", id = "your-kv-namespace-id" }
]
```

### Set secrets

```bash
npx wrangler secret put NOTION_API_KEY
# Paste your Notion Internal Integration Secret

npx wrangler secret put GITHUB_TOKEN
# Paste your GitHub Personal Access Token
```

### Optional: manual trigger secret

To trigger the automation manually via HTTP:

```bash
npx wrangler secret put MANUAL_TRIGGER_SECRET
# Enter a random secret string
```

Then:

```bash
curl -H "Authorization: Bearer YOUR_SECRET" "https://blog-automation.YOUR_SUBDOMAIN.workers.dev/?trigger=run"
```

## 4. Deploy

```bash
npx wrangler deploy
```

## 5. Cron schedule

The default cron runs **Fridays at 18:00 UTC**. To change it, edit `wrangler.toml`:

```toml
[triggers]
crons = ["0 18 * * FRI"]   # Fridays 18:00 UTC
```

Use [crontab.guru](https://crontab.guru) for expressions. Times are in **UTC**.

## Local testing

```bash
npx wrangler dev
```

Then trigger the scheduled handler from another terminal:

```bash
curl "http://localhost:8787/cdn-cgi/handler/scheduled"
```

## Project config reference

| Field         | Description                                           |
|---------------|-------------------------------------------------------|
| `name`        | Display name for the project                          |
| `github`      | `{ owner, repo }` for the GitHub repository           |
| `notionHubId` | Notion page ID of the project’s blog hub (or `null`)   |
| `domain`       | Optional domain for context in generated posts        |

## Content style

Generated posts are written to be:

- **Intellectual:** Precise, substantive, technically accurate
- **Playful:** Light humor and personality, without being unprofessional
- **Professional:** Clear structure, suitable for portfolio readers
- **Semantic:** Headings, lists, and logical flow

## Troubleshooting

- **"Notion API error 404"** → Page not found. Confirm the page ID and that the integration is connected to the page.
- **"Notion API error 403"** → Integration lacks permission. Re-share the page with the integration.
- **Empty commits** → First run uses the last 7 days. Later runs use the last successful run time.
- **Workers AI rate limits** → Paid plan has higher limits. Ensure Workers AI is enabled for your account.

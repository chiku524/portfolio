/**
 * Project → Blog Hub mapping.
 *
 * Fields:
 *   - name: Display name
 *   - github: { owner, repo } — GitHub repo (e.g. github.com/owner/repo)
 *   - notionHubId: Notion page ID of this project's blog hub. Set after creating the hub and sharing with your integration.
 *   - domain: Optional Cloudflare domain for context in generated posts
 *
 * GitHub repo names must match your actual repository slugs (check github.com/chiku524).
 * To get Notion page IDs: open the page in Notion → copy URL → ID is the 32-char hex.
 * See docs/blog-automation.md for full instructions.
 */
export const PROJECTS = [
  { name: "Blockchain Vibe", github: { owner: "chiku524", repo: "blockchainvibe" }, notionHubId: "313c0750-e6ae-81a9-994a-ebf6cffaa7a0", domain: "blockchainvibe.news" },
  { name: "Micro Paywall", github: { owner: "chiku524", repo: "solana-micro-paywall" }, notionHubId: "313c0750-e6ae-81f6-b6fc-dd8b2f066978", domain: "micropaywall.app" },
  { name: "Motion", github: { owner: "chiku524", repo: "motion.productions" }, notionHubId: "313c0750-e6ae-81c2-9564-ea9b4d6202d5", domain: "motion.productions" },
  { name: "Dice Express", github: { owner: "chiku524", repo: "dice.express" }, notionHubId: "313c0750-e6ae-8175-8bf3-e2f668361c1d", domain: "dice.express" },
  { name: "The Studio Circus", github: { owner: "chiku524", repo: "the-studio-circus" }, notionHubId: "313c0750-e6ae-8131-85d4-f885ef8ee305", domain: "thestudiocircus.io" },
  { name: "BountyHub", github: { owner: "chiku524", repo: "bountyhub" }, notionHubId: "313c0750-e6ae-8175-b1ed-c1698ef1985c", domain: "bountyhub.tech" },
  { name: "VibeMiner", github: { owner: "chiku524", repo: "VibeMiner" }, notionHubId: "313c0750-e6ae-8195-b018-f281ad31ac13", domain: "vibeminer.tech" },
  { name: "Boing Network", github: { owner: "chiku524", repo: "boing-network" }, notionHubId: "313c0750-e6ae-810e-a428-f04ad5a570b2", domain: "boing.network" },
  { name: "Boing Express", github: { owner: "chiku524", repo: "boing.express" }, notionHubId: "313c0750-e6ae-8190-9057-f9309bff4709", domain: "boing.express" },
  { name: "Boing Explorer", github: { owner: "chiku524", repo: "boing-explorer" }, notionHubId: "313c0750-e6ae-81ee-9a88-fbfa056be74c", domain: "boing.observer" },
  { name: "Boing Finance", github: { owner: "chiku524", repo: "boing.finance" }, notionHubId: "313c0750-e6ae-81e9-9036-ef82f0f40fa2", domain: "boing.finance" },
  { name: "Portfolio", github: { owner: "chiku524", repo: "portfolio" }, notionHubId: "313c0750-e6ae-81ba-b34a-f8ac1e287b09", domain: "nico.builds" },
  { name: "Schmiedeler Associates", github: { owner: "chiku524", repo: "schmiedeler-associates" }, notionHubId: "313c0750-e6ae-81da-b873-c8960e667fc7", domain: null },
]

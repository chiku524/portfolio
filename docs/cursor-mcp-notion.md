# Fix Notion MCP availability

The Notion MCP is configured in `.cursor/mcp.json` but may **not appear in the available MCP servers** (only Cloudflare and Stripe plugins are loaded). This prevents the AI from creating Notion pages directly.

## Steps to fix

### 1. Add Notion MCP globally (recommended)

Project-level `mcp.json` can sometimes fail to load. Add it as a **global** MCP:

1. Open **Cursor Settings** (Ctrl+, or Cmd+,)
2. Search for **"MCP"** or go to **Tools & MCP**
3. Click **Edit in settings.json** (or open the MCP config)
4. Ensure the Notion server is in your config:
   ```json
   {
     "mcpServers": {
       "notion": {
         "url": "https://mcp.notion.com/mcp"
       }
     }
   }
   ```
5. **Save** the file

### 2. Restart Cursor completely

- Quit Cursor fully (not just close the window)
- Reopen Cursor and your project
- MCP servers load at startup

### 3. Authenticate when prompted

On first use of a Notion tool, Cursor will prompt you to complete the OAuth flow to connect your Notion workspace.

---

After the Notion MCP appears in the available servers, you can ask the AI to create the blog hub pages for you directly.

# demo-application

Sample web application used to demo an AI agent (built with Strands Agents and the GitHub MCP server) that fixes UI issues and opens pull requests on its own.

## What's inside

| Path | Description |
|---|---|
| `index.html`, `css/`, `js/` | Brew & Bean, a landing page for a fictional coffee shop. Plain HTML/CSS/JS, no build step. |

The site has a few known UI bugs on purpose. They are what the agent is asked to find and fix.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Project structure

```
index.html      page markup
css/styles.css  all styles
js/app.js       renders the menu cards
js/             additional utilities
```

## Deploy

The site is served as-is by GitHub Pages from the `main` branch root.

### Cluster Configuration Export

This utility exports current cluster state for deployment verification and debugging.

```bash
# Export current cluster configuration
node js/collect-configs.js

# Output: cluster-configs/ directory with YAML/JSON exports
```

The exported files are used to:
- Verify deployment manifests match actual cluster state
- Debug deployment issues
- Document current cluster configuration
- Compare expected vs actual state

### Development Notes

- The application uses ConfigMaps for configuration
- Secrets are managed via Kubernetes Secrets
- Deployment is automated via GitOps

## Scripts

| Script | Purpose |
|--------|---------|
| `collect-configs.js` | Export current cluster state for verification |

## Demo flow

1. Open a GitHub issue (or give the agent a prompt) describing a UI problem, e.g. *"The Order Now button on the homepage is invisible."*
2. The agent reads the repo through the GitHub MCP server, finds the cause, and commits a fix to a new branch.
3. The agent opens a pull request explaining the change.
4. Review and merge the PR.

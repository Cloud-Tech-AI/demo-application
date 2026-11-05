# demo-application

Sample web application used to demo an AI agent (built with Strands Agents and the GitHub MCP server) that fixes UI issues and opens pull requests on its own.

## What's inside

| Path | Description |
|---|---|
| `brew-and-bean/` | Landing page for a fictional coffee shop. Plain HTML/CSS/JS, no build step. |

The site has a few known UI bugs on purpose. They are what the agent is asked to find and fix.

## Run locally

```bash
python3 -m http.server 8000 --directory brew-and-bean
```

Then open http://localhost:8000.

## Project structure

```
brew-and-bean/
├── index.html      page markup
├── css/styles.css  all styles
└── js/app.js       renders the menu cards
```

## Demo flow

1. Open a GitHub issue (or give the agent a prompt) describing a UI problem, e.g. *"The Order Now button on the homepage is invisible."*
2. The agent reads the repo through the GitHub MCP server, finds the cause, and commits a fix to a new branch.
3. The agent opens a pull request explaining the change.
4. Review and merge the PR.

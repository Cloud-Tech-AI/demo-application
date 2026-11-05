# Brew & Bean

Landing page for Brew & Bean, a neighbourhood coffee shop. Plain HTML/CSS/JS, no build step.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

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
node brew-and-bean/js/collect-configs.js

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


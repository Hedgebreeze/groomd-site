---
deploy:
  type: github-actions
  review_mode: github-actions
  merge_deploys_prod: true
actions:
  staging_label: Review PR
  ship_label: Merge to Main
  merge_label: Merge to Main
  setup_merge_label: Merge HBHQ.md
  send_back_label: Request changes
---

# Groomd Site HBHQ Contract

Groomd Site is the static marketing/support site for Groomd plus a Cloudflare Worker API under `cloudflare-worker/`.

Each request should create a branch and PR. HBHQ should treat this as GitHub-Actions-on-merge for site edits. Cloudflare Worker deploys remain explicit/manual until that path is wired into HBHQ.

## Build And Test

Static pages can be inspected directly:

```bash
open index.html
open privacy.html
open support.html
open vail-lifts.html
```

Cloudflare Worker:

```bash
cd cloudflare-worker
npx wrangler dev
```

Only deploy the worker with Wrangler when the request explicitly asks for it and credentials are configured.

## Agent Notes

- Keep the first viewport product-focused. The site is for Groomd, not a generic landing page.
- Preserve static hosting compatibility; avoid adding a build system unless the request requires it.
- Do not commit Cloudflare credentials or account-specific secrets.
- Keep PRs focused on the assigned HBHQ item. Do not merge your own PR.

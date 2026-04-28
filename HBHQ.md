---
deploy:
  type: none
actions:
  staging_label: No deploy
  ship_label: Merge PR
  merge_label: Merge PR
  setup_merge_label: Merge HBHQ.md
  send_back_label: Request changes
---

# Groomd Site HBHQ Contract

Groomd Site is the static marketing/support site for Groomd plus a Cloudflare Worker API under `cloudflare-worker/`.

HBHQ should treat this as merge-only until the hosting and Cloudflare deploy path are wired into HBHQ.

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

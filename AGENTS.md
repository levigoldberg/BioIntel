# BioIntel Coding-Agent Instructions

These instructions apply to the entire BioIntel repository.

## Product approach

- BioIntel is moving from prototype to a live-source biotech intelligence dashboard.
- Preserve the signal-centered product model: BioIntel shows source-backed biotech signals, not generic article lists.
- Make source quality, evidence status, and trust cues visible in product work.
- Keep external source fetching server-side through Next.js route handlers or server utilities.
- Do not add authentication, Supabase, a database, scraping, paid sources, browser-side external source calls, or AI summarization unless explicitly asked.

## Code style

- Use simple, readable TypeScript.
- Keep components focused.
- Avoid unnecessary abstractions.
- Prefer clear names over clever patterns.
- Keep source configuration/default topic data separate from UI components.
- Use React state for local UI interactivity.
- Do not add an external state management library unless explicitly requested.

## Scope guardrails

- Do not add authentication unless asked.
- Do not add a database unless asked.
- Do not add AI summarization unless asked.
- Do not reintroduce fallback datasets that look like source-backed signals.
- Never expose API keys or secrets.
- Do not commit `.env` files or secrets.

## Documentation and handoff

- Always summarize what changed and what was tested.
- Keep README and docs aligned with implementation changes.
- If product scope changes, update the relevant documents in `docs/`.
- After completing a full requested prompt, commit the changes, push them to GitHub, and merge them into the deployment branch when the working tree is clean and tests pass.

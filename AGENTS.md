# BioIntel Coding-Agent Instructions

These instructions apply to the entire BioIntel repository.

## Product approach

- BioIntel v1 is a mock-data-first MVP for a personalized biotech intelligence dashboard.
- Preserve the signal-centered product model: BioIntel shows source-backed biotech signals, not generic article lists.
- Make source quality, evidence status, and trust cues visible in product work.
- Do not build real ingestion, external API calls, authentication, or a database unless explicitly asked.

## Code style

- Use simple, readable TypeScript.
- Keep components focused.
- Avoid unnecessary abstractions.
- Prefer clear names over clever patterns.
- Keep mock data in separate files from UI components.
- Use React state for v1 interactivity.
- Do not add an external state management library unless explicitly requested.

## Scope guardrails

- Do not add real APIs unless asked.
- Do not add authentication unless asked.
- Do not add a database unless asked.
- Preserve the mock-data-first MVP approach.
- Never expose API keys or secrets.
- Do not commit `.env` files or secrets.

## Documentation and handoff

- Always summarize what changed and what was tested.
- Keep README and docs aligned with implementation changes.
- If product scope changes, update the relevant documents in `docs/`.

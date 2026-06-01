# BioIntel Build 2 Demo QA Notes

Build 2 remains frontend-only and mock-data-only. This checklist is intended for a quick local demo pass after dependencies are available.

## Demo flow

1. Open Today and confirm the page says “BioIntel Briefing.”
2. Change briefing length, source mix, analysis mode, and time window.
3. Switch each section filter and confirm the feed updates or shows a useful empty state.
4. Select a signal and confirm the mobile inline detail or desktop side detail updates.
5. Click Open sources and inspect the source drill-down trust cues.
6. Use Save, Hide, Less like this, and Track related topic on a signal.
7. Open Settings, change default briefing settings, return to Today, and confirm Today initializes from shared client-side settings during the session.
8. Open Watchlist, Sources, and Archive to confirm local controls work without persistence or external calls.

## Mock-data boundary checks

- No authentication.
- No database.
- No external APIs.
- No OpenAI API.
- No scraping or RSS ingestion.
- No Supabase.

## Validation commands

Run these when npm registry access is available:

```bash
npm install
npm run lint
npm run build
```

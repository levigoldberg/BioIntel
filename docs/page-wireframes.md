# BioIntel v1 Page Wireframes

These wireframes are implementation-oriented text sketches. They are not visual design comps, but they define layout, hierarchy, content, and responsive behavior.

## Global layout

### Desktop shell

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ BioIntel logo/name                                                           │
├───────────────┬──────────────────────────────────────────────────────────────┤
│ Sidebar nav   │ Page content                                                 │
│               │                                                              │
│ Today         │                                                              │
│ Watchlist     │                                                              │
│ Sources       │                                                              │
│ Settings      │                                                              │
│ Archive       │                                                              │
│               │                                                              │
│ Mock data v1  │                                                              │
└───────────────┴──────────────────────────────────────────────────────────────┘
```

### Mobile shell

```text
┌──────────────────────────────┐
│ BioIntel        Menu button  │
├──────────────────────────────┤
│ Page content                 │
│                              │
│ Bottom or collapsible nav    │
└──────────────────────────────┘
```

## Today page

The Today page should be the most polished screen. It should feel like a morning intelligence product, not a news list.

### Desktop wireframe

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ BioIntel Briefing                                                                           │
│ Mon, Jun 1, 2026 • Generated 7:15 AM • 12 signals found                                     │
│ Source mode: Balanced • Analysis mode: Scientist                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ Briefing length [5] [10] [20]  Source mix [Primary only] [Balanced] [Broad]                 │
│ Analysis [Scientist] [Consultant] [Investor] [Beginner]  Window [24h] [3d] [7d]             │
├───────────────┬───────────────────────────────────────────────┬─────────────────────────────┤
│ Section       │ Signal feed                                   │ Selected signal detail       │
│ filters       │                                               │                             │
│               │ ┌───────────────────────────────────────────┐ │ ┌─────────────────────────┐ │
│ Top Signals   │ │ MAJOR SIGNAL CARD                         │ │ │ Full headline           │ │
│ Clinical      │ │ Event badge • Relevance • Confidence      │ │ │ Evidence status         │ │
│ Regulatory    │ │ Source status                             │ │ │                         │ │
│ Publications  │ │ Summary                                   │ │ │ Why you are seeing this │ │
│ Company       │ │ Why it matters preview                    │ │ │ Why it matters          │ │
│ Deals         │ │ Tags                                      │ │ │ What changed            │ │
│ Saved         │ │ Matched topics                            │ │ │                         │ │
│               │ │ Source trail preview                      │ │ │ Source trail            │ │
│               │ │ Save Hide Less Track Sources              │ │ │ - Source type           │ │
│               │ └───────────────────────────────────────────┘ │ │ - Trust level           │ │
│               │                                               │ │ - Role                  │ │
│               │ ┌───────────────────────────────────────────┐ │ │                         │ │
│               │ │ STANDARD SIGNAL CARD                      │ │ │ Related companies       │ │
│               │ └───────────────────────────────────────────┘ │ │ Related diseases        │ │
│               │                                               │ │ Related mechanisms      │ │
│               │ ┌───────────────────────────────────────────┐ │ │ Suggested next actions  │ │
│               │ │ COMPACT SIGNAL CARD                       │ │ └─────────────────────────┘ │
│               │ └───────────────────────────────────────────┘ │                             │
└───────────────┴───────────────────────────────────────────────┴─────────────────────────────┘
```

### Mobile wireframe

```text
┌──────────────────────────────┐
│ BioIntel Briefing            │
│ Date • Generated time        │
│ 12 signals • Balanced        │
├──────────────────────────────┤
│ Quick controls wrap          │
├──────────────────────────────┤
│ Section filter dropdown      │
├──────────────────────────────┤
│ Signal card                  │
│ Signal card                  │
│ Selected card detail panel   │
│ Signal card                  │
└──────────────────────────────┘
```

### Today content hierarchy

1. Briefing identity and status.
2. Controls for personalization.
3. Section filter.
4. Ranked signal feed.
5. Selected signal source-backed detail.

### Signal card sizes

#### Major signal card

Use for high-importance updates. This card should be visually larger and include all required card fields.

```text
┌─────────────────────────────────────────────────────────────┐
│ Clinical Data Readout • High relevance • High confidence    │
│ Confirmed primary source                                    │
│                                                             │
│ Headline                                                    │
│ One-sentence summary                                        │
│                                                             │
│ Why it matters: preview text...                             │
│                                                             │
│ Tags: Sjögren’s  anti-APRIL  Phase 2  Immunology            │
│ Matched: Sjögren’s, anti-APRIL                              │
│ Sources: Company PR → ClinicalTrials.gov → PubMed context   │
│                                                             │
│ [Save] [Hide] [Less like this] [Track topic] [Open sources] │
└─────────────────────────────────────────────────────────────┘
```

#### Standard signal card

Use for normal updates. It should include all fields but with shorter source and implication previews.

```text
┌─────────────────────────────────────────────────────────────┐
│ Regulatory Update • Medium relevance • High confidence      │
│ Confirmed primary source                                    │
│ Headline                                                    │
│ Summary                                                     │
│ Why it matters: preview                                     │
│ Tags • Matched topics • Source preview                      │
│ [Save] [Hide] [Less] [Track] [Sources]                      │
└─────────────────────────────────────────────────────────────┘
```

#### Compact signal card

Use for lower-priority matches. It should still preserve trust cues.

```text
┌─────────────────────────────────────────────────────────────┐
│ Publication • Medium confidence • Peer-reviewed             │
│ Headline                                                    │
│ Tags: Alzheimer’s, biomarker                                │
│ Source: PubMed                                              │
│ [Save] [Hide] [Sources]                                     │
└─────────────────────────────────────────────────────────────┘
```

## Signal detail panel

The detail panel should make the five core questions obvious.

```text
┌──────────────────────────────────────────┐
│ Event type badge      Evidence badge     │
│ Full headline                            │
│ Date                                     │
├──────────────────────────────────────────┤
│ Why you are seeing this                  │
│ Watchlist matches and ranking rationale  │
├──────────────────────────────────────────┤
│ Why it matters                           │
│ Practical implications                   │
├──────────────────────────────────────────┤
│ What changed                             │
│ • Change 1                               │
│ • Change 2                               │
├──────────────────────────────────────────┤
│ Source trail                             │
│ ┌──────────────────────────────────────┐ │
│ │ ClinicalTrials.gov                   │ │
│ │ Primary source • very high trust     │ │
│ │ Role: Primary confirmation           │ │
│ │ Note: Trial status changed...        │ │
│ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ │
│ │ Company press release                │ │
│ │ Company source • medium trust        │ │
│ │ Role: Original disclosure            │ │
│ │ Requires confirmation: yes           │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ Related companies                        │
│ Related diseases                         │
│ Related mechanisms                       │
├──────────────────────────────────────────┤
│ Suggested next actions                   │
└──────────────────────────────────────────┘
```

## Watchlist page

### Desktop wireframe

```text
┌────────────────────────────────────────────────────────────────────┐
│ Watchlist                                                          │
│ Track the topics BioIntel uses to personalize signals.             │
├────────────────────────────────────────────────────────────────────┤
│ Diseases                                                           │
│ ┌──────────────┬─────────┬─────────────┬──────────┬──────────────┐ │
│ │ Name         │ Type    │ Synonyms    │ Priority │ Status       │ │
│ │ Sjögren’s    │ Disease │ Sjogren...  │ High     │ Enabled      │ │
│ │ IgAN         │ Disease │ ...         │ High     │ Paused       │ │
│ └──────────────┴─────────┴─────────────┴──────────┴──────────────┘ │
│ Companies                                                          │
│ Mechanisms                                                         │
│ Drugs / assets                                                     │
│ Keywords / themes                                                  │
└────────────────────────────────────────────────────────────────────┘
```

### Watchlist item card alternative

```text
┌────────────────────────────────────────┐
│ Name                     Enabled toggle │
│ Type • Priority • 4 recent signals      │
│ Synonyms: term, term, term              │
│ [Edit] [Remove]                         │
└────────────────────────────────────────┘
```

## Sources page

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Sources                                                                      │
│ Control which source classes BioIntel uses and how much to trust them.       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Primary sources                                                              │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ ClinicalTrials.gov  Enabled                                              │ │
│ │ Type: Primary source • Trust: very high • Priority: high • Bias: low     │ │
│ │ Requires primary confirmation: no                                        │ │
│ │ Useful for: Trial starts, completions, endpoints, status changes.        │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│ Industry news                                                                │
│ Scientific literature                                                        │
│ Financial filings                                                            │
│ Company sources                                                              │
│ Noisy / social sources                                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Settings page

The Settings page should be practical and short. It sets defaults for Today rather than exposing a complex preference center.

```text
┌────────────────────────────────────────────────────────────────────┐
│ Settings                                                           │
│ Keep the daily briefing focused without over-configuring v1.        │
├────────────────────────────────────────────────────────────────────┤
│ Briefing defaults                                                  │
│ Default length [5] [10] [20]                                       │
│ Source mix [Primary only] [Balanced] [Broad]                       │
│ Analysis mode [Scientist] [Consultant] [Investor] [Beginner]       │
│ Time window [24h] [3d] [7d]                                        │
│ Detail depth [Quick skim] [Standard] [Detailed analyst]            │
├────────────────────────────────────────────────────────────────────┤
│ Trust preferences                                                  │
│ [ ] Include low-confidence signals                                 │
│ [ ] Include speculative / noisy signals                            │
│ [x] Require primary confirmation for major claims                  │
├────────────────────────────────────────────────────────────────────┤
│ v1 note                                                            │
│ Advanced event-priority sliders, notification settings, account     │
│ settings, and source credentials are deferred.                     │
└────────────────────────────────────────────────────────────────────┘
```

## Archive page

```text
┌────────────────────────────────────────────────────────────────────┐
│ Archive                                                            │
│ Search past briefings and saved signals.                           │
├────────────────────────────────────────────────────────────────────┤
│ Search bar                                                         │
│ Filters: disease company mechanism event type date                 │
├─────────────────────────────┬──────────────────────────────────────┤
│ Past daily briefings        │ Saved signals                        │
│ Jun 1 • 12 signals          │ Signal card/list item                │
│ May 31 • 9 signals          │ Signal card/list item                │
│ May 30 • 14 signals         │ Signal card/list item                │
└─────────────────────────────┴──────────────────────────────────────┘
```

## Visual style notes

- Use a calm, professional color palette.
- Use off-white or very light gray page background.
- Use white cards with subtle borders and shadows.
- Use small colored badges for event type, confidence, and source status.
- Avoid excessive color saturation.
- Use typography hierarchy rather than animation for emphasis.
- Keep density high enough for professional users, but preserve readable spacing.

# Plomberie Boileau Inc. — Project Summary
*Brand identity + website project · Montreal, QC · Last updated June 12, 2026*
*Publish this file to the Claude project files section so every future chat has full context.*

---

## 1. The client & the mission
- **Client:** Plomberie Boileau Inc. — Montreal plumber holding **both plumbing and HVAC certificates** (RBQ/CMMTQ context).
- **Current state:** works with a few steady clients; no brand, no website. Not taking new clients now, but wants the foundation built — and SEO compounding early.
- **Mission:** complete brand identity first, then a memorable website. English version built first, then Quebec-French; **live site defaults to French (Law 96)**.

## 2. Locked decisions (do not reopen without the owner)
| Decision | Choice |
|---|---|
| Contact strategy | **No booking.** Waitlist notice ("booked for a few weeks") + email capture |
| Brand personality | **Friendly neighbourhood expert** — warm, local, certified-calm, honest about the wait |
| Audience | Residential (plex + condo owners) **and** light commercial / property managers |
| Tagline | "Your water. Your warmth. Your neighbour." / «Votre eau. Votre chaleur. Votre voisin.» |
| Logo direction | Heritage **crest/seal** (primary) + horizontal lockup; mark = **flame inside a water drop** (Boileau → "bouille l'eau" → boil the water). Owner loves the flame-in-drop mark. |
| Palette | **Variant 2 — Fresh trade green** (chosen over patina/copper) |

## 3. Brand system spec
**Colors:** spruce `#157A55` (primary) · deep spruce `#0C4A36` · brass `#D99A3D` (accent, ≤10% of layout, never body text) · ice `#F2F6F3` (bg) · mint `#DCEFE5` (tints) · ink `#1C2B24` (text). Ratio 60/25/10/5. Ice-on-spruce 4.9:1 (AA).
**Type:** Bricolage Grotesque (display 600–700) · Work Sans (body 400–500) · Fraunces italic (tagline/pull-quotes only). All Google Fonts.
**Wordmark descriptor:** "EAU · CHALEUR · MONTRÉAL" (= water · heat · Montreal — French, bilingual-safe).
**Voice:** plain words, borough names, numbers over adjectives, zero fearmongering, honest scarcity ("we're booked — join the list, we call in order"). French copy = Quebec French (thermopompe, plex, clapet antiretour), never France French.
**Trust-signal block (footer/invoices/truck, fixed order):** RBQ licence № [placeholder] · CMMTQ member · Fully insured · Plumbing + heating certified. Invite verification in the RBQ registry.

## 4. Research findings that shape everything
- **Trust is verifiable in Quebec:** consumers are coached to check the RBQ registry, CMMTQ membership, insurance, and written estimates; unlicensed work can void insurance and derail home sales. Licence visibility = conversion.
- **Montreal-specific fears:** sewer backup during storms/snowmelt (the City puts backwater-valve responsibility on owners; valves are often hidden/worn), frozen/burst pipes in January, aging plex housing stock (cast-iron stacks, hidden shut-offs).
- **The green strategy:** Hydro-Québec **LogisVert** pays up to ~$6,720–$7,840 for heat pumps and **requires an RBQ-licensed contractor** — Boileau's dual certification literally unlocks the rebate. Green = LogisVert/energy transition, not just a color.
- **Seasonal SEO calendar:** Jan–Feb frozen pipes/water heaters → Mar–Apr melt backups → Jun–Aug storm backups + heat pump/AC → Sep–Nov heating prep + rebate urgency.
- **Waitlist positioning:** scarcity framed as proof of demand ("the plumber worth waiting for"), never as a sales trick.

## 5. Personas (speak to these)
1. **Plex owner** (Rosemont/Villeray/Plateau/NDG): fears basement sewage backup; dreams of a heat pump + rebate cheque.
2. **Condo owner:** needs insurer-ready water heater conformity, documentation, tidiness.
3. **Small commercial / property manager:** wants one reliable number, fast clean invoices, maintenance plans.

## 6. Deliverables produced so far
| File | Status |
|---|---|
| `brand-guidelines.html` | ✅ v1 — 10-section English brand book (story, audiences, logo, color, type, voice, messaging matrix, trust signals, applications, bilingual rules) |
| `logo-crest.svg` | ✅ v2 — arc-text geometry fixed; straight bottom line removed (v1 rejected for bottom-text formatting) |
| `logo-horizontal.svg` | ✅ approved by owner |
| `claude-code-website-guide.md` | ✅ guide: new GitHub repo + VS Code + Claude Code subagents (opus planners/reviewers, sonnet builders) + GitHub Pages deploy + adapted orchestration prompt + CLAUDE.md template + 5 ready agent files |
| `project-summary.md` | ✅ this file |

## 7. Website spec (next build phase — not yet built)
- Static site: semantic HTML/CSS/vanilla JS. FR default at root, `/en/` mirror. Sitemap, robots, JSON-LD LocalBusiness, FAQPage schema on articles.
- Sections: animated hero (drop→flame moment), services (plumbing / heating / heat pumps + LogisVert hook), "Why the wait?" (scarcity-as-proof), waitlist email capture, blog hub.
- **"Remembers you":** first visit asks one friendly question (plex / condo / commercial + optional first name) → localStorage → return visits greet by name and reorder sections.
- Animations: scroll reveals + hero moment; respect `prefers-reduced-motion`.
- Blog seed articles (FR+EN): backwater valves & sewer backup · frozen pipes in Montreal winters · LogisVert heat pump rebate guide.

## 8. Open items
- [ ] Owner to supply real RBQ licence number, founding year, service-area boundaries, photo of himself/truck (optional).
- [ ] Decide: keep French descriptor on EN wordmark, or switch to "WATER · HEAT · MONTREAL".
- [ ] Refine logo vectors to production quality in Canva.
- [ ] Build website per spec (in chat, or via Claude Code per the guide).
- [ ] Buy domain (suggest `plomberieboileau.ca`) before heavy blog publishing.

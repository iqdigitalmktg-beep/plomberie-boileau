# Guide: Rebuild & Ship the Boileau Website with VS Code + GitHub + Claude Code (Subagents)

You already build another brand's site with VS Code → GitHub → Claude Code. This guide reuses those **exact same accounts and tools** to run a *second* website as a separate project, and shows you how to feed your original prompt into Claude Code so a planner model orchestrates Opus/Sonnet subagents to produce the brand + website.

---

## Part 1 — One new repo, same accounts (10 minutes)

You don't need new accounts for a second website. GitHub separates projects by **repository**; Claude Code separates them by **folder**.

1. **Create the repo.** Go to github.com → "+" → *New repository* → name it `plomberie-boileau` → Public (required for free GitHub Pages) → check *Add a README* → Create.
2. **Clone it in VS Code.** `Ctrl/Cmd+Shift+P` → *Git: Clone* → paste the repo URL → choose a folder **separate from your other brand's folder** (e.g. `~/sites/plomberie-boileau`). Open it as its own VS Code window.
3. **Open Claude Code in that folder.** Open the VS Code terminal (`` Ctrl+` ``) and run `claude`. Claude Code scopes itself to the current working directory — your other brand's project is untouched. Same Claude account, same login, zero conflict.
4. **Drop in the existing assets** (optional but recommended): copy `brand-guidelines.html`, `logo-crest.svg`, `logo-horizontal.svg`, and `project-summary.md` from this chat into the repo root. The subagents will treat them as source-of-truth.

> Rule of thumb: **one website = one repo = one VS Code window = one Claude Code session.** Everything else (GitHub account, Claude account, extensions) is shared.

---

## Part 2 — Project memory: CLAUDE.md

Claude Code automatically reads a `CLAUDE.md` file in the repo root at the start of every session. This is how every subagent stays on-brand without you repeating yourself. Create it:

```markdown
# Plomberie Boileau Inc. — project memory

## Brand (locked decisions — do not reinvent)
- Tagline: "Your water. Your warmth. Your neighbour." / «Votre eau. Votre chaleur. Votre voisin.»
- Personality: friendly neighbourhood expert; certified-calm; honest about the waitlist. Never fearmonger.
- Colors: spruce #157A55, deep spruce #0C4A36, brass #D99A3D (accent ≤10%), ice #F2F6F3, mint #DCEFE5, ink #1C2B24
- Type: Bricolage Grotesque (display 600–700), Work Sans (body 400–500), Fraunces italic (tagline only)
- Logo: flame-inside-water-drop mark (boil + eau). Crest = seal style. Files: logo-crest.svg, logo-horizontal.svg
- Trust signals on every page footer: RBQ licence № [placeholder], CMMTQ member, fully insured, plumbing + heating certified
- Site defaults to FRENCH (Law 96); EN toggle top right. Quebec French, never France French.
- Contact strategy: NO booking. Waitlist notice ("booked for a few weeks") + email capture only.
- Audiences: plex owners, condo owners, small commercial/property managers (Montreal).
- SEO pillars: backwater valves/sewer backup, frozen pipes, water heater conformity, LogisVert heat pump rebates (up to ~$7,840, requires RBQ-licensed contractor).

## Engineering
- Static site, no framework needed: semantic HTML + CSS + vanilla JS. localStorage OK (real website, not an artifact).
- "Remembers you" feature: first-visit micro-question (plex/condo/commercial + optional first name) stored in localStorage; returning visits personalize greeting + section order.
- Accessibility AA. Respect prefers-reduced-motion. schema.org LocalBusiness JSON-LD.
- Deploy target: GitHub Pages from main branch.
```

---

## Part 3 — The subagent files

Create a folder `.claude/agents/` in the repo. Each agent is a Markdown file: YAML frontmatter (name, description, tools, **model**) on top, system prompt below. The `model` field accepts the aliases `sonnet`, `opus`, `haiku`, `fable`, a full model ID, or `inherit` (the default). Agents added as files on disk load on the **next** session start; agents made with the `/agents` command load immediately.

**`.claude/agents/brand-strategist.md`**
```markdown
---
name: brand-strategist
description: Reviews any brand or copy decision against the locked brand identity. Use proactively before and after writing site copy.
tools: Read, Glob, Grep
model: opus
---
You are the brand guardian for Plomberie Boileau. Read CLAUDE.md and brand-guidelines.html first.
Judge all copy and design choices against: warm neighbour voice, certified-calm (no fear tactics),
honest waitlist framing, French-first bilingual rules. Return specific rewrites, not vague notes.
```

**`.claude/agents/web-builder.md`**
```markdown
---
name: web-builder
description: Implements HTML/CSS/JS for the website. Use for all code writing tasks.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
---
You build the static Boileau site. Follow CLAUDE.md tokens exactly — never invent colors or fonts.
Semantic HTML, mobile-first CSS, vanilla JS. Implement the localStorage personalization
(visitor type + first name → greeting and section reordering). Respect prefers-reduced-motion.
Every page: JSON-LD LocalBusiness, meta description, OG tags, footer trust badges.
```

**`.claude/agents/seo-writer.md`**
```markdown
---
name: seo-writer
description: Writes blog articles and on-page SEO copy targeting Montreal plumbing/HVAC searches.
tools: Read, Write, Glob, WebSearch
model: sonnet
---
You write Boileau's blog. Voice: friendly Montreal neighbour with a licence. Topics rotate seasonally:
backwater valves (spring/summer storms), frozen pipes (Dec–Feb), water heater conformity (year-round),
LogisVert heat pump rebates (spring/fall). Each article: one target query in H1, plain-language answer
in the first 80 words, borough-specific details, internal links, FAQ block with FAQPage schema.
```

**`.claude/agents/translator-quebec.md`**
```markdown
---
name: translator-quebec
description: Produces the Quebec-French version of any page or article. Use after English content is approved.
tools: Read, Write, Edit, Glob
model: sonnet
---
You adapt — never literally translate — English content into natural Quebec French.
Vocabulary: thermopompe (not pompe à chaleur seule), chauffe-eau, plex, refoulement d'égout,
clapet antiretour. Tagline is fixed: «Votre eau. Votre chaleur. Votre voisin.»
French is the site default; keep slugs French (/services, /blogue).
```

**`.claude/agents/qa-reviewer.md`**
```markdown
---
name: qa-reviewer
description: Final review of code and content. Use proactively before any commit.
tools: Read, Glob, Grep, Bash
model: opus
---
You are the last gate. Check: brand-token fidelity, accessibility (contrast, focus states,
reduced motion), valid HTML, working localStorage logic, schema.org validity, FR prominence ≥ EN
(Law 96), no booking/contact promises beyond the waitlist. Output a pass/fail list with file:line refs.
```

> Cost/speed tip: keep your **main session** on the strongest planner model and let it stay high-level; route the typing-heavy work to the Sonnet agents. You can also set a default for all subagents with the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable.

---

## Part 4 — Running your original prompt through the orchestra

Start Claude Code in the repo, pick your planner model with `/model` (choose the most capable planning model available on your plan — e.g. Fable/Opus), then press **Shift+Tab to enter Plan Mode** so it plans before touching files. Paste this adapted version of your original prompt:

```text
Plan this task yourself, then delegate implementation to my subagents
(web-builder, seo-writer, translator-quebec) and use brand-strategist and
qa-reviewer to check work before completion. Run independent subagent tasks
in parallel where possible.

Goal: complete brand identity + website for Plomberie Boileau Inc., a
Montreal plumber holding both plumbing and HVAC certificates (RBQ/CMMTQ).
The brand identity is ALREADY DECIDED and locked in CLAUDE.md and
brand-guidelines.html — read both first; do not reinvent it.

Build the website English-first, then produce the Quebec-French version,
with the live site defaulting to French (Law 96). Brand must read
trustworthy and respected: licence badges, written-estimate culture, calm
expert voice. The site must be memorable with interactive and animated
elements, and it must remember who it's speaking to: ask first-time
visitors one friendly question (plex / condo / commercial + optional first
name), store it in localStorage, and personalize greeting and section order
on return visits. No booking: show a friendly notice that we're booked for
a few weeks, with an email waitlist capture. Include a blog section seeded
with 3 SEO articles (backwater valves, frozen pipes in Montreal winters,
LogisVert heat pump rebates) — the blog drives SEO. Audience: Montreal
plex owners, condo owners, and small commercial clients.

Deliverables: index.html (FR) + en/index.html, blogue/ articles FR+EN,
shared CSS/JS, sitemap.xml, robots.txt. Then stop and give me a review
checklist before we commit.
```

Approve the plan when it looks right. Claude will dispatch the subagents (each runs in its own isolated context and reports back); you can also invoke one directly anytime: *"Use the qa-reviewer agent on index.html."*

---

## Part 5 — Review, commit, deploy (GitHub Pages)

1. **Review diffs in VS Code** — Source Control panel shows every file Claude touched. Read before you commit; you're the owner.
2. **Commit & push:**
   ```bash
   git add -A
   git commit -m "Boileau brand site v1 (FR/EN)"
   git push origin main
   ```
3. **Turn on Pages:** repo → Settings → Pages → Source: *Deploy from a branch* → Branch `main`, folder `/ (root)` → Save. Two minutes later the site is live at `https://<your-username>.github.io/plomberie-boileau/`.
4. **Custom domain later:** buy `plomberieboileau.ca` when the client is ready → add it in the Pages settings → set the DNS CNAME → enforce HTTPS. SEO note: get the real domain before pushing hard on the blog, so authority accrues to the right place.

### The everyday loop after setup
new branch → `claude` → describe the change → review diff → commit → push → Pages redeploys automatically. Same loop you already know from your other brand — just a different folder and repo.

---

*Sources: Claude Code subagents documentation (code.claude.com/docs/en/sub-agents) — verify model alias availability against your plan.*

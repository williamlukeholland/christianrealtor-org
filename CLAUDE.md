# CLAUDE.md — christianrealtor.org

Permanent project instructions for Claude Code. Read this before doing any work.

## 1. Website overview

- **Website:** https://christianrealtor.org
- **Business:** William Luke Holland, Future Home Realty, Inc.
- **Source files:** everything published lives inside `ChristianRealtor.org/`.
  This outer folder (with this file) is the repository root and is not published.
- **Type:** static HTML website (no framework, no build step), stored on GitHub
  and deployed by Netlify. Netlify publishes the `main` branch to the live site.
- **Key features:**
  - Blog (`ChristianRealtor.org/blog/` + `blog.html` index)
  - Area guides (`ChristianRealtor.org/areas/`)
  - iHomefinder IDX property search (e.g. `idx.html`, `listings.html`,
    `featured-listings.html`, `waterfront.html`, `index.html`, area pages)
  - Follow Up Boss lead forms, sent through Netlify Functions in
    `ChristianRealtor.org/netlify/functions/`

## 2. Development safety

- Always check the current Git branch before modifying files
  (`git branch --show-current`) and tell the user which branch it is.
- Never modify website files while on `main`.
- Never commit, push, merge, or deploy without the user's explicit approval.
  Approval for one action does not carry over to the next.
- Use a development branch and a pull request for all proposed changes, so the
  user can review them on a Netlify Deploy Preview before merging.
- Never expose, store, or commit credentials, API keys, tokens, or client
  information (names, phone numbers, emails, addresses of leads or clients).
  The Follow Up Boss key lives only in Netlify's environment variables as
  `FUB_API_KEY` — never hardcode it.
- Preserve existing iHomefinder and lead-form functionality. Do not remove or
  alter iHomefinder embed scripts, form fields, or the Netlify Functions
  without explicit approval.
- Explain proposed changes in beginner-friendly language: what will change,
  which files, and why.

## 3. Website management

- Preserve the existing branding and design (burgundy/gold/cream palette,
  Playfair Display + Lato fonts, existing layout and tone).
- Prefer targeted edits over rewriting entire HTML files.
- After changes, check: internal links, page titles and meta descriptions,
  Open Graph tags, canonical URLs, and mobile compatibility.
- Avoid introducing unnecessary dependencies, frameworks, or build tools.

## 4. Blog and organic growth

- Help research, draft, optimize, and maintain high-quality real estate articles.
- Priority topics: South Tampa, waterfront real estate, relocation to Tampa Bay,
  and relevant seller topics.
- Before recommending new blog topics, review available Google Search Console
  data, the site's existing content, and the search intent behind the topic.
  Prioritize content that could attract qualified buyers and sellers.
  Do not assume Search Console access is available until it has been
  explicitly connected.
- Use reliable, citable sources plus the user's original local expertise.
- SEO / AEO / GEO strategy (traditional search and AI-powered search) should
  prioritize: original local expertise, accurate sources, clear and direct
  answers, internal linking, and appropriate structured data.
- `llms.txt` is optional. It is not a proven Google or AI-search ranking
  factor, so keep it accurate but do not rely on it for visibility.
- Never invent market statistics, quotes, or make unsupported claims. If a
  number can't be sourced, leave a clearly marked placeholder for the user.
- Every new article must be:
  1. added as a page in `ChristianRealtor.org/blog/`,
  2. added as a card on `ChristianRealtor.org/blog.html`, and
  3. added to `ChristianRealtor.org/sitemap.xml`.
- Never publish an article without the user's approval.

## 5. Future workflows

Roles planned for this project (to be defined later):
- Website & Organic Growth Manager
- Google Ads Marketing Analyst
- Follow Up Boss Lead Intelligence Coordinator

## Known facts about this codebase

- Each page contains its own `<style>` block; there is no shared stylesheet,
  so design changes may need to be repeated across pages.
- Blog posts are complete hand-built HTML pages (copy an existing post as the
  template). The blog index and sitemap are updated by hand.
- `ChristianRealtor.org/admin/config.yml` is a leftover Decap CMS setup that is
  not functional (no `admin/index.html`, and posts are not in its format).
  Do not rely on it or remove it without asking.
- Netlify Deploy Previews run the same Netlify Functions as production. Unless
  `FUB_API_KEY` is limited to the Production context, submitting a form on a
  preview creates a real lead in Follow Up Boss — avoid test submissions.
- There is no `.gitignore`; macOS `.DS_Store` files are tracked in Git.

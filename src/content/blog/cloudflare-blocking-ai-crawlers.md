---
title: "Cloudflare is blocking AI crawlers by default — how to check your site"
description: "Cloudflare's Content Independence Day update makes blocking AI crawlers nearly one click, and new sites inherit it. Here's how to check yours in two minutes."
pubDate: 2026-07-05
register: punchy-personal
tags: ["marketing-pov", "ai-visibility"]
# heroImage: "/images/blog/cloudflare-blocking-ai-crawlers.jpg"  # uncomment once you add the image to public/images/blog/
faqs:
  - question: "What is Cloudflare's Content Independence Day update?"
    answer: "Cloudflare now sorts AI bots into three types — Search, Agent, and Training — and starting September 15, 2026, new domains block Training and Agent by default on ad-supported pages while allowing Search. Every site owner gets a switch for each type."
  - question: "How do I know if my site is blocking AI crawlers?"
    answer: "Send a request as each AI bot and check the status code — 200 means allowed, 403 means blocked. Test GPTBot, OAI-SearchBot, ClaudeBot, and PerplexityBot. Your robots.txt won't tell you, because a CDN like Cloudflare can block at the edge, above it."
  - question: "Does robots.txt control whether AI can crawl my site?"
    answer: "Not entirely. robots.txt is a request; your CDN or firewall can override it and block bots before they read it — which is exactly how a site can block AI while its robots.txt says welcome."
  - question: "Should brands block AI crawlers?"
    answer: "Usually no. If your content is marketing for a product or service, AI citations are free distribution — keep the Search and Agent bots open and use content signals to allow referencing. Blocking mainly makes sense when your content itself is the product."
---

Cloudflare just made it easier than ever to block AI crawlers from your website — so easy that I accidentally did it to my own site (more on that below).

As of their "Content Independence Day" announcement, Cloudflare gives every site owner one-click control over which AI bots can reach their content, and for new sites, some of that blocking is on by default. That's great news if you're a publisher trying to stop AI from scraping you for free. It's potentially terrible news if you're a brand that *wants* AI to find, read, and cite you — and you don't realize a switch got flipped.

**TLDR:** Cloudflare now sorts AI bots into three types — Search, Agent, and Training — and lets you block each one, with some blocking defaulting to "on" for new sites. If you're a brand, blocking the AI Search crawlers means you disappear from ChatGPT, Perplexity, and Claude answers, even while you still rank fine on Google. Your robots.txt won't warn you, because the block happens at the CDN. Here's how to check your site in two minutes, and how to decide whether you should block AI at all.

## What is Cloudflare's "Content Independence Day" update?

Cloudflare stopped treating "AI bots" as one blob. They now sort them into three buckets:

- **Search** — crawls and indexes your content so an AI can cite it later. This is the one that gets you into ChatGPT and Perplexity answers.
- **Agent** — fetches your page in real time when a person asks an AI to go do something for them.
- **Training** — scrapes your content to train a model.

Starting September 15, 2026, brand-new domains will [block the Training and Agent bots by default](https://blog.cloudflare.com/content-independence-day-ai-options/) on ad-supported pages, while letting Search through. Every site owner — down to the free tier — gets a switch for each category. Cloudflare also added new robots.txt "content signals" — `immediate`, `reference`, `full` — so you can tell a bot whether it's allowed to store your content, quote it, or reproduce the whole thing.

## Why does blocking AI crawlers hurt your visibility?

The whole point of AI visibility is getting the answer engines to read your pages so they can cite you. Block their crawlers and none of your content work matters — there's nothing for them to pull from. (If you want the full walkthrough, here's [how I audit a brand's AI visibility](/blog/how-to-audit-ai-visibility) from scratch.)

This isn't a niche setting, either. Cloudflare sits in front of about **1 in 5 websites — and roughly 84% of every site that uses a CDN** ([W3Techs, 2026](https://w3techs.com/technologies/details/cn-cloudflare)), skewing toward exactly the business and brand sites that can least afford to vanish from AI answers. If you've done a serious build or migration lately, there's a real chance your site is behind it.

And it's easy to get wrong in a way that hurts twice. Googlebot does *two* jobs — regular search *and* training (Google-Extended feeds Gemini). Cloudflare manages a bot that wears two hats by its *most restrictive* rule. So if you click "block AI training" to feel safe, you can accidentally knock out Googlebot too and tank your regular SEO — the thing you were never trying to touch. "Just block the AI stuff" is rarely as simple as it sounds.

## Whoops — I did this to my own site

Quick confession — and it doubles as the warning. Over the past year, this work has pulled me way deeper into the technical, plumbing side of marketing than I ever expected to go: DNS records, robots.txt, CDN dashboards, edge rules. I'm a strategist, but AI visibility *lives* in that plumbing now, so I guess I'm grabbing my toolbelt and getting under the sink.

So: last weekend I had a surge of creativity, rebuilt lsxpartners.com from scratch, and moved it over to Cloudflare. Felt great about it. Then, reading this very announcement a few days later — right after an email thread with Jim Wrubel, CEO of the AI-crawler tracking platform [Spyglasses](https://www.spyglasses.io/en) — I realized the AI visibility expert had left AI crawlers blocked on her own website. FACE PALM.

Here's what my site was actually doing when I tested it:

| Who's knocking | What it feeds | Response |
|---|---|---|
| A normal browser (a human) | you | 200 OK |
| Googlebot / Google-Extended | Google + Gemini | 200 OK |
| **GPTBot** | ChatGPT | **403 blocked** |
| **OAI-SearchBot** | **ChatGPT's citations** | **403 blocked** |
| **ClaudeBot** | Claude | **403 blocked** |
| **PerplexityBot** | Perplexity | **403 blocked** |

Google sailed through. Every AI answer engine's crawler hit a wall. My robots.txt said "welcome, crawlers" the whole time — but robots.txt is a polite request, and Cloudflare's block happens at the edge, before a bot ever reads it. Which means my "welcome, crawlers" never actually reached them — Cloudflare stopped every bot one layer above it.

The fix was one dropdown — **Control AI crawlers → "Block AI training bots" → Do not block** — and all those 403s flipped to 200s. Thankfully, it was only live for less than a week.

I'm telling you this because if it can slip past someone who does this for a living, it can absolutely slip past a team juggling a site migration and forty other things. Which is exactly why the next section exists.

## How do I check if my site is blocking AI crawlers?

Two minutes. If you're even a little technical, run this and swap in each bot name:

```
curl -sS -o /dev/null -w "%{http_code}\n" -A "OAI-SearchBot/1.0" https://YOURSITE.com/
```

`200` means allowed. `403` means blocked. Run it for `GPTBot`, `ClaudeBot`, and `PerplexityBot` too. What you want: your normal browser *and* Googlebot *and* the AI crawlers all get 200. If Google gets in but the AI bots get a 403, you've got a block — and your robots.txt won't reveal it, because the block lives one layer up at the CDN.

Not technical? Send that line to whoever manages your site and ask them to run it. On Cloudflare specifically: **Overview → Control AI crawlers**, and make sure "Block AI training bots" is set to **Do not block**; then check **Security → Bots** for anything blocking AI scrapers.

## Should you block AI crawlers? Publisher vs. brand

- **If your content IS your product** — a publisher, a news site, a research shop — blocking or charging AI can make sense. Your words are the asset, and you're protecting it. This is who Cloudflare built the default for.
- **If your content is marketing FOR your product** — basically every brand — being cited by AI is free distribution at the exact moment someone is deciding what to buy. You want the Search and Agent bots wide open. Blocking them is lighting your own visibility on fire.

If you're a brand and you're nervous about AI using your content, the lever to reach for isn't the block — it's those new content signals. Set them to let AI *reference and cite* you — because getting cited is the entire point.

## Bottom line

So much of AI visibility now comes down to plumbing — the settings that decide whether AI can even see you live in DNS records and CDN dashboards, and they're easy to flip without noticing. So if you've rebuilt, migrated, or spun up a new site on Cloudflare recently, run the two-minute check above before you assume the coast is clear. Then go find out [what AI actually says about you](/blog/what-your-ai-visibility-score-cant-tell-you) once it's actually inside.

I'm Laura Seelinger, founder of LSX Partners. I help brands make sure AI can find, read, and cite them — starting with making sure the door's actually open. If you're not sure whether AI can see your site, [let's check it together](/contact). We should chat.

## Sources

- [Cloudflare, "Content Independence Day"](https://blog.cloudflare.com/content-independence-day-ai-options/) — the three bot categories, the September 15, 2026 default, and the new robots.txt content signals.
- Cloudflare market share: [W3Techs, Cloudflare usage statistics](https://w3techs.com/technologies/details/cn-cloudflare), 2026.
- Bot-access test against lsxpartners.com, July 2026.

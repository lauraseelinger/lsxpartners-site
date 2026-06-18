// Build-time date helpers. Recomputed every time the site builds/deploys, so
// forward-looking copy never goes stale. (For a long-idle site, a scheduled
// rebuild keeps it fresh — see the automation workstream.)

/**
 * Returns a near-future quarter label (e.g. "Q4 2026"), always ~4–5 months out.
 * Used for aspirational CTAs like "want your brand cited by AI by {quarter}?"
 */
export function targetQuarter(monthsOut = 4): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsOut);
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q} ${d.getFullYear()}`;
}

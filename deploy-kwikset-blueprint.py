#!/usr/bin/env python3
"""
Rebuild public/kwikset/blueprint/index.html from the working Blueprint source.

The live page is the source file plus three injected pieces (noindex + GA4,
the password gate markup, and the gate script). This script lifts those three
pieces off the currently-deployed page and re-applies them to the new source,
so the gate/password/analytics never have to be hand-maintained.

Usage:  python3 deploy-kwikset-blueprint.py
Then:   git add -A && git commit -m "..." && git push
"""
import pathlib
import shutil
import sys

SRC = pathlib.Path.home() / "Documents/lsx-claude/clients/kwikset/12_blueprint_visual.html"
OUT = pathlib.Path(__file__).parent / "public/kwikset/blueprint/index.html"

src = SRC.read_text()
live = OUT.read_text()

# --- lift the three wrapper pieces off the live page -------------------------
head_extra = live[live.index('<meta name="robots"'):live.index("</head>")]
gate_html = live[live.index('<div id="lsxgate">'):live.index('<div class="wrap">')]
gate_js = live[live.rindex('<script>(function(){var HASH='):live.rindex("</body>")]

for name, blob in (("head", head_extra), ("gate", gate_html), ("script", gate_js)):
    if not blob.strip():
        sys.exit(f"ERROR: could not lift the {name} block off the live page.")

if any(b in src for b in ("lsxgate", 'name="robots"')):
    sys.exit("ERROR: source already contains gate/noindex markup — check it by hand.")

# --- rewrite the working-file sitemap link to the hosted one -----------------
# The source still points at the old tiiny.site draft; the live page links to
# the sitemap deployed alongside it.
out = src.replace("https://lsx-kwikset-sitemap.tiiny.site/", "/kwikset/sitemap/")

# --- inject into the new source ---------------------------------------------
out = out.replace("</head>", head_extra + "</head>", 1)
out = out.replace('<body><div class="wrap">', "<body>\n" + gate_html + '<div class="wrap">', 1)
out = out.replace("</body></html>", gate_js + "</body></html>", 1)

for token in ("lsxgate", "noindex", "var HASH="):
    if token not in out:
        sys.exit(f"ERROR: injection failed — {token!r} missing from output.")

shutil.copy(OUT, OUT.with_suffix(".html.bak"))
OUT.write_text(out)
print(f"Wrote {OUT} ({len(out):,} bytes). Previous version saved as index.html.bak")
print("Gate, noindex, and GA4 verified present. Review locally, then commit + push.")

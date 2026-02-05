#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

IN_FILE="$ROOT_DIR/public/flyer-onepage.html"
OUT_FILE="$ROOT_DIR/flyer-onepage.pdf"

if [[ ! -x "$CHROME_BIN" ]]; then
  echo "Chrome not found at: $CHROME_BIN" >&2
  exit 1
fi

if [[ ! -f "$IN_FILE" ]]; then
  echo "Input HTML not found: $IN_FILE" >&2
  exit 1
fi

echo "Generating PDF..."
echo "  Input:  $IN_FILE"
echo "  Output: $OUT_FILE"

# Some Chrome versions use different flags for suppressing header/footer.
# Try the strictest set first; fall back if a flag isn't supported.
set +e
"$CHROME_BIN" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --print-to-pdf="$OUT_FILE" \
  --print-to-pdf-no-header \
  --no-pdf-header-footer \
  "file://$IN_FILE"
STATUS=$?

if [[ $STATUS -ne 0 ]]; then
  echo "Primary PDF generation flags failed (exit $STATUS). Retrying with fallback flags..." >&2
  "$CHROME_BIN" \
    --headless \
    --disable-gpu \
    --no-sandbox \
    --print-to-pdf="$OUT_FILE" \
    --print-to-pdf-no-header \
    "file://$IN_FILE"
  STATUS=$?
fi
set -e

if [[ $STATUS -ne 0 ]]; then
  echo "PDF generation failed (exit $STATUS)." >&2
  exit $STATUS
fi

echo "Done: $OUT_FILE"


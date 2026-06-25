#!/usr/bin/env bash
# Deploy build/ to Firebase Hosting (live channel), retrying the transient
# firebase-tools auth flake.
#
# Root cause this works around: FirebaseExtended/action-hosting-deploy@v0 shells
# out to firebase-tools via `npx`, which runs on the setup-node Node version.
# On Node 22/24 firebase-tools' fetch to
#   https://www.googleapis.com/oauth2/v4/token
# intermittently fails with "Premature close" / "Failed to authenticate", so the
# deploy fails roughly half the time. The env-var pins (ACTIONS_ALLOW_USE_UNSECURE
# _NODE_VERSION / FORCE_JAVASCRIPT_ACTIONS_TO_NODE24) only affect the JS-action
# RUNTIME — never the Node that actually runs `firebase deploy` — which is why
# those earlier fixes never took.
#
# A transient network flake has nothing to "fix" except retry it. The workflow
# also runs this on Node 20 (reliable for months) to keep the base flake rate
# near zero; this script is the belt-and-braces retry so a single bad attempt
# can't fail the deploy. Auths via the service account (Application Default
# Credentials), same mechanism the firestore:rules step already uses.
set -uo pipefail

: "${FIREBASE_SERVICE_ACCOUNT:?FIREBASE_SERVICE_ACCOUNT is empty}"

SA="${RUNNER_TEMP:-/tmp}/firebase-sa.json"
printf '%s' "$FIREBASE_SERVICE_ACCOUNT" > "$SA"
export GOOGLE_APPLICATION_CREDENTIALS="$SA"

MAX="${DEPLOY_MAX_ATTEMPTS:-6}"
attempt=0
while [ "$attempt" -lt "$MAX" ]; do
  attempt=$((attempt + 1))
  echo "::group::firebase deploy --only hosting (attempt ${attempt}/${MAX})"
  if npx --yes firebase-tools@13 deploy --only hosting \
       --project bridgechampions --non-interactive; then
    echo "::endgroup::"
    echo "Hosting deploy succeeded on attempt ${attempt}."
    exit 0
  fi
  echo "::endgroup::"
  if [ "$attempt" -lt "$MAX" ]; then
    echo "::warning::Hosting deploy attempt ${attempt}/${MAX} failed (transient oauth2/v4/token 'Premature close'); retrying in 15s…"
    sleep 15
  fi
done

echo "::error::Firebase Hosting deploy failed after ${MAX} attempts."
exit 1

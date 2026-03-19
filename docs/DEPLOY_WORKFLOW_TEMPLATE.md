# Deploy Workflow Template

Use this checklist every time to keep **Local**, **Git**, and **Live** aligned.

## 0) Intent
- Goal of this deploy:
- Environment: production
- Notes / risks:

## 1) Preflight (no changes)
Run:
- `git status --short`
- `git branch --show-current`
- `git log -1 --oneline`

Record:
- Branch:
- Last commit:
- Modified files:
- Untracked files:

## 2) Scope Confirmation (Checkpoint A)
- Files to include:
- Files to exclude:
- Why:

## 3) Git Backup (Checkpoint B)
Run:
- `git add <approved files>`
- `git commit -m "<message>"`
- `git push origin <branch>`

Record:
- Commit hash:
- Pushed to:

## 4) Deploy (Checkpoint C)
Run one:
- `npm run deploy`
- or `./safe-deploy.sh`

Record:
- Deploy command used:
- Deploy output URL:

## 5) Postflight Verification
Run:
- `git status --short`
- Live check: verify main asset hash and 2-3 expected feature markers

Record:
- Working tree clean? yes/no
- Live matches expected? yes/no
- If no: rollback/fix plan

## 6) Optional Tag
Run:
- `git tag -a prod-YYYYMMDD-HHMM -m "prod deploy"`
- `git push origin prod-YYYYMMDD-HHMM`

This makes rollback precise and fast.

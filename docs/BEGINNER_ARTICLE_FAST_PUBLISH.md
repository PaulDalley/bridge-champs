# Beginner article fast publish (daily workflow)

Use this to publish beginner articles quickly with consistent SEO fields and reliable formatting.

## 1) Copy the template payload

Copy:

- `docs/article-payloads/example-beginner-article.json`

to a new file, e.g.:

- `docs/article-payloads/2026-05-11-when-not-to-draw-trumps.json`

## 2) Fill your content

Update:

- `title`, `teaser`, `metaDescription`
- `articleType`, `category`, `subcategory`
- `seoSubtopic`, `primaryKeyword`
- `bodyHtml`

### Body format rules (important)

- Use semantic tags: `h2`, `h3`, `p`, `ul`, `ol`, `blockquote`, `a`.
- Use `<Callout type="rule|example|mistake|checklist">...</Callout>` for rich visual blocks.
- Avoid class wrappers in saved body HTML (`class="..."`) unless intentionally overriding with `--allow-classes`.

## 3) Publish

```bash
node scripts/publish-beginner-article.js --input "docs/article-payloads/your-file.json" --apply
```

The script will:

- Upsert by title (create if new, update if existing)
- Auto-write both `text` and `body.text` in body doc
- Set beginner defaults (`difficulty: "1"`, `isFree: true` unless overridden)
- Keep related link metadata in `relatedLinks`

## 4) Quick checks

- Open the article URL and hard refresh once (`Ctrl+F5`) if you were already on the page.
- Confirm callout boxes render and related links are clickable.
- Request indexing only for major new pages/changes.

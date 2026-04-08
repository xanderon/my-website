# Blog Authoring Guide

The blog lives inside this repo and publishes under `/blog`.

There is also a local helper page at `/blog/new` for faster authoring with:

- `Visual` mode for normal writing and toolbar actions
- `Markdown` mode for direct source editing
- drag and drop image support inside the editor
- generated Markdown output ready to save

## Content workflow

1. Create a new Markdown file in `src/content/blog/`.
2. Use a kebab-case filename. That filename becomes the URL slug.
3. Add frontmatter for the post metadata.
4. Write the body in Markdown.
5. Put any images in `public/blog-assets/<slug>/`.
6. Reference images with absolute paths such as `/blog-assets/<slug>/cover.jpg`.
7. Run `npm run dev` and preview the post locally at `/blog/<slug>`.

## Faster UI workflow

1. Start the site locally with `npm run dev`.
2. Open `/blog/new`.
3. Fill in the metadata form.
4. Write in `Visual` mode or `Markdown` mode.
5. Use the toolbar for bold, headings, lists, links, quotes, tables, and code.
6. Use `Copy Markdown` or `Download file`.
7. Save that output into `src/content/blog/<slug>.md`.
8. Put images in `public/blog-assets/<slug>/`.

This helper is intentionally local-first. It does not write files directly into the repo from the browser.

## Easiest image workflow

Inside `/blog/new`:

1. Drag an image directly into the editor, or click `Select images`.
2. The image appears immediately inside the editor for local preview.
3. The side panel shows the same image with its final asset path.
4. Use `Use as cover` if one of the uploaded images should become the post cover.
5. If your browser supports folder access, click `Save images to assets folder` and choose `public/blog-assets/<slug>/`.
6. Save the Markdown file with `Save markdown to content folder` or use the copy/download fallback.

This keeps image paths predictable and avoids manually typing image references.

## Frontmatter fields

```md
---
title: Your title
excerpt: One short summary used in cards and metadata
date: 2026-04-05
updatedDate: 2026-04-06 # optional
tags:
  - 3D Printing
  - Practical Builds
coverImage: /blog-assets/your-slug/cover.jpg # optional
coverAlt: Short alt text for the cover image # optional
draft: false # optional
featured: false # optional
---
```

## Drafts

Set `draft: true` and the post will stay out of the published listing and routes.

## Images

- Create a folder per post in `public/blog-assets/<slug>/`.
- Use `coverImage` for the main card and social preview image.
- Use normal Markdown images in the body:

```md
![Bench test of the part](/blog-assets/your-slug/test-shot.jpg)
```

- For captioned images, use HTML:

```html
<figure class="blog-figure">
  <img src="/blog-assets/your-slug/detail.jpg" alt="Detail view" />
  <figcaption>Short caption here.</figcaption>
</figure>
```

- For a simple two-image gallery:

```html
<figure class="blog-gallery">
  <div class="blog-gallery__grid">
    <img src="/blog-assets/your-slug/one.jpg" alt="First image" />
    <img src="/blog-assets/your-slug/two.jpg" alt="Second image" />
  </div>
  <figcaption>Optional gallery caption.</figcaption>
</figure>
```

## Video embeds

Markdown supports raw HTML, so you can embed a video or external demo with a plain iframe:

```html
<div style="position:relative;padding-top:56.25%;margin:2rem 0;">
  <iframe
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:1rem;"
  ></iframe>
</div>
```

## Code blocks

Standard fenced Markdown code blocks work out of the box:

```ts
console.log("hello");
```

## Local preview

```bash
npm install
npm run dev
```

Then open `http://localhost:4321/blog`.

## Post template

Use [`docs/blog-post-template.md`](./blog-post-template.md) as the starting point for a new article.

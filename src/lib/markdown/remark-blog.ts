import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

const CALLOUT_MAP = new Map([
  ["NOTE", "info"],
  ["INFO", "info"],
  ["TIP", "tip"],
  ["WARNING", "warning"],
  ["CAUTION", "warning"],
  ["DANGER", "danger"],
]);

function joinUrl(base: string, path: string) {
  const left = base.replace(/\/+$/, "");
  const right = path.replace(/^\.?\//, "");
  return `${left}/${right}`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseAttributes(input: string) {
  const attrs: Record<string, string> = {};
  for (const match of input.matchAll(/(\w+)="([^"]+)"/g)) {
    attrs[match[1]] = match[2];
  }
  return attrs;
}

function remarkBlog() {
  return (tree: any, file: any) => {
    const mediaSubpath = file.data?.astro?.frontmatter?.mediaSubpath as string | undefined;

    if (mediaSubpath) {
      visit(tree, "image", (node: any) => {
        if (!node.url) return;
        if (/^(?:[a-z]+:)?\/\//i.test(node.url) || node.url.startsWith("/")) return;
        node.url = joinUrl(mediaSubpath, node.url);
      });
    }

    visit(tree, "blockquote", (node: any) => {
      const firstParagraph = node.children?.[0];
      const firstChild = firstParagraph?.children?.[0];
      if (!firstChild || firstChild.type !== "text") return;

      const match = firstChild.value.match(/^\[!(NOTE|INFO|TIP|WARNING|CAUTION|DANGER)\]\s*(.*)$/);
      if (!match) return;

      const variant = CALLOUT_MAP.get(match[1]) ?? "info";
      firstChild.value = match[2];
      node.data = node.data || {};
      node.data.hProperties = {
        className: ["prompt", `prompt-${variant}`],
      };
    });

    visit(tree, "paragraph", (node: any) => {
      const content = toString(node).trim();
      if (!content.startsWith("{%") || !content.endsWith("%}")) return;

      const youtube = content.match(/^\{%\s*youtube\s+([A-Za-z0-9_-]+)\s*%\}$/);
      if (youtube) {
        node.type = "html";
        node.value = `<div class="embed-card"><div class="embed-frame"><iframe src="https://www.youtube.com/embed/${escapeHtml(youtube[1])}" title="YouTube embed" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>`;
        return;
      }

      const spotify = content.match(/^\{%\s*spotify\s+([A-Za-z0-9]+)\s*%\}$/);
      if (spotify) {
        node.type = "html";
        node.value = `<div class="embed-card"><iframe class="embed-spotify" src="https://open.spotify.com/embed/track/${escapeHtml(spotify[1])}?utm_source=generator&theme=0" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>`;
        return;
      }

      const video = content.match(/^\{%\s*video\s+([^\s]+)(.*)%\}$/);
      if (video) {
        const attrs = parseAttributes(video[2] ?? "");
        node.type = "html";
        node.value = `<figure class="embed-card"><video controls preload="metadata" src="${escapeHtml(video[1])}"${attrs.poster ? ` poster="${escapeHtml(attrs.poster)}"` : ""}></video>${attrs.title ? `<figcaption>${escapeHtml(attrs.title)}</figcaption>` : ""}</figure>`;
        return;
      }

      const audio = content.match(/^\{%\s*audio\s+([^\s]+)(.*)%\}$/);
      if (audio) {
        const attrs = parseAttributes(audio[2] ?? "");
        node.type = "html";
        node.value = `<figure class="embed-card embed-card--audio"><audio controls preload="metadata" src="${escapeHtml(audio[1])}"></audio>${attrs.title ? `<figcaption>${escapeHtml(attrs.title)}</figcaption>` : ""}</figure>`;
      }
    });

    for (const parent of [tree, ...(tree.children ?? [])]) {
      if (!parent?.children || !Array.isArray(parent.children)) continue;

      for (let index = 0; index < parent.children.length - 1; index += 1) {
        const current = parent.children[index];
        const next = parent.children[index + 1];

        if (current?.type !== "paragraph" || next?.type !== "paragraph") continue;
        if (current.children?.length !== 1 || current.children[0]?.type !== "image") continue;
        if (next.children?.length !== 1 || next.children[0]?.type !== "emphasis") continue;

        const image = current.children[0];
        const caption = toString(next).trim();
        const classNames = ["blog-figure"];

        const widthMatch = image.title?.match(/\bw=(\d+)\b/i);
        const heightMatch = image.title?.match(/\bh=(\d+)\b/i);
        if (image.title?.match(/\bshadow\b/i)) classNames.push("has-shadow");
        if (image.title?.match(/\bleft\b/i)) classNames.push("is-left");
        if (image.title?.match(/\bright\b/i)) classNames.push("is-right");
        if (image.title?.match(/\bnormal\b/i)) classNames.push("is-normal");
        if (image.title?.match(/\bnarrow\b/i)) classNames.push("is-narrow");
        if (image.title?.match(/\bwide\b/i)) classNames.push("is-wide");
        if (image.title?.match(/\bdark\b/i)) classNames.push("theme-dark-only");
        if (image.title?.match(/\blight\b/i)) classNames.push("theme-light-only");

        const attrs = [
          `src="${escapeHtml(image.url)}"`,
          `alt="${escapeHtml(image.alt || "")}"`,
        ];

        if (widthMatch) attrs.push(`width="${widthMatch[1]}"`);
        if (heightMatch) attrs.push(`height="${heightMatch[1]}"`);

        current.type = "html";
        current.value = `<figure class="${classNames.join(" ")}"><img ${attrs.join(" ")} /><figcaption>${escapeHtml(caption)}</figcaption></figure>`;
        parent.children.splice(index + 1, 1);
      }
    }
  };
}

export default remarkBlog;

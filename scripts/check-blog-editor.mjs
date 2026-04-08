import assert from "node:assert/strict";
import path from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.BLOG_EDITOR_URL || "http://localhost:3000";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(`${baseUrl}/blog/new`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });

  const modeTabs = await page.locator(".toastui-editor-mode-switch .tab-item").allTextContents();
  assert.deepEqual(modeTabs, ["Markdown", "WYSIWYG"]);

  const taskButtonCount = await page.locator(".toastui-editor-toolbar button.task-list").count();
  assert.equal(taskButtonCount, 0, "task list toggle should not be present");

  await page.locator('input[name="title"]').fill("Smoke test post");
  await page.locator('input[name="slug"]').fill("smoke-test-post");
  await page.locator('input[name="tags"]').fill("Testing, Editor");
  await page.locator(".toastui-editor-toolbar button.bold").click();
  await page.keyboard.type("Bold text");
  await page.keyboard.press("Enter");
  await page.locator(".toastui-editor-mode-switch .tab-item").nth(0).click();
  await page.waitForTimeout(250);
  await page.locator(".toastui-editor-mode-switch .tab-item").nth(1).click();
  await page.waitForTimeout(250);

  const filePath = path.resolve("public/favicon.svg");
  await page.locator("[data-image-input]").setInputFiles(filePath);
  await page.waitForTimeout(600);

  const livePreviewHtml = await page.locator("[data-rendered-preview]").innerHTML();
  const generatedMarkdown = await page.locator("[data-output]").inputValue();

  assert.match(livePreviewHtml, /<img[^>]+blob:/, "live preview should render uploaded images");
  assert.match(
    generatedMarkdown,
    /!\[favicon\]\(\/blog-assets\/smoke-test-post\/favicon\.svg\)/,
    "generated markdown should replace local blob URLs with final asset paths",
  );
  assert.match(generatedMarkdown, /Smoke test post/, "metadata should stay in sync");

  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const persistedTitle = await page.locator('input[name="title"]').inputValue();
  assert.equal(persistedTitle, "Smoke test post", "autosave should restore the draft title");

  console.log("Blog editor smoke test passed.");
} finally {
  await browser.close();
}

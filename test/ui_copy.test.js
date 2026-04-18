import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { UI_COPY, renderCopy } from "../ui_copy/index.js";

test("ui_copy: renderCopy replaces {key} placeholders and is stable on missing params", () => {
  assert.equal(renderCopy("录制中... ⏱️ {剩余秒数}s", { 剩余秒数: 3 }), "录制中... ⏱️ 3s");
  assert.equal(renderCopy("挑战码：{code}", {}), "挑战码：{code}");
  assert.equal(renderCopy("挑战码：{code}", null), "挑战码：{code}");
});

test("ui_copy: UI_COPY contains values from 04-界面文案.md", async () => {
  const markdown = await readFile(new URL("../04-界面文案.md", import.meta.url), "utf8");
  const leaves = collectStringLeaves(UI_COPY);
  assert.ok(leaves.length > 200);

  const extracted = new Set();
  for (const s of extractQuotedStrings(markdown)) extracted.add(s);
  for (const s of extractCodeFenceStrings(markdown)) extracted.add(s);
  for (const s of extractTableCellStrings(markdown)) extracted.add(s);

  const misses = [];
  for (const s of extracted) {
    const t = normalizeExtracted(s);
    if (!t) continue;
    if (t.length < 2) continue;
    if (t.startsWith("og:") || t.startsWith("twitter:")) continue;
    if (t === "website" || t === "summary_large_image") continue;
    if (t === "成就图标" || t === "雷达图" || t === "二维码/链接") continue;
    if (t.endsWith("：") && t.length <= 8) continue;
    if (containsAny(leaves, t)) continue;
    misses.push(t);
    if (misses.length >= 20) break;
  }

  assert.deepEqual(misses, []);
});

function collectStringLeaves(node) {
  const out = [];
  walk(node, out);
  return out;
}

function walk(value, out) {
  if (typeof value === "string") {
    out.push(value);
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walk(item, out);
    return;
  }
  for (const key of Object.keys(value)) {
    walk(value[key], out);
  }
}

function containsAny(leaves, needle) {
  for (const leaf of leaves) {
    if (leaf.includes(needle)) return true;
    const normalizedLeaf = normalizeExtracted(leaf);
    if (normalizedLeaf.includes(needle)) return true;
  }
  if (allTokensInLeaves(leaves, needle)) return true;
  return false;
}

function extractQuotedStrings(markdown) {
  const out = [];
  const re = /"([^"]+)"/g;
  let match;
  while ((match = re.exec(markdown))) {
    out.push(match[1]);
  }
  return out;
}

function extractCodeFenceStrings(markdown) {
  const out = [];
  const re = /```[\s\S]*?```/g;
  const blocks = markdown.match(re) ?? [];
  for (const block of blocks) {
    const inner = block.replace(/^```[^\n]*\n?/, "").replace(/```$/, "");
    const lines = inner.split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (line.startsWith("<meta ")) continue;
      if (line.startsWith("Step ")) continue;
      out.push(normalizeExtracted(line));
    }
  }
  return out;
}

function extractTableCellStrings(markdown) {
  const out = [];
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    if (!line.includes("|")) continue;
    const cells = line.split("|").map((c) => c.trim());
    if (cells.length < 3) continue;
    const filtered = cells.filter((c) => c.length > 0);
    if (filtered.length < 2) continue;
    const content = filtered[1];
    if (!content) continue;
    if (content.startsWith("---")) continue;
    if (
      content === "内容" ||
      content === "文案" ||
      content === "aria-label" ||
      content === "说明" ||
      content === "引导文案" ||
      content === "特殊称号"
    )
      continue;
    out.push(normalizeExtracted(stripMarkdown(content)));
  }
  return out;
}

function stripMarkdown(input) {
  return input
    .replaceAll("**", "")
    .replaceAll("`", "")
    .replaceAll("<br>", "\n")
    .replaceAll("（", "(")
    .replaceAll("）", ")")
    .trim();
}

function stripUiBrackets(input) {
  return input.replaceAll("[", "").replaceAll("]", "");
}

function normalizeExtracted(input) {
  const trimmed = stripUiBrackets(String(input)).trim();
  const unquoted =
    trimmed.startsWith("\"") && trimmed.endsWith("\"") && trimmed.length > 2 ? trimmed.slice(1, -1) : trimmed;
  return unquoted
    .replaceAll("（", "(")
    .replaceAll("）", ")")
    .replace(/^•\s*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function allTokensInLeaves(leaves, needle) {
  if (!needle.includes(" ")) return false;
  const tokens = needle
    .split(" ")
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => /[\u4e00-\u9fffA-Za-z0-9]/.test(t));
  if (tokens.length < 2 || tokens.length > 10) return false;

  for (const token of tokens) {
    let found = false;
    for (const leaf of leaves) {
      const nl = normalizeExtracted(leaf);
      if (nl.includes(token)) {
        found = true;
        break;
      }
    }
    if (!found) return false;
  }
  return true;
}

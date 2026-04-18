import http from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = process.cwd();
const PORT = Number.parseInt(process.env.PORT ?? "4173", 10);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webm": "audio/webm",
  ".wav": "audio/wav",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const normalized = decoded.replaceAll("\\", "/");
  if (normalized.includes("..")) return null;
  return normalized === "/" ? "/index.html" : normalized;
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url.startsWith("/api/")) {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "API 未启用：前端将自动使用本地判定" }));
    return;
  }

  const pathPart = safePath(req.url);
  if (!pathPart) {
    res.writeHead(400);
    res.end("Bad Request");
    return;
  }

  const filePath = join(ROOT, pathPart);
  try {
    const data = await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`Server running at http://127.0.0.1:${PORT}/\n`);
});


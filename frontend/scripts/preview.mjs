#!/usr/bin/env node
/**
 * Simple preview server for Next.js static export in out/ with basePath support.
 *
 * - Serves the exported site from the "out" directory
 * - Correctly maps requests under the basePath (e.g. /frontend/...) to files
 *   in the export folder structure, including handling of _next assets which
 *   live at out/_next even when URLs include the basePath (/frontend/_next).
 *
 * Usage:
 *   node scripts/preview.mjs [--dir out] [--port 5000] [--base /frontend]
 *
 * Environment variables:
 *   PREVIEW_DIR   (default: out)
 *   PREVIEW_PORT  (default: 5000)
 *   PREVIEW_BASE  (default: /frontend)
 */

import http from "node:http";
import { createReadStream } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Basic CLI arg parsing
const args = process.argv.slice(2);
function getArg(name, fallback) {
  const idx = args.findIndex((a) => a === name || a.startsWith(name + "="));
  if (idx === -1) return fallback;
  const token = args[idx];
  const eqIdx = token.indexOf("=");
  if (eqIdx !== -1) return token.slice(eqIdx + 1);
  const next = args[idx + 1];
  return next && !next.startsWith("--") ? next : fallback;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.resolve(
  process.cwd(),
  process.env.PREVIEW_DIR || getArg("--dir", "out"),
);
const port = Number(process.env.PREVIEW_PORT || getArg("--port", "5000"));
const basePathRaw = process.env.PREVIEW_BASE || getArg("--base", "/frontend");

// Normalize basePath to start with "/" and NOT end with "/"
const basePath = normalizeBasePath(basePathRaw);

// Basic MIME map
const mime = new Map([
  [".html", "text/html; charset=utf-8"],
  [".htm", "text/html; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".mjs", "application/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff2", "font/woff2"],
  [".woff", "font/woff"],
  [".ttf", "font/ttf"],
  [".otf", "font/otf"],
]);

function normalizeBasePath(bp) {
  if (!bp) return "";
  let v = bp.trim();
  if (!v.startsWith("/")) v = "/" + v;
  // keep no trailing slash, except root
  if (v.length > 1 && v.endsWith("/")) v = v.slice(0, -1);
  return v;
}

function extToMime(p) {
  const ext = path.extname(p).toLowerCase();
  return mime.get(ext) || "application/octet-stream";
}

async function fileExists(p) {
  try {
    const st = await fs.stat(p);
    return st.isFile();
  } catch {
    return false;
  }
}

async function dirExists(p) {
  try {
    const st = await fs.stat(p);
    return st.isDirectory();
  } catch {
    return false;
  }
}

function safeJoin(root, rel) {
  // Prevent path traversal by normalizing and ensuring root containment
  const cleanRel = rel.replace(/^[/\\]+/, ""); // strip leading slashes
  const target = path.normalize(path.join(root, cleanRel));
  if (!target.startsWith(root)) return null;
  return target;
}

function decodePathname(urlPath) {
  try {
    return decodeURIComponent(urlPath);
  } catch {
    return urlPath;
  }
}

function redirect(res, to, code = 302) {
  res.statusCode = code;
  res.setHeader("Location", to);
  res.end(`Redirecting to ${to}`);
}

async function serveFile(res, fsPath) {
  const type = extToMime(fsPath);
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  // Avoid caching during preview
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  createReadStream(fsPath).pipe(res);
}

async function tryServeIndex(res, dirPath) {
  const indexPath = path.join(dirPath, "index.html");
  if (await fileExists(indexPath)) {
    return serveFile(res, indexPath);
  }
  return false;
}

async function handleRequest(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  let pathname = decodePathname(url.pathname);

  // Root redirect to basePath/
  if (pathname === "/" || pathname === "") {
    return redirect(res, `${basePath}/`);
  }

  // Normalize trailing slash for directories at the basePath root
  if (pathname === basePath) {
    return redirect(res, `${basePath}/`);
  }

  // Candidates in order:
  // 1. Direct mapping from out/ (absolute path in export)
  // 2. If starts with basePath: map to out/<basePath>/... (as emitted by export)
  // 3. If starts with basePath: map to out/<strip basePath>/... (handles assets like _next and public/)
  const candidates = [];

  // (1) Direct mapping
  candidates.push(pathname);

  // (2) Under basePath folder
  if (basePath && pathname.startsWith(basePath + "/")) {
    candidates.push(pathname.slice(1)); // keep leading part so it looks like frontend/... rooted in out/
  }

  // (3) Strip basePath and try from export root
  if (basePath && pathname.startsWith(basePath + "/")) {
    const stripped = pathname.slice(basePath.length); // starts with "/..."
    candidates.push(stripped);
  }

  // Resolve and serve the first existing match
  for (const cand of candidates) {
    // Directory handling: if ends with "/", try index.html
    if (cand.endsWith("/")) {
      const dirPath = safeJoin(outDir, cand);
      if (dirPath && (await dirExists(dirPath))) {
        const served = await tryServeIndex(res, dirPath);
        if (served !== false) return;
      }
      continue;
    }

    // Try as file
    const fsPath = safeJoin(outDir, cand);
    if (fsPath && (await fileExists(fsPath))) {
      return serveFile(res, fsPath);
    }

    // If not file, but directory exists, try its index.html
    if (fsPath && (await dirExists(fsPath))) {
      const served = await tryServeIndex(res, fsPath);
      if (served !== false) return;
    }
  }

  // If requesting a directory-like URL without trailing slash under basePath, redirect to slash
  if (basePath && pathname.startsWith(basePath + "/") && !path.extname(pathname)) {
    // Attempt to see if directory exists by checking with trailing slash
    const maybeDir = pathname + "/";
    const dirPathA = safeJoin(outDir, maybeDir);
    const dirPathB =
      basePath && pathname.startsWith(basePath + "/")
        ? safeJoin(outDir, maybeDir.slice(1)) // frontend/...
        : null;
    if ((dirPathA && (await dirExists(dirPathA))) || (dirPathB && (await dirExists(dirPathB)))) {
      return redirect(res, maybeDir + (url.search || ""), 301);
    }
  }

  // 404
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end("Not Found");
}

const server = http.createServer((req, res) => {
  // Basic logging
  const start = Date.now();
  handleRequest(req, res).finally(() => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.url;
    // eslint-disable-next-line no-console
    console.log(`${new Date().toISOString()} ${method} ${url} -> ${status} ${ms}ms`);
  });
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Preview server running on http://localhost:${port}${basePath}/ (serving ${outDir})`,
  );
});

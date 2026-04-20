'use strict';
const path = require('path');
const fs = require('fs');
const { createRequire } = require('module');

// Next standalone output (next.config.js: output: 'standalone', distDir: 'build/_next')
const standaloneDir = path.join(__dirname, 'build', '_next', 'standalone');
const requireStandalone = createRequire(
  path.join(standaloneDir, 'package.json'),
);

process.env.NODE_ENV = 'production';

// Mirror what standalone/server.js does: set __NEXT_PRIVATE_STANDALONE_CONFIG so that
// all Next internals (including the router-server worker / filesystem.js setupFsCheck)
// load the correct distDir and config rather than falling back to the '.next' default.
(function setStandaloneConfig() {
  const serverJs = fs.readFileSync(
    path.join(standaloneDir, 'server.js'),
    'utf8',
  );
  const PREFIX = 'const nextConfig = ';
  const SUFFIX = '\n\nprocess.env.__NEXT_PRIVATE_STANDALONE_CONFIG';
  const start = serverJs.indexOf(PREFIX) + PREFIX.length;
  const end = serverJs.indexOf(SUFFIX);
  if (start > PREFIX.length - 1 && end > start) {
    // Override compress: withSentryConfig does not forward the compress key from
    // next.config.js so the embedded config always has compress:true.  Gzip bodies
    // through API Gateway → NS_ERROR_CORRUPTED_CONTENT; CloudFront compresses at the edge.
    const config = JSON.parse(serverJs.slice(start, end));
    config.compress = false;
    process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(config);
  } else {
    console.error(
      '[lambda] WARNING: could not extract nextConfig from server.js',
    );
  }
})();

process.chdir(standaloneDir);

// ─── static asset serving ─────────────────────────────────────────────────────
//
// /_next/static/** files are served directly from the Lambda filesystem.
// Routing them through Next.js + serverless-http loses the Content-Type header set
// by Next's internal file server, causing every asset to arrive as text/plain
// (NS_ERROR_CORRUPTED_CONTENT / MIME mismatch).  Reading the file and returning an
// explicit Content-Type is reliable and adds no latency for a cold Lambda.
//
// Static files live at distDir/static (build/_next/static/) — Next standalone output
// intentionally omits them; they are packaged separately via serverless.yml patterns.

const CONTENT_TYPES = {
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
};

const BINARY_EXTS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
  '.eot',
]);

const staticDir = path.join(__dirname, 'build', '_next', 'static');
const publicDir = path.join(__dirname, 'public');

/**
 * Resolve a path under rootDir and return an absolute path only if it stays inside
 * rootDir (no path traversal). Satisfies static analysis for fs.readFileSync.
 *
 * @param {string} rootDir
 * @param {string} unsafeRelativePath URL segment(s) after the mount, may include subdirs
 * @returns {string | null}
 */
function resolvePathWithinRoot(rootDir, unsafeRelativePath) {
  const normalizedRoot = path.resolve(rootDir);
  const resolved = path.resolve(normalizedRoot, unsafeRelativePath);
  const rel = path.relative(normalizedRoot, resolved);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    return null;
  }
  return resolved;
}

/**
 * API Gateway + CloudFront (OriginPath: /{stage}) send paths like
 * /development/_next/static/... while files on disk live under /_next/static/...
 * Strip the stage segment so static serving and Next see app-root paths.
 */
function normalizeRequestPath(event) {
  let p = event.path || '/';
  const stage = event.requestContext && event.requestContext.stage;
  if (stage && typeof p === 'string' && p.startsWith(`/${stage}/`)) {
    p = p.slice(`/${stage}`.length) || '/';
  }
  return p;
}

/**
 * @param {string} file Absolute path already constrained by resolvePathWithinRoot
 */
function serveFile(file) {
  let content;
  try {
    content = fs.readFileSync(file);
  } catch {
    return null; // not found — fall through to Next.js
  }
  const ext = path.extname(file).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
  const binary = BINARY_EXTS.has(ext);
  return {
    statusCode: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
    body: binary ? content.toString('base64') : content.toString('utf8'),
    isBase64Encoded: binary,
  };
}

function serveNextStatic(reqPath) {
  if (!reqPath || !reqPath.startsWith('/_next/static/')) return null;
  let rel = reqPath.slice('/_next/static/'.length);
  if (rel.includes('..')) return null; // path traversal guard
  try {
    rel = decodeURIComponent(rel);
  } catch {
    /* use raw segment */
  }
  const filePath = resolvePathWithinRoot(staticDir, rel);
  if (!filePath) return null;
  return serveFile(filePath);
}

function servePublic(reqPath) {
  if (!reqPath || reqPath.startsWith('/_next/')) return null;
  if (reqPath.includes('..')) return null; // path traversal guard
  let safePath = reqPath;
  try {
    safePath = decodeURIComponent(reqPath);
  } catch {
    /* use raw */
  }
  const relPublic = safePath.replace(/^\//, '');
  const filePath = resolvePathWithinRoot(publicDir, relPublic);
  if (!filePath) return null;
  return serveFile(filePath);
}

// ─── dynamic handler ──────────────────────────────────────────────────────────

const next = requireStandalone('next');
const serverlessHttp = requireStandalone('serverless-http');

const app = next({ dev: false, dir: standaloneDir });
let handler;

module.exports.handler = async (event, context) => {
  const reqPath = normalizeRequestPath(event);
  const staticRes = serveNextStatic(reqPath) || servePublic(reqPath);
  if (staticRes) return staticRes;

  if (!handler) {
    await app.prepare();
    const requestHandler = app.getRequestHandler();
    handler = serverlessHttp((req, res) => requestHandler(req, res));
  }
  const forwardEvent =
    reqPath === (event.path || '') ? event : { ...event, path: reqPath };
  return handler(forwardEvent, context);
};

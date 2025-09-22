#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
function safe(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function listSwcBins(base) {
  const found = [];
  if (!safe(base)) {
    return found;
  }
  const entries = fs.readdirSync(base);
  for (const e of entries) {
    const full = path.join(base, e);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      if (e.includes('swc')) {
        found.push(full);
      }
      // shallow scan
      try {
        for (const f of fs.readdirSync(full)) {
          if (f.includes('swc') || f.endsWith('.node')) {
            found.push(path.join(full, f));
          }
        }
      } catch {
        // ignore
      }
    } else if (e.includes('swc') || e.endsWith('.node')) {
      found.push(full);
    }
  }
  return found;
}
const summary={};
try {
  const nextPkg = require.resolve('next/package.json');
  summary.nextPackageJson = nextPkg;
  summary.nextVersion = JSON.parse(fs.readFileSync(nextPkg,'utf8')).version;
} catch (e) {
  summary.nextResolveError = String(e);
}
summary.projectRoot = process.cwd();
summary.nodeVersion = process.version;
summary.envNodeLinker = process.env.npm_config_node_linker;
const nmLocal = path.join(process.cwd(),'node_modules');
summary.localSwcCandidates = listSwcBins(nmLocal);
// Potential global cache on Windows
const localAppData = process.env.LOCALAPPDATA;
if (localAppData) {
  const swcCache = path.join(localAppData, 'next-swc');
  if (safe(swcCache)) {
    summary.nextSwcCacheEntries = fs.readdirSync(swcCache).slice(0, 50);
  }
}
console.log(JSON.stringify(summary,null,2));

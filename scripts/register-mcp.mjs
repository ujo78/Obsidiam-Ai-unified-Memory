#!/usr/bin/env node
// register-mcp.mjs — wire the Obsidian (Local REST API built-in MCP) server into every MCP-capable agent.
//
// Prereq: in Obsidian, install + enable the "Local REST API" community plugin, copy its API key,
// and enable the non-encrypted HTTP server (Settings → Local REST API).
//
// Usage:
//   node register-mcp.mjs --key <API_KEY>            # write per-agent config snippets + print Claude command
//   node register-mcp.mjs --key <API_KEY> --apply    # ALSO merge into each agent's live MCP config (backs up first)
//   node register-mcp.mjs --key <API_KEY> --https    # use the TLS endpoint (:27124) instead of HTTP (:27123)
//
// Claude Code is registered via the `claude mcp add` command this script prints (run it in your terminal).

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const HTTPS = args.includes('--https');
let key = process.env.OBSIDIAN_API_KEY || null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--key') key = args[i + 1];
  else if (args[i].startsWith('--key=')) key = args[i].slice('--key='.length);
}
if (!key) { console.error('ERROR: provide the plugin API key with --key <API_KEY> (or OBSIDIAN_API_KEY env).'); process.exit(1); }

const URL = HTTPS ? 'https://127.0.0.1:27124/mcp/' : 'http://127.0.0.1:27123/mcp/';
const AUTH = `Bearer ${key}`;

// Per-agent server entry shapes (the URL key differs by client).
const agents = [
  { name: 'cursor',      file: path.join(HOME, '.cursor', 'mcp.json'),                          entry: { url: URL, headers: { Authorization: AUTH } } },
  { name: 'windsurf',    file: path.join(HOME, '.codeium', 'windsurf', 'mcp_config.json'),       entry: { serverUrl: URL, headers: { Authorization: AUTH } } },
  { name: 'gemini-cli',  file: path.join(HOME, '.gemini', 'settings.json'),                      entry: { httpUrl: URL, headers: { Authorization: AUTH } } },
  { name: 'antigravity', file: path.join(HOME, '.gemini', 'antigravity', 'mcp_config.json'),     entry: { httpUrl: URL, headers: { Authorization: AUTH } } },
  // OpenCode uses a different schema: servers live under "mcp" (not "mcpServers") with a "type" discriminator.
  { name: 'opencode',    file: path.join(HOME, '.config', 'opencode', 'opencode.jsonc'),         entry: { type: 'remote', url: URL, enabled: true, headers: { Authorization: AUTH } }, schema: 'opencode' },
];

const snippetsDir = path.join(SCRIPT_DIR, 'mcp-snippets');
fs.mkdirSync(snippetsDir, { recursive: true });

function mergeInto(file, entry, schema) {
  let json = {};
  if (fs.existsSync(file)) {
    try { json = JSON.parse(fs.readFileSync(file, 'utf8')); }   // note: assumes JSONC with no comments
    catch { console.warn(`  ! ${file} is not valid JSON — skipping merge (snippet written instead).`); return false; }
    fs.copyFileSync(file, file + '.bak');  // backup before touching
  }
  if (schema === 'opencode') {            // OpenCode: { "mcp": { "<name>": { type:"remote", ... } } }
    json.mcp = json.mcp || {};
    json.mcp.obsidian = entry;
  } else {                                // Standard: { "mcpServers": { "<name>": { ... } } }
    json.mcpServers = json.mcpServers || {};
    json.mcpServers.obsidian = entry;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n', 'utf8');
  return true;
}

console.log(`Obsidian MCP endpoint: ${URL}\n`);

// 1) Claude Code — print the official command (most reliable path)
console.log('Claude Code — run this in your terminal:');
console.log(`  claude mcp add -s user --transport http obsidian ${URL} --header "Authorization: ${AUTH}"\n`);

// 2) Other agents — write snippets, optionally apply
for (const a of agents) {
  const snippet = a.schema === 'opencode' ? { mcp: { obsidian: a.entry } } : { mcpServers: { obsidian: a.entry } };
  const snipPath = path.join(snippetsDir, `${a.name}.json`);
  fs.writeFileSync(snipPath, JSON.stringify(snippet, null, 2) + '\n', 'utf8');
  if (APPLY) {
    const ok = mergeInto(a.file, a.entry, a.schema);
    console.log(`${a.name}: ${ok ? 'merged into ' + a.file + (fs.existsSync(a.file + '.bak') ? '  (backup .bak written)' : '') : 'snippet at ' + snipPath}`);
  } else {
    console.log(`${a.name}: snippet -> ${snipPath}   (target config: ${a.file})`);
  }
}

console.log(`\n${APPLY ? 'Applied.' : 'Snippets written (re-run with --apply to merge into live configs).'} Obsidian must be running for the MCP server to respond.`);
console.log('Note: server URL-key names vary by client version (url / serverUrl / httpUrl) — verify each agent picks it up.');

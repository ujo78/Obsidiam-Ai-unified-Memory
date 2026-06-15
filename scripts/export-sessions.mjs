#!/usr/bin/env node
// export-sessions.mjs — render Claude Code session transcripts (.jsonl) into readable Obsidian
// notes under <vault>/sessions/<project>/. Re-runnable & idempotent (skips up-to-date notes).
//
//   node export-sessions.mjs            # export all projects' sessions
//   node export-sessions.mjs --force    # re-render even if up to date
//
// Note: transcripts can contain secrets (keys, ids). The vault is local; treat it accordingly.

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const VAULT = path.resolve(SCRIPT_DIR, '..');
const HOME = os.homedir();
const PROJECTS = path.join(HOME, '.claude', 'projects');
const OUT_ROOT = path.join(VAULT, 'sessions');
const FORCE = process.argv.includes('--force');

const MAX_TEXT = 8000;       // cap per text/thinking block
const MAX_TOOL_IN = 600;     // cap per tool_use input summary
const MAX_TOOL_OUT = 800;    // cap per tool_result

function clip(s, n) { s = String(s ?? ''); return s.length > n ? s.slice(0, n) + ` …[+${s.length - n} chars]` : s; }
function esc(s) { return String(s ?? '').replace(/\r/g, ''); }
function fmtDate(ts) { if (!ts) return ''; return ts.replace('T', ' ').replace(/:\d\d\.\d+Z$/, '').replace(/Z$/, ''); }
// Local-command / slash-command wrapper messages are harness noise, not real conversation.
function isNoise(s) { return /^\s*<(local-command-(caveat|stdout|stderr)|command-(name|message|args)|bash-(input|stdout|stderr))[ >]/.test(String(s || '')); }

function summarizeToolInput(input) {
  if (input == null) return '';
  if (typeof input === 'string') return clip(input, MAX_TOOL_IN);
  for (const k of ['command', 'file_path', 'path', 'pattern', 'query', 'url', 'prompt', 'description', 'old_string']) {
    if (input[k]) return `${k}: ${clip(typeof input[k] === 'string' ? input[k] : JSON.stringify(input[k]), MAX_TOOL_IN)}`;
  }
  return clip(JSON.stringify(input), MAX_TOOL_IN);
}

function toolResultText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) return content.map(b => (b && b.type === 'text') ? b.text : '').filter(Boolean).join('\n');
  return '';
}

function renderSession(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean);
  const out = [];
  let meta = { sessionId: '', cwd: '', gitBranch: '', version: '', firstTs: '', lastTs: '', summary: '' };
  let userTurns = 0, asstTurns = 0;

  for (const line of lines) {
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.timestamp) { if (!meta.firstTs) meta.firstTs = o.timestamp; meta.lastTs = o.timestamp; }
    if (o.sessionId) meta.sessionId = o.sessionId;
    if (o.cwd) meta.cwd = o.cwd;
    if (o.gitBranch) meta.gitBranch = o.gitBranch;
    if (o.version) meta.version = o.version;
    if (o.type === 'summary' && o.summary) { meta.summary = o.summary; continue; }

    if (o.type === 'user' && o.message) {
      const c = o.message.content;
      if (typeof c === 'string') {
        if (!c.trim() || isNoise(c)) continue;
        userTurns++;
        out.push(`\n## 🧑 User\n\n${esc(clip(c, MAX_TEXT))}\n`);
      } else if (Array.isArray(c)) {
        for (const b of c) {
          if (b.type === 'tool_result') {
            const txt = toolResultText(b.content);
            const head = b.is_error ? '❌ tool result (error)' : '✅ tool result';
            out.push(`> [!quote]- ${head}\n> ${esc(clip(txt, MAX_TOOL_OUT)).replace(/\n/g, '\n> ')}\n`);
          } else if (b.type === 'text' && b.text && b.text.trim() && !isNoise(b.text)) {
            userTurns++;
            out.push(`\n## 🧑 User\n\n${esc(clip(b.text, MAX_TEXT))}\n`);
          }
        }
      }
    } else if (o.type === 'assistant' && o.message && Array.isArray(o.message.content)) {
      for (const b of o.message.content) {
        if (b.type === 'text' && b.text && b.text.trim()) {
          asstTurns++;
          out.push(`\n## 🤖 Claude\n\n${esc(clip(b.text, MAX_TEXT))}\n`);
        } else if (b.type === 'thinking' && b.thinking && b.thinking.trim()) {
          out.push(`> [!note]- 💭 Thinking\n> ${esc(clip(b.thinking, MAX_TEXT)).replace(/\n/g, '\n> ')}\n`);
        } else if (b.type === 'tool_use') {
          out.push(`> 🔧 **${b.name}** — ${esc(summarizeToolInput(b.input)).replace(/\n/g, ' ')}\n`);
        }
      }
    }
  }

  const title = meta.summary || `Session ${meta.sessionId.slice(0, 8)}`;
  const fm = [
    '---',
    `title: ${JSON.stringify(title)}`,
    'type: claude-session',
    `project: ${JSON.stringify(path.basename(meta.cwd || ''))}`,
    `session_id: ${meta.sessionId}`,
    `date: ${fmtDate(meta.firstTs)}`,
    `last_active: ${fmtDate(meta.lastTs)}`,
    `user_turns: ${userTurns}`,
    `assistant_turns: ${asstTurns}`,
    `cwd: ${JSON.stringify(meta.cwd)}`,
    `git_branch: ${JSON.stringify(meta.gitBranch)}`,
    `claude_version: ${meta.version}`,
    `source: ${JSON.stringify(file)}`,
    '---',
    '',
    `# ${title}`,
    '',
    `> Project: **${path.basename(meta.cwd || '')}** · ${fmtDate(meta.firstTs)} → ${fmtDate(meta.lastTs)} · ${userTurns} user / ${asstTurns} assistant turns`,
    '> _Auto-exported from Claude Code transcript by export-sessions.mjs — read-only view._',
  ];
  return { md: fm.join('\n') + '\n' + out.join('\n') + '\n', meta, title, userTurns, asstTurns };
}

// ---- run ----
if (!fs.existsSync(PROJECTS)) { console.error('No ~/.claude/projects found.'); process.exit(1); }
fs.mkdirSync(OUT_ROOT, { recursive: true });

const indexByProject = {};
let exported = 0, skipped = 0;

for (const slug of fs.readdirSync(PROJECTS)) {
  const dir = path.join(PROJECTS, slug);
  let files;
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')); } catch { continue; }
  for (const jf of files) {
    const src = path.join(dir, jf);
    const short = jf.replace(/\.jsonl$/, '').slice(0, 8);
    // Peek first event for cwd/date to name the file
    const { md, meta, title, userTurns, asstTurns } = renderSession(src);
    const proj = path.basename(meta.cwd || '') || slug;
    const datePart = (fmtDate(meta.firstTs).slice(0, 10)) || 'undated';
    const outDir = path.join(OUT_ROOT, proj);
    const outFile = path.join(outDir, `${datePart}-${short}.md`);

    if (!FORCE && fs.existsSync(outFile) && fs.statSync(outFile).mtimeMs >= fs.statSync(src).mtimeMs) {
      skipped++;
    } else {
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outFile, md, 'utf8');
      exported++;
    }
    (indexByProject[proj] ||= []).push({ rel: path.relative(OUT_ROOT, outFile).split(path.sep).join('/'), title, date: fmtDate(meta.firstTs), userTurns, asstTurns });
  }
}

// Index note
const idx = ['---', 'title: Sessions Index', 'type: index', '---', '', '# 🗂️ Claude Sessions', '',
  'Readable exports of Claude Code chat transcripts. Re-run `scripts/export-sessions.mjs` to refresh.', ''];
for (const proj of Object.keys(indexByProject).sort()) {
  idx.push(`## ${proj}`, '');
  for (const s of indexByProject[proj].sort((a, b) => (b.date || '').localeCompare(a.date || ''))) {
    idx.push(`- [[${s.rel.replace(/\.md$/, '')}|${s.date} — ${s.title}]] · ${s.userTurns}🧑/${s.asstTurns}🤖`);
  }
  idx.push('');
}
fs.writeFileSync(path.join(OUT_ROOT, 'INDEX.md'), idx.join('\n') + '\n', 'utf8');

console.log(`Sessions exported: ${exported}, skipped (up-to-date): ${skipped}`);
console.log(`Index: ${path.join(OUT_ROOT, 'INDEX.md')}`);

import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import OpenAI from "openai";

import type { RabbiLevel } from "@/lib/rabbi-types";

let systemPromptCache: string | null = null;

/** Next.js `process.cwd()` is usually `web/` in this repo. */
export function getWebRoot(): string {
  return process.cwd();
}

/**
 * Monorepo root (parent of `web/`). Used to find `scripts/query_lightrag.py`.
 */
export function getHebrewRepoRoot(): string {
  if (process.env.RABBI_REPO_ROOT) {
    return process.env.RABBI_REPO_ROOT;
  }
  const cwd = process.cwd();
  if (basename(cwd) === "web") {
    return join(cwd, "..");
  }
  return cwd;
}

export function loadRabbiSystemPrompt(webRoot: string): string {
  if (systemPromptCache) {
    return systemPromptCache;
  }
  const promptPath = join(webRoot, "prompts", "ask-the-rabbi-word-card-system.md");
  let raw = readFileSync(promptPath, "utf8");
  raw = raw.replace(/^<!--[\s\S]*?-->\s*/, "");
  systemPromptCache = raw.trim();
  return systemPromptCache;
}

export function buildRabbiUserMessage(input: {
  targetHe: string;
  level: RabbiLevel;
  translit?: string;
  meaningEn?: string;
  ragContext: string;
}): string {
  let u = `**Learner level:** ${input.level}\n\n**Target Hebrew / phrase:** ${input.targetHe}\n\n`;
  if (input.translit) {
    u += `**Transliteration:** ${input.translit}\n\n`;
  }
  if (input.meaningEn) {
    u += `**English gloss (from card):** ${input.meaningEn}\n\n`;
  }
  u += "**LightRAG-retrieved context:**\n\n";
  u +=
    input.ragContext.trim() ||
    "Context unavailable (no retrieval results or retrieval disabled).";
  return u;
}

export type LightragScriptResult = {
  ok: boolean;
  context: string;
  error?: string;
};

async function runLightragRemoteRetrieve(query: string): Promise<LightragScriptResult | null> {
  const base = process.env.RABBI_LIGHTRAG_RETRIEVE_URL?.trim();
  if (!base) {
    return null;
  }
  const url = `${base.replace(/\/$/, "")}/retrieve`;
  const secret = process.env.RABBI_LIGHTRAG_RETRIEVE_SECRET?.trim();
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 55_000);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (secret) {
    headers["X-Lightrag-Retrieve-Secret"] = secret;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
      signal: ac.signal,
    });
    const text = await res.text();
    let j: unknown;
    try {
      j = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return {
        ok: false,
        context: "",
        error: res.ok ? "lightrag_remote_invalid_json" : `lightrag_remote_${res.status}`,
      };
    }
    const obj = j as { ok?: boolean; context?: string; error?: string };
    if (res.status === 401) {
      return { ok: false, context: "", error: "lightrag_remote_unauthorized" };
    }
    if (obj.ok && typeof obj.context === "string" && obj.context.trim()) {
      return { ok: true, context: obj.context, error: obj.error };
    }
    return {
      ok: false,
      context: typeof obj.context === "string" ? obj.context : "",
      error:
        obj.error ||
        (res.ok ? "empty_context" : `lightrag_remote_${res.status}`),
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      context: "",
      error: msg.includes("abort") ? "lightrag_remote_timeout" : `lightrag_remote_${msg}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Resolves LightRAG context: remote HTTP (`RABBI_LIGHTRAG_RETRIEVE_URL`) when set,
 * else local `scripts/query_lightrag.py` when repo layout and store exist.
 * Disabled when `RABBI_USE_LIGHTRAG=0`.
 */
export async function runLightragRetrieval(query: string): Promise<LightragScriptResult> {
  if (process.env.RABBI_USE_LIGHTRAG === "0") {
    return { ok: false, context: "", error: "disabled" };
  }
  const remote = await runLightragRemoteRetrieve(query);
  if (remote !== null) {
    return remote;
  }
  return runLightragQueryScript(query);
}

/**
 * Local subprocess only (Vercel skips: no script/store). Prefer `runLightragRetrieval`.
 */
export function runLightragQueryScript(query: string): Promise<LightragScriptResult> {
  if (process.env.RABBI_USE_LIGHTRAG === "0") {
    return Promise.resolve({ ok: false, context: "", error: "disabled" });
  }

  const repoRoot = getHebrewRepoRoot();
  const script = join(repoRoot, "scripts", "query_lightrag.py");
  const store = join(repoRoot, "knowledge_store");

  if (!existsSync(script) || !existsSync(store)) {
    return Promise.resolve({ ok: false, context: "", error: "missing_script_or_store" });
  }

  const python = process.env.PYTHON_EXE || "py";
  const args = ["-3.12", script, "--json", "--query", query];

  return new Promise((resolve) => {
    const child = spawn(python, args, {
      cwd: repoRoot,
      env: { ...process.env },
      windowsHide: true,
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      resolve({ ok: false, context: "", error: "lightrag_timeout" });
    }, 55_000);

    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ ok: false, context: "", error: err.message });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      try {
        const j = JSON.parse(stdout) as {
          ok?: boolean;
          context?: string;
          error?: string;
        };
        if (j.ok && typeof j.context === "string" && j.context.trim()) {
          resolve({ ok: true, context: j.context, error: j.error });
          return;
        }
        resolve({
          ok: false,
          context: typeof j.context === "string" ? j.context : "",
          error:
            j.error ||
            stderr.trim() ||
            (code !== 0 ? `lightrag_exit_${code}` : "empty_context"),
        });
      } catch {
        resolve({
          ok: false,
          context: "",
          error:
            stderr.trim() ||
            (code !== 0 ? `lightrag_exit_${code}` : "lightrag_invalid_json"),
        });
      }
    });
  });
}

/**
 * Models often glue English and Hebrew without an ASCII space (e.g. "ofשלוםis").
 * Insert U+0020 between abutting Latin letters/digits and Hebrew script letters.
 */
export function normalizeMixedHebrewLatinSpacing(markdown: string): string {
  const H = "\\p{Script=Hebrew}";
  const L = "[0-9A-Za-z]";
  return markdown
    .replace(new RegExp(`(${L})(?=${H})`, "gu"), "$1 ")
    .replace(new RegExp(`(${H})(?=${L})`, "gu"), "$1 ")
    .replace(new RegExp(`\\)(?=${H})`, "gu"), ") ")
    .replace(new RegExp(`(${H})(?=\\()`, "gu"), "$1 ")
    .replace(new RegExp(`:(?=${H})`, "gu"), ": ");
}

export async function generateRabbiMarkdown(input: {
  system: string;
  user: string;
}): Promise<string> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const client = new OpenAI({ apiKey: key });
  const model = process.env.OPENAI_RABBI_MODEL ?? "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: input.system },
      { role: "user", content: input.user },
    ],
    temperature: 0.35,
    max_tokens: 4096,
  });

  const text = completion.choices[0]?.message?.content;
  if (!text?.trim()) {
    throw new Error("Empty model response");
  }
  return normalizeMixedHebrewLatinSpacing(text.trim());
}

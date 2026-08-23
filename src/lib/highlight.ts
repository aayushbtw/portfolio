import { createHighlighter } from "@tanstack/highlight/core";
import { shell } from "@tanstack/highlight/languages/shell";

/**
 * One registry for both sides. A server and a client registry that differ
 * normalize languages differently, so the same command would tokenize one way
 * in the SSR markup and another way after hydration.
 *
 * `shell` already answers to bash, sh, zsh, cmd and console. Register another
 * only once something on the site needs it: each adds a tokenizer to both
 * bundles. Built once, because `createHighlighter` compiles a registry.
 */
export const highlighter = createHighlighter({ languages: [shell] });

export const SHELL_LANG = "shell";

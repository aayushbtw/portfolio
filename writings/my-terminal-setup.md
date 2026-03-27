---
title: My Terminal Setup
description: The tools I use every day in the terminal and why I switched to them.
publishedAt: 2026-03-27
---

The macOS defaults are fine until you've used something better. Over time I've swapped out a handful of them for tools that are faster or just less annoying to use.

You can find my config files [here](https://github.com/aayushbtw/dotfiles).

## Ghostty

I tried a lot of terminals before landing on Ghostty. iTerm2 felt bloated, Alacritty was fine but too minimal, Warp kept trying to be something I didn't ask for. Ghostty hits the right balance. It's native, fast, and the config is just a plain text file. No GUI settings, no JSON, just `key = value`. It's been my daily driver since the beta.

## Homebrew

The package manager for macOS. Everything else here came through it. If you're on a Mac and not using Homebrew, you're installing things the hard way.

## Starship

Prompt configuration has a way of becoming its own project. Starship avoids that. I set it up once with the things I actually need (current directory, git branch, command duration) and haven't touched it since.

## fnm

Replaced `nvm` with this. `nvm` was slow to init and kept breaking whenever I updated Node. fnm does the same job without the baggage.

## eza

I have it aliased to `ls` so the switch is invisible. You only really notice it when you're on a machine that doesn't have it and plain `ls` output looks like it's from 1989.

## zoxide

Smarter `cd`. I type part of a directory name and it figures out where I mean. Took about a day to get used to it, and now typing out a full path feels like a punishment.

## bat

`cat` with syntax highlighting. Aliased to `cat`. It also shows git diff markers in the gutter, which is useful more often than you'd expect. I've had it installed for so long I forget it's not the default.

## fd

`find` but I can actually remember how to use it. With `find` I was Googling the syntax every time. With `fd` I just type what I want. It also respects `.gitignore` by default, so searching a project doesn't mean wading through `node_modules`.

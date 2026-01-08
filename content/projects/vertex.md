---
title: Vertex
description: A fast Obsidian-Flavored Markdown Editor for workspaces and single-files.
date: 2025-07-25
image: /projects/vertex/vertexmarkdowneditor-example.png
progress: alpha
repository:
  repoUsername: CTRL-Neo-Studios
  repoName: vertex
  showIssues: true
  showWiki: true
tags:
  - markdown
  - markdown editor
  - vertex
  - ofm
  - obsidian
  - obsidian alternative
icon: i-tabler-markdown
---

![vertexmarkdowneditor-example](/projects/vertex/vertexmarkdowneditor-example.png)

::callout{color="warning" icon="i-lucide-triangle-alert"}
This software is currently in Alpha. Please, **DO NOT IN ANY CASE**, use it in your production-ready markdown projects. We will not be responsible for any loss of your data during the usage of **Vertex**'s *Alpha* version and we do not encourage you use it now.

**However**, you can build the software yourself and/or run it locally to test it on your smaller projects.
::

**Vertex** is an [Obsidian-Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown) Editor that uses our own implementation of Rich-Text Markdown Editor based off of CodeMirror 6 and heavily inspired by [Obsidian](obsidian). Other tech stacks used are [Nuxt v4](nuxt.com) + [Nuxt UI v4](ui.nuxt.com) + [Tauri v2](tauri.app).

## Why, and for what?

### First Attempt

This project originally started with me (@Type-32) trying to make a Rich-Text Markdown Editor that is \[Obsidian-Flavored Markdown]\(<<<https://help.obsidian.md/obsidian-flavored-markdown&#x29&#x3E&#x3E&#x3E;;;;; compatible. The attempt started originally with **[Slate](https://github.com/CTRL-Neo-Studios/Slate)**, a local-first markdown editor made using the [Tiptap Editor](tiptap.dev). Slowly in time, the complexity of \*\*\*\* Slate grew and went into a completely different direction compared to the original intent of development, and naturally, it was slowly deprecated and I eventually ceased its development as other ongoing projects also required my attention.

However, that project was not abandoned for nothing: I learned well what it takes to make an actual software, and more importantly, my first ever try at using Tauri v2 + Nuxt v4 for production. This experience laid the pathway for other smaller desktop-software projects.

### Second Attempt

The second attempt was [Simple Markdown Editor](https://github.com/CTRL-Neo-Studios/simple-markdown-editor). It's a vibe-coded project and it had most of the Obsidian-Flavored Markdown aspects done and styled well. While the functions were usable, the code-base was beyond difficult for me to read (as a result of vibe-coding without oversight, in retrospect), hence the project was abandoned again. This attempt gave me experience on interacting with [CodeMirror 6](codemirror.net), which I came to learn that there were other CodeMirror plugins that tried to add the same elements similar to OFM but implemented either in **CodeMirror 5** or an extremely early version of **CodeMirror 6**. This meant that if I were to adapt these plugins (with proper attributions, of course) into my own future projects, I'll need more oversight in my code, the structure of the project, and an implicit understanding of how it is done.

The process of finding the right CodeMirror plugin for the next attempt was arduous and spontaneous. Arduous because most plugins were for **CodeMirror 5**, which have to understanding of; and spontaneous because of how GitHub searching works: sometimes I'd end up with the same results I've had for a few months, sometimes I'd have slightly different results in which the "difference" were the gold mine. During the process of research I also learned that there were previous attempts from other developers to make CodeMirror work with Rich-Text Markdown Editing, such as [HyperMD](https://github.com/laobubu/HyperMD), which I assume that Obsidian was originally based off of because Obsidian's HTML code had HyperMD classes attached to certain elements.

::callout
---
color: info
icon: i-lucide-info
to: https://github.com/Type-32/codemirror-rich-obsidian/blob/dev/README.md
---
For more information on the repositories and projects I came across during research, please check out my repo's [Readme File](https://github.com/Type-32/codemirror-rich-obsidian/blob/dev/README.md).
::

In short, the research spanned around 2 to 3 months before creating the repository of my 3rd attempt, and during development of my 3rd attempt there was also spontaneous research for parts that I needed to add.

### Third Attempt

The third attempt was around the time (I think it was around July 2025) I was migrating my projects to Nuxt v4, which turned out pretty great and overturned my expectations (Nuxt v3 was also great but there were confusing parts such as the project folder structure). I stumbled upon my second attempt and tried to migrate the stubborn old thing, which induced a lot of bugs that I think I never bothered to fix them. Anyhow, after some thoughts about renovating and raging war to my inner ego and self and the third attempt was born.

This time, I was still stuck to Vibe-Coding, but I tuned down the "Vibe-ness" a **WHOLE LOT**. Before, I used Cursor w/ Gemini 2.5 Pro and just straight up gave instructions on what to do without overviewing the code. In the new attempt, I made sure that I was the one in charge and understood my own projects and code. I planned out the structure, functionality, detailed descriptions of desired behaviors, and Cursor gone and wrote them out for me, and I'd organize and comprehend afterwards. I made sure my feet was in every part of the process, to an extent that I'm not blind to what the LLM is doing.

The new practice, immediately, started to yield better results. I redid the styles, updated to using Nuxt UI v4 for the project, and incorporated other people's CodeMirror plugins (with attributions) into the project, painful debugging and arguing with the LLM on what to change and what not to change, and turned the final polished thing into a Nuxt Module, and then **Voila!** I finally have a working OFM-compatible Rich Text Markdown Editor based on CodeMirror 6 that isn't a pain in my own ass and has similar editing UX as Obsidian's markdown editor.

---

## What came after

What came after was me carrying the momentum of moving forward and creating another project that tried to position itself (stupidly) into an FOSS Alternative of Obsidian. Believe me, the current state of **Vertex** is nowhere close to being an Alternative, but, one-step at a time, we're getting there. The hard parts were on file-indexing; dissecting the Obsidian app lead to more discoveries on how they handled workspace files (using IndexedDB, and I had no intention of touching that) and so on and as time went by, complexity built up fast.

Fortunately, I was able to get basics done, like folder-file indexing, index updates, internal link references, tabs, and so on. Callouts were a specific pain in my bottom because those damned things just somehow won't parse themselves nested... but baby steps, baby steps.

## What now

I intend on continuing this project's development after I finish some commissions and I do hope people start using it so I can gather more feedback and improve it. This has been a rather long journey, and I'm grateful for being on it, as I've learned valuable experiences in different areas such as UI/UX Design, Systems/Software Design, that'll be useful for my future career.

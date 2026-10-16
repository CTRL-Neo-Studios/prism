---
title: NeoGameLib
description: A small library for MonoGame that packs a lot of punch.
date: 2026-10-16T00:00:00.000Z
navigation:
  icon: i-lucide-gamepad-2
progress: release
repository:
  repoUsername: CTRL-Neo-Studios
  repoName: NeoGameLib
seo:
  title: Neogamelib file
  description: "A "
---

# Introduction

NeoGameLib is a prefab framework for MonoGame. It layers a Unity/Godot-style GameObject system, a collision bus, a render bus with world-space cameras, a screen-space UI system, input action maps, timers, storage helpers, and an asset cache on top of plain MonoGame. Everything is components attached to objects, and every system is a bus hanging off one `NeoGame` instance.

- Targets **.NET 8 and .NET 9**
- Built against **MonoGame.Framework.DesktopGL 3.8.x**
- License: AGPL-3.0-or-later
- All public types live under the `NeoGameLib` namespace tree (`NeoGameLib.NeoGO`, `NeoGameLib.NeoRendering`, `NeoGameLib.NeoCollision`, `NeoGameLib.NeoUI`, `NeoGameLib.NeoInput`, `NeoGameLib.Common`, `NeoGameLib.NeoStorage`)

## Features

- **GameObject model** — worlds hold objects, objects hold components, components hold your logic. Load/unload worlds at runtime.
- **Collision bus** — AABB colliders with interface-based callbacks and world collision groups.
- **Render bus** — sprites, text, world-space cameras with zoom and layer culling, sprite animations, render features.
- **Screen-space UI** — canvases, panels, flexbox, buttons, anchors and sizing modes, resolution scaling.
- **Input action maps** — named actions over keyboard and mouse with edge-triggered pressed/released states.
- **Timers, movement, storage** — reusable countdowns, a platformer movement component, JSON/file stores, an asset cache.
- **Letterboxed viewport** — fixed-aspect viewport with window modes, independent of the window size.

The library is small and consistent: once you understand the GameObject world model and the per-frame order, every subsystem follows the same shape.

---
title: Nuxt Predicates
description: Composable, reactive, and type-safe logic engine for Nuxt 4 & Tauri.
tags: []
navigation:
  icon: i-lucide-presentation
date: 2026-01-15
progress: release
repository:
  repoUsername: CTRL-Neo-Studios
  repoName: nuxt-predicates
  showIssues: true
---

**Nuxt Predicates is a composable, reactive, and type-safe logic engine for Nuxt 4 & Tauri.**

Stop writing spaghetti `if (a && b || !c)` statements. Compose your business logic like you compose your queries.

## 📦 Installation

```bash
bun add @type32/nuxt-predicates
```

and then add it into your `nuxt.config.ts`.

## 🚀 The Philosophy

1. **Define** atoms of logic (Predicates).
2. **Compose** them using SQL-like gates (`and`, `or`, `not`).
3. **Evaluate** them reactively (Client) or asynchronously (Server).

This library separates **Logic Definition** from **UI State**, making complex rules (like Menus, ACLs, and Guards) reusable and testable.

---

## 💻 Client Usage (Vue/Tauri)

On the client, predicates utilize Vue's Reactivity system. `evaluate` returns a `ComputedRef`.

### 1. Define Predicates

Create a file (e.g., `composables/rules.ts`) to define your atomic checks.

```typescript
import { definePredicate } from '#imports'

// Synchronous check (Reactive)
export const isRoute = definePredicate((path: string) => {
  const route = useRoute()
  return route.path === path
})

// Check against global state
export const isSessionValid = definePredicate(() => {
  const session = useSessionStore()
  return session.isActive && !session.expired
})
```

### 2. Compose & Evaluate

Use `usePredicateLogic()` to get your operators. This is scoped to avoid conflicts with libraries like Drizzle ORM.

```vue
<script setup lang="ts">
import { isRoute, isSessionValid } from '~/composables/rules'

// 1. Get Operators
const { and, or, not, evaluate } = usePredicateLogic()

// 2. Compose Logic (Lazy - code doesn't run yet)
const CanEdit = and(isSessionValid(), or(isRoute('/home'), isRoute('/dash')))

// 3. Create Reactive Ref (Vue Computed)
const $canEdit = evaluate(CanEdit)
</script>

<template>
  <!-- Buttons update automatically when route or session changes -->
  <button :disabled="!$canEdit">Edit Data</button>
</template>
```

---

## ⚡ Server Usage (Nitro)

Nitro contexts do not have Vue Reactivity. The server API uses **Promises** and pure functions.

### 1. Define Server Predicates

Use `defineServerPredicate` in your distinct server utils.

```typescript [server/utils/guards.ts]
import { defineServerPredicate } from '#imports'

export const isAdmin = defineServerPredicate(async (event) => {
  const session = await getSession(event)
  return session?.role === 'admin'
})

export const isWeekend = defineServerPredicate(() => {
  const day = new Date().getDay()
  return day === 0 || day === 6
})
```

### 2. Guard Routes

Pass `event` or context through your predicates.

```typescript [server/api/sensitive-data.get.ts]
export default defineEventHandler(async (event) => {
  const { and, evaluate } = useServerPredicates()

  // Logic: Must be Admin AND it must be the Weekend
  const accessRule = and(isAdmin(event), isWeekend())

  // Await the evaluation
  const allowed = await evaluate(accessRule)

  if (!allowed) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return { secret: 'data' }
})
```

---

## 📚 API Reference

### Definitions

| Function                    | Environment | Description                                                              |
| :-------------------------- | :---------- | :----------------------------------------------------------------------- |
| `definePredicate(fn)`       | **Client**  | Wraps logic (sync or async) into a generic reusable thunk. Support refs. |
| `defineServerPredicate(fn)` | **Server**  | Wraps pure logic (sync or async) for Nitro usage. No Vue dependency.     |

### Composition (`usePredicateLogic` / `useServerPredicates`)

| Operator              | Description                                                         |
| :-------------------- | :------------------------------------------------------------------ |
| `and(...conditions)`  | Returns `true` only if **ALL** conditions are true. Short-circuits. |
| `or(...conditions)`   | Returns `true` if **ANY** condition is true. Short-circuits.        |
| `not(condition)`      | Inverts the result.                                                 |
| `none(...conditions)` | Returns `true` if **NONE** of the conditions are true.              |

### Evaluation

| Function              | Return Type                                                              | Description                                                                      |
| :-------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| `evaluate(rule)`      | **Client:** `ComputedRef<boolean>`:br**Server:** `Promise<boolean>` | **Client:** Creates a reactive watcher. :br**Server:** Runs the check once. |
| `evaluateAsync(rule)` | `Promise<boolean>`                                                       | **Client Only:** Forces a one-time async check (useful for click handlers).      |

---

## ⚠️ Important Notes

1. **Lazy Evaluation:** Predicates are "lazy thunks". References like `isRoute('/home')` do not execute code until passed to `evaluate()`.
2. **Short-Circuiting:** Just like standard JS `&&` and `||`, if the first condition in an `and()` fails, subsequent predicates are **not** executed.
3. **Naming Collisions:** We strictly export operators via `usePredicateLogic()` hooks to ensure your code doesn't conflict with `drizzle-orm` or `zod` which also use `and`/`or` keywords.

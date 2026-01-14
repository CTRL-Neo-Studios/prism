---
title: Dispatcher
date: 2026-01-14T00:00:00.000Z
description: A simple event dispatcher for Nuxt.
navigation:
  icon: i-lucide-git-branch
progress: release
repository:
  repoUsername: CTRL-Neo-Studios
  repoName: dispatcher
  showIssues: true
  showWiki: false
seo:
  title: Dispatcher
  description: A type-safe, channel-based event dispatcher system for Nuxt with automatic cleanup and flexible event handling.
tags: []
---

A type-safe, channel-based event dispatcher system for Nuxt with automatic cleanup and flexible event handling.

✨  [Release Notes](https://github.com/CTRL-Neo-Studios/dispatcher/blob/dev/CHANGELOG.md)

## Features

- Simple event dispatcher system wrapping [mitt](https://github.com/developit/mitt)
- Create event buses with strong types quickly
- Create custom event types
- TypeScript-safe and type-safe

## Installation

```bash
bun add @type32/dispatcher
```

## Quick Start

### 1. Define Your Events

Create a typed event schema using the `DispatcherEvent` wrapper:

```ts [types/events.ts]
import type { DispatcherEvent } from '@type32/dispatcher'

export interface AppEvents {
  user: {
    login: DispatcherEvent<{ username: string; id: number }>
    logout: DispatcherEvent  // No payload
  }
  notification: {
    show: DispatcherEvent<{ message: string; type: 'success' | 'error' | 'info' }>
    hide: DispatcherEvent
  }
  modal: {
    open: DispatcherEvent<{ modalId:  string; props?:  Record<string, any> }>
    close: DispatcherEvent<{ modalId: string }>
  }
}
```

### 2. Use the Event Dispatcher

The `useEventDispatcher` composable is auto-imported in Nuxt:

```vue
<script setup>
import type { AppEvents } from '~/types/events'

// Create a dispatcher with a channel key (recommended)
const events = useEventDispatcher<AppEvents>('app')

// Listen to events (auto-cleanup on unmount)
events.on('user.login', (data) => {
  console.log('User logged in:', data. username, data.id)
})

events.on('notification.show', (data) => {
  // Show notification UI
  console.log(data.message, data.type)
})

// Emit events
const handleLogin = () => {
  events.emit('user.login', { username: 'john', id: 123 })
}

const handleLogout = () => {
  events.emit('user.logout') // No payload required
}
</script>
```

## Channel Keys

**Channel keys are highly recommended**, especially when using the dispatcher within composables.

### ✅ With Channel Key (Recommended)

```ts [composables/useNotifications.ts]
export function useNotifications() {
  // Same channel key = same event bus across all usages
  const events = useEventDispatcher<AppEvents>('app')
  
  const showNotification = (message: string, type: 'success' | 'error') => {
    events.emit('notification.show', { message, type })
  }
  
  return { showNotification }
}
```

```vue [pages/index.vue]
// Same key - will receive events
const events = useEventDispatcher<AppEvents>('app')
events.on('notification.show', (data) => {
  // This works!  Same channel key = shared bus
})
```

```vue [pages/other.vue]
// Trigger from anywhere
const { showNotification } = useNotifications()
showNotification('Hello!', 'success')
```

### ❌ Without Channel Key (Not Recommended for Composables)

```ts [composables/useNotifications.ts]
export function useNotifications() {
  // ⚠️ Each call creates a NEW isolated bus! 
  const events = useEventDispatcher<AppEvents>()
  
  const showNotification = (message: string) => {
    events.emit('notification.show', { message, type: 'info' })
  }
  
  return { showNotification }
}
```

```vue [pages/index.vue]
const events = useEventDispatcher<AppEvents>() // Different bus! 
events.on('notification.show', (data) => {
  // ❌ Won't receive events from useNotifications()
})
```

**When to omit channel keys:**

- Component-local events that don't need to be shared
- Temporary event buses for isolated features
- Testing and prototyping on one single file

## API Reference

### `useEventDispatcher<TEvents>(channelKey?: string)`

Creates or retrieves an event dispatcher for the specified channel.

**Parameters:**

- `channelKey` (optional): String identifier for the channel. Omit to create an isolated instance.

**Returns:** Event dispatcher instance with the following methods:

#### `emit<K>(event: K, payload?: T)`

Emit a typed event with an optional payload.

```ts
events.emit('user.login', { username: 'john', id:  123 })
events.emit('user.logout') // No payload
```

#### `on<K>(event: K, handler: (payload: T) => void)`

Listen to an event. Automatically cleaned up on component unmount.

```ts
events.on('user.login', (data) => {
  console.log(data.username, data.id)
})
```

#### `off<K>(event: K, handler: (payload: T) => void)`

Manually remove an event listener.

```ts
const handler = (data) => console.log(data)
events.on('user.login', handler)
events.off('user.login', handler)
```

#### `once<K>(event: K, handler: (payload: T) => void)`

Listen to an event once, then automatically remove the listener.

```ts
events.once('modal.close', (data) => {
  console.log('Modal closed:', data.modalId)
})
```

#### `yeet(event: string, payload?: any)`

Fire-and-forget untyped event (no type checking, no history).

```ts
events.yeet('debug.log', { message: 'Something happened' })
events.yeet('analytics.track', 'button-clicked')
```

#### `catch(event: string, handler: (payload: any) => void)`

Listen to untyped events.

```ts
events.catch('debug.log', (data) => {
  console.log('Debug:', data)
})
```

#### `uncatch(event: string, handler: (payload: any) => void)`

Remove an untyped event listener.

#### `clear()`

Remove all listeners from this dispatcher instance.

```ts
events.clear()
```

## Features

### ✅ Full Type Safety

IntelliSense autocompletes event paths and validates payload types:

```ts
events.emit('user.login', { username: 'john', id:  123 }) // ✅ Valid
events.emit('user.login', { wrong: 'data' }) // ❌ TypeScript error
events.emit('user.logout', { extra: 'data' }) // ❌ TypeScript error
```

### ✅ Automatic Cleanup

All event listeners are automatically removed when the component unmounts (using onUnmounted provided by vue) - no manual cleanup needed!

### ✅ Dot-Notation Namespacing

Organize events hierarchically:

```ts
events.on('window.file.newFile', handler)
events.on('player.movement.walk', handler)
events.on('ui.modal.open', handler)
```

### ✅ Channel-Based Isolation

Multiple channels for different contexts:

```ts
const uiEvents = useEventDispatcher<UIEvents>('ui')
const gameEvents = useEventDispatcher<GameEvents>('game')

// Events don't cross channels
uiEvents.emit('modal.open', { modalId: 'settings' })
// gameEvents won't receive this
```

### ✅ Wild Events (UDP-style)

For debug logs, analytics, or temporary events without type constraints:

***Note***\*: Wild events called using\* `yeet()` *can only be caught by using the* `catch()` *function. The wild event bus is separate from the normal event bus.*

```ts
events.yeet('temp.debug', { whatever: 'data' })
events.catch('temp.debug', console.log)
```

## Common Patterns

### Global Event Bus

```ts [composables/useGlobalEvents.ts]
import type { GlobalEvents } from '~/types/events'

export const useGlobalEvents = () => useEventDispatcher<GlobalEvents>('global')
```

### Feature-Specific Channels

```ts
export const useUIEvents = () => useEventDispatcher<UIEvents>('ui')
export const useGameEvents = () => useEventDispatcher<GameEvents>('game')
export const usePlayerEvents = () => useEventDispatcher<PlayerEvents>('player')
```

### Cross-Component Communication

```vue [components/LoginForm.vue]
<script setup>
const events = useEventDispatcher<AppEvents>('app')

const handleSubmit = async (credentials) => {
  const user = await login(credentials)
  events.emit('user.login', { username: user.name, id: user.id })
}
</script>
```

```vue [components/UserForm.vue]
<script setup>
const events = useEventDispatcher<AppEvents>('app')
const isLoggedIn = ref(false)

events.on('user.login', (data) => {
  isLoggedIn.value = true
  console.log('Welcome', data.username)
})

events.on('user.logout', () => {
  isLoggedIn.value = false
})
</script>
```

## Contribution

::accordion{type="single"}
  :::accordion-item
  ---
  description: Commands for Local Dev
  label: Local Development
  ---
  ```bash
  # Install dependencies
  bun i

  # Generate type stubs
  bun run dev:prepare

  # Develop with the playground
  bun run dev

  # Build the playground
  bun run dev:build

  # Run ESLint
  bun run lint

  # Run Vitest
  bun run test
  bun run test:watch

  # Release new version
  bun run release
  ```
  :::
::

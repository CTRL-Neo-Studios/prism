---
title: Facet API
description: A unified class for managing callbacks and cutting down references to MonoBehaviours.
seo:
  title: Facet-api file
  description: "A unified class for managing callbacks and cutting down references to MonoBehaviours. "
tags: []
date: 2025-08-29
progress: release
repository:
  repoUsername: CTRL-Neo-Studios
  repoName: facet-api
  showIssues: true
  showWiki: true
navigation:
  icon: i-ic-sharp-api
---

Facet API is a simple plug-and-pull library for managing your callbacks in C# to avoid annoying external references to other classes or objects.

## Design

This API is designed for Unity and provides a unified interface for managing callbacks between classes.

The main idea is to have a unified interface of access between classes that has functions that needs to be called on either side. For example:

![mermaid-diagram-2026-01-08-204148](/projects/facet-api/mermaid-diagram-2026-01-08-204148.png)

As you can see from the graph, classes are accessing classes to try to access the different functions or variables within them, leading to a spaghetti of references and are sometimes hard to manage and track down.

With FacetAPI, you can unify all the functions and variables you need to access into callbacks:

![mermaid-diagram-2026-01-08-204233](/projects/facet-api/mermaid-diagram-2026-01-08-204233.png)

As you can see, the classes are now only accessing the FacetAPI of the other classes, which is a single point of access to all the functions and variables you need to access. This makes it easier to manage and track down references between classes. This also allows you to easily swap out implementations of the FacetAPI without having to change the references in the other classes. This is especially useful for testing, as you can easily swap out the implementation of the FacetAPI with a mock implementation for testing purposes.

## Usage

The usage itself is pretty simple, per design. Though we are using a name-based system, so you need to be careful with the names of the callbacks you create. (We have error handling for conflicting names, but it is still a good idea to be careful with the names you use.)

What we'd suggest for a workaround of the issue above is to have a class have all the static constant variables of the keywords of callbacks, that way when getting callbacks or creating callbacks you'd have better control over the names you use.

### Creating a Callback

```csharp
using FacetAPI.Runtime.Core;

// Create API instance
var api = new FacetApi();

// Create a callback
var callback = api.CreateCallback<Action<string>>("testCallback");

// Subscribe
callback.Subscribe(msg => Debug.Log($"Received: {msg}"));

// Invoke
callback.Invoke("Hello World");

// Watch for condition (async version)
var cts = new CancellationTokenSource();
_ = callback.WatchAndInvokeAsync(
    "Test",
    () => DateTime.Now.Second % 10 == 0,
    TimeSpan.FromSeconds(1),
    cts.Token);
```

### Getting a Callback

```csharp
using FacetAPI.Runtime.Core;

// Create and register a callback
var api = new FacetApi();
api.CreateCallback<Action<int>>("onScoreChanged");

// Later, fetch it elsewhere in your code
var scoreCallback = api.Get<Action<int>>("onScoreChanged");
scoreCallback.Subscribe(score => Debug.Log($"Score changed to {score}"));

// Invoke it
scoreCallback.Invoke(100);
```

## Installation

### Unity Package Manager (Recommended)

1. Open the Unity Package Manager (Window > Package Manager)
2. Click the "+" button in the top-left corner
3. Select "Add package from git URL..."
4. Enter the URL of this repository: `https://github.com/CTRL-Neo-Studios/facet-api.git`
5. Click "Add"
6. Wait for Unity to download and import the package
7. Use the package in your scripts by adding `using FacetAPI.Runtime.Core;`

### Manual Installation

1. Clone this repository into your Unity project's `Packages` folder
2. The package will be automatically recognized by Unity
3. Use the package in your scripts by adding `using FacetAPI.Runtime.Core;`

## Requirements

- Unity 2021.3 or later
- .NET Standard 2.1 compatible

## License

This project is licensed under the MIT License - see the LICENSE file for details.

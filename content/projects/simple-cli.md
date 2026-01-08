---
title: SimpleCLI
description: "An extremely simple CLI building tool for CSharp projects. "
seo:
  title: Simple-cli file
  description: "An extremely simple CLI building tool for CSharp projects. "
date: 2025-04-15
tags: []
progress: release
repository:
  repoUsername: CTRL-Neo-Studios
  repoName: simple-cli
  showIssues: true
  showWiki: true
navigation:
  icon: i-lucide-code
---

An extremely simple CLI building tool for CSharp projects.

## Usage

### Modules

Please check the [Modules Document](https://github.com/CTRL-Neo-Studios/simple-cli/blob/dev/Modules.md).

### Parsing

```csharp
// Registering and using commands
var parser = new SimpleCLIParser();
parser.RegisterCommand(new MyCustomCommand());

// Execute commands
parser.Execute("echo Hello World --color green");
parser.Execute("help echo");
```

### Custom Commands

You can use the `SimpleCLICommand` class to create your own commands. Here is an example of a custom echo command:

```csharp
public class ExampleCommand : CLICommand
{
    public override string Name => "echo";
    public override string Description => "Echoes the input back to the console";
    public override string Usage => "echo <message> [-c color]";
    public override string[] Aliases => new[] { "print" };
    
    public override void Execute(CLIArguments args, CLIParser context)
    {
        if (args.Arguments.Count == 0)
            throw new CLIException("No message provided");
            
        string message = string.Join(" ", args.Arguments);
        string color = args.GetFlag("c", "white");
        
        context.Output($"<color={color}>{message}</color>");
    }
    
    public override string[] GetAutoCompleteSuggestions(int argIndex, string input)
    {
        if (argIndex == 0)
        {
            return new[] { "red", "green", "blue", "yellow", "white" };
        }
        return base.GetAutoCompleteSuggestions(argIndex, input);
    }
}
```

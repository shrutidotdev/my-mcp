# My MCP Server

A Model Context Protocol (MCP) server implementation demonstrating tool registration with stdio transport support.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Available Tools](#available-tools)
- [Project Structure](#project-structure)
- [Development](#development)
- [Integration with Claude](#integration-with-claude)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project demonstrates a basic MCP server setup using the official `@modelcontextprotocol/sdk`. The server exposes tools that can be called by MCP clients like Claude Desktop, custom AI applications, or testing tools like MCP Inspector.

**Key Features:**
- Stdio transport for local process communication
- Tool registration with Zod schema validation
- Ready for integration with MCP clients

## ✅ Prerequisites

- **Node.js** v18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **OS**: Windows, macOS, or Linux

## 📦 Installation

1. **Navigate to project directory:**

```bash
cd my-mcp
```

2. **Install dependencies:**

```bash
npm install
```

or

```bash
pnpm install
```

This installs:
- `@modelcontextprotocol/sdk` (^1.21.1) - Official MCP SDK
- `zod` (^3.25.76) - TypeScript-first schema validation

## 🚀 Usage

### Starting the Server

**Development mode with auto-reload:**

```bash
npm start
```

**Direct execution:**

```bash
node mcp.js
```

The server listens on **stdio** for incoming JSON-RPC messages from MCP clients.

> **Note**: The server won't produce visible output unless connected to a client or unless you add logging to stderr.

## 🧪 Testing

### Option 1: MCP Inspector (Recommended)

**Visual UI testing:**

```bash
npx @modelcontextprotocol/inspector node mcp.js
```

Opens a browser interface at `http://localhost:6274` where you can:
- Connect to your server
- Browse available tools
- Execute tools with custom inputs
- View responses in real-time

**CLI testing:**

```bash
# List all tools
npx @modelcontextprotocol/inspector --cli list-tools node mcp.js

# Call the add tool
npx @modelcontextprotocol/inspector --cli call-tool add '{"a": 5, "b": 3}' node mcp.js
```

### Option 2: Manual JSON-RPC Testing

**Initialize connection:**

```bash
echo '{"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2024-11-05", "capabilities": {}, "clientInfo": {"name": "test-client", "version": "1.0.0"}}}' | node mcp.js | jq
```

**List tools:**

```bash
echo '{"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}' | node mcp.js | jq
```

**Call a tool:**

```bash
echo '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "add", "arguments": {"a": 5, "b": 3}}}' | node mcp.js | jq
```

## 🛠️ Available Tools

### `add`

Performs addition of two numbers.

**Parameters:**

| Parameter | Type   | Description       |
|-----------|--------|-------------------|
| `a`       | number | The first number  |
| `b`       | number | The second number |

**Returns:** Text content with the sum of the two numbers

**Example:**

```javascript
// Input
{ "a": 5, "b": 3 }

// Output
{ "content": [{ "type": "text", "text": "8" }] }
```

## 📁 Project Structure

```
my-mcp/
├── mcp.js           # Main server implementation
├── weather.js       # Weather utilities (if applicable)
├── package.json     # Project metadata and dependencies
├── .gitignore       # Git ignore rules
└── README.md        # This file
```

## 💻 Development

### Adding New Tools

Use the `server.registerTool()` method to add tools:

```javascript
server.registerTool(
    'tool-name',
    {
        title: 'Human-Readable Tool Name',
        description: 'Clear description of what the tool does',
        inputSchema: {
            param1: z.string().describe('Parameter description'),
            param2: z.number().optional().describe('Optional parameter'),
        },
    },
    async ({ param1, param2 }) => {
        // Your tool logic here
        const result = doSomething(param1, param2);
        
        return { 
            content: [{ 
                type: 'text', 
                text: String(result) 
            }]
        };
    }
);
```

### Best Practices

- **Use stderr for logging** (stdout is reserved for JSON-RPC):
  ```javascript
  console.error('Debug message');
  ```

- **Tool naming**: Use lowercase with hyphens (e.g., `get-weather`, `add`)

- **Schema validation**: Always define clear input schemas with Zod for type safety

- **Error handling**: Wrap tool logic in try-catch blocks

## 🔗 Integration with Claude

### Requirements

- **Claude Pro or Max subscription** (MCP not available on free tier)

### Configuration

**Windows:**
Edit `%APPDATA%\Claude\claude_desktop_config.json`

**macOS:**
Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**Add your server:**

```json
{
    "mcpServers": {
        "my-mcp": {
            "command": "node",
            "args": ["C:\\absolute\\path\\to\\your\\mcp.js"]
        }
    }
}
```

**Restart Claude Desktop** to load the configuration.

### Using in Claude

Simply ask Claude in natural language:
- "Can you add 15 and 27?"
- "Use the add tool to calculate 100 + 250"

Claude will automatically detect and use your tool.

## 🐛 Troubleshooting

### Server doesn't start

- Verify Node.js version: `node --version` (should be v18+)
- Check all dependencies are installed: `npm install`
- Look for syntax errors in `mcp.js`

### Tools not appearing in Claude

- Ensure you have a paid Claude subscription
- Verify the absolute path in `claude_desktop_config.json`
- Restart Claude Desktop completely
- Check Claude's logs for connection errors

### JSON-RPC errors

- Ensure messages are properly formatted JSON
- Check that `initialize` is called before other methods
- Verify parameter types match your Zod schema

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP SDK GitHub](https://github.com/modelcontextprotocol/sdk)
- [Example Servers](https://modelcontextprotocol.io/example-servers)
- [Zod Documentation](https://zod.dev)

## 📄 License

ISC

---

**Built with** the Model Context Protocol by Anthropic

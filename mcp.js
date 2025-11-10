import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";

const server = new McpServer({
    name: "Example MCP Server",
    version: "1.0.0",
})

server.registerTool(
    'add',
    {
        title: 'Addition of Numbers',
        description: 'Adds two numbers together and returns the result.',
        inputSchema: {
            a: z.number().describe('The first number needed'),
            b: z.number().describe('The second number needed'),
        },
    },
    async ({ a, b }) => {
        return { 
           content: [{ type: 'text', text: String(a+b)}]
        };
    }
);

// stdio
//For local integrations spawned by another process, you can use the stdio transport:

const transport = new StdioServerTransport();
await server.connect(transport);
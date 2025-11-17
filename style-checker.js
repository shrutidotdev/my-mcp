import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod";
import { readFileSync } from "fs";
import { type } from "os";
import { text } from "stream/consumers";

const airbnbMarkdownPath = 'C:\\Users\\thede\\Desktop\\my-mcp\\style-guide.md';
const airbnbMarkdown = readFileSync(airbnbMarkdownPath, "utf-8");

const server = new McpServer({
    name: "style-checker",
    version: "1.0.0",
});

server.registerPrompt(
    "review_code_style",
    {
        title: "Review Code Style",
        description: "Review the provided code snippet for style issues based on the Airbnb JavaScript Style Guide. Provide specific feedback and suggestions for improvement.",
        inputSchema: {
            codeSnippet: z.string().describe("The code snippet to be reviewed for style issues."),
        },
        outputSchema: {
            review: z.string().describe("The style review feedback based on the Airbnb JavaScript Style Guide."),
        },
    },
    ({ codeSnippet }) => {
        messages: [{
            role: "user",
            content: {
                type: "text",
                text: `Please review the following code snippet for style issues based on the Airbnb JavaScript Style Guide. Provide specific feedback and suggestions for improvement.

Here is the Airbnb JavaScript Style Guide for reference:
${airbnbMarkdown} \n\nHere is the code snippet to review:\n\n${codeSnippet}`,
            }
        }]
    });
// Remote MCP endpoint (Streamable HTTP): read-only mirror of the ocean-uiux-mcp stdio server.
//
// A hosted function has no access to a caller's filesystem, so it only registers
// search_components and get_component. add_components/init_project write into a real
// project via the shadcn CLI and only make sense with the local `npx ocean-uiux-mcp install`
// server, which runs on the same machine as the project.
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"

import { createRegistry } from "ocean-uiux-mcp/registry"
import { createServer } from "ocean-uiux-mcp/server"

export const runtime = "nodejs"

// The registry materialises its bundled JSON into a cache dir on first read; /tmp is the
// only writable path in a serverless function.
process.env.OCEAN_UIUX_CACHE_DIR ??= "/tmp/ocean-uiux-mcp"

const registry = createRegistry()

async function handle(request: Request) {
  const server = createServer(registry, { only: ["search_components", "get_component"] })
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true, // single JSON response per call, no long-lived SSE stream to keep open
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}

export { handle as GET, handle as POST, handle as DELETE }

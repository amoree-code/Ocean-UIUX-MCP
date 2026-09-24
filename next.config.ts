import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Runs as plain Node ESM (not bundled): it uses import.meta.dirname to locate its
  // bundled registry files on disk, which only resolves correctly when Node loads the
  // module directly instead of webpack rewriting it.
  serverExternalPackages: ["ocean-uiux-mcp"],
}

export default nextConfig

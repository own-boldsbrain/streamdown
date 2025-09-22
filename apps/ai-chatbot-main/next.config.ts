import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
    ],
  },
  experimental: {
    externalDir: true,
    // transpile pacotes ESM que dependem de node libs e TS defs
    // para evitar erros de module not found ao importar 'streamdown' (que usa mermaid/langium)
    // Nota: Next 15 usa 'transpilePackages' na raiz da config (não em experimental)
  },
  transpilePackages: [
    "mermaid",
    "@mermaid-js/parser",
    "langium",
    "streamdown",
    "vscode-languageserver-types",
  ],
};

export default nextConfig;

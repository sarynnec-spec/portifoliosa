import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exportação estática: o build cai em /out e pode ser servido pelo Laragon.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;

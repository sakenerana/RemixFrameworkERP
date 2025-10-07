import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Environment variables setup
  const isProduction = mode === "production";
  const apiBaseUrl = "https://iaccs-api.cficoop.com";

  return {
    build: {
      outDir: "build",
      emptyOutDir: true,
      assetsDir: "static",
    },
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
          v3_singleFetch: true,
          v3_lazyRouteDiscovery: true,
        },
        ssr: false,
        basename: "/",
        buildDirectory: "build",
      }),
      tsconfigPaths(),
    ],
    define: {
      // Expose environment variables to client
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        isProduction ? `${apiBaseUrl}/api/external/activitybuilder` : "/api"
      ),
    },
    server: isProduction ? undefined : {
      host: "cficoop.test",
      port: 5173,
      proxy: {
        "/api": {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api/external/activitybuilder"),
          secure: false, // For HTTPS development
        },
        "/api2": {
          target: apiBaseUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api2/, "/api/external/auth"),
          secure: false,
        },
      },
    },
  };
});
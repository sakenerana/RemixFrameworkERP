import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  build: {
    // Ensure proper client-side build settings
    outDir: 'build',
    emptyOutDir: true,
  },
  // server: {
  //   host: 'cficoop.test', // Allow custom domain
  //   port: 5173,         // Keep default port (optional)
  //   allowedHosts: [
  //     'cficoop.test',     // Allow this domain
  //   ],
  //   proxy: {
  //     '/api': {  // All requests starting with `/api` will be proxied
  //       target: 'http://192.168.31.3:82', // Your API server
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '/api/external/activitybuilder'), // Adjust path if needed
  //     },
  //     '/api2': {  // All requests starting with `/api2` will be proxied
  //       target: 'http://192.168.31.3:82', // Your API server
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api2/, '/api/external/auth'), // Adjust path if needed
  //     },
  //   },
  // },
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
      basename: '/',
      buildDirectory: 'build',
    }),
    tsconfigPaths(),
  ],
});

import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      routes(defineRoutes) {
        return defineRoutes((route) => {
          route("/", "auth/login.tsx", { index: true });
          route("forgot-password", "auth/forgot_password.tsx", { index: true });
          route("main", "components/layout.tsx", () => {
            route("dashboard", "routes/dashboard/dashboard.tsx", { index: true });
            route("settings/suppliers", "routes/suppliers/settings.suppliers.tsx", { index: true });
            route("users", "routes/users/users.tsx", { index: true });
            route("settings/departments", "routes/departments/settings.departments.tsx", { index: true });
            route("settings/categories", "routes/categories/settings.categories.tsx", { index: true });
            route("settings/manufacturers", "routes/manufacturers/settings.manufacturers.tsx", { index: true });
            route("settings/locations", "routes/locations/settings.locations.tsx", { index: true });
            route("settings/companies", "routes/companies/settings.companies.tsx", { index: true });
            route("settings/depreciation", "routes/depreciation/settings.depreciation.tsx", { index: true });
            route("assets/requested", "routes/requested/assets.requested.tsx", { index: true });
            route("assets/deleted", "routes/deleted/assets.deleted.tsx", { index: true });
            route("assets/create-assets", "routes/assets/assets.create_assets.tsx", { index: true });
            route("licenses", "routes/licenses/licenses.tsx", { index: true });
            route("accessories", "routes/accessories/accessories.tsx", { index: true });
            route("consumables", "routes/consumables/consumables.tsx", { index: true });
            route("components", "routes/components/components.tsx", { index: true });
            route("predefined-kit", "routes/predefined_kit/predefined_kit.tsx", { index: true });
            route("requestable-items", "routes/requestable_items/requestable_items.tsx", { index: true });
            route("reports/activity-report", "routes/activity_report/reports.activity_report.tsx", { index: true });
            route("reports/custom-asset-report", "routes/custom_asset_report/reports.custom_asset_report.tsx", { index: true });
            route("reports/audit-log", "routes/audit_log/reports.audit_log.tsx", { index: true });
            route("reports/depreciation-report", "routes/depreciation_report/reports.depreciation_report.tsx", { index: true });
            route("reports/licenses-report", "routes/licenses_report/reports.licenses_report.tsx", { index: true });
            route("reports/asset-maintenance-report", "routes/asset_maintenance_report/reports.asset_maintenance_report.tsx", { index: true });
            route("reports/unaccepted-assets", "routes/unaccepted_assets/reports.unaccepted_assets.tsx", { index: true });
            route("reports/accessory-report", "routes/accessory_report/reports.accessory_report.tsx", { index: true });
          });
          route("*", "routes/404Page/page_not_exist.tsx", { index: true });
        });
      },
    }),
    tsconfigPaths(),
  ],
});

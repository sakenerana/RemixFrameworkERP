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
          route("signup", "auth/signup.tsx", { index: true });
          route("forgot-password", "auth/forgot_password.tsx", { index: true });
          route("", "components/ProtectedRoute.tsx", () => {
            route("landing-page", "routes/landing_page/landing_page.tsx", {
              index: true,
            });
            route("inventory", "components/inventory_layout.tsx", () => {
              route("", "routes/dashboard/dashboard.tsx", { index: true });
              route("settings", "routes/settings/route.tsx", () => {
                route("", "routes/settings/settings.tsx", { index: true });
              });
              route("settings/suppliers", "routes/suppliers/route.tsx", () => {
                route("", "routes/suppliers/settings.suppliers.tsx", {
                  index: true,
                });
                route(
                  "create-supplier",
                  "routes/suppliers/settings.create.tsx",
                  { index: true }
                );
                route(
                  "update-supplier",
                  "routes/suppliers/settings.update.tsx",
                  { index: true }
                );
                route(
                  "deleted-supplier",
                  "routes/suppliers/settings.deleted.tsx",
                  { index: true }
                );
              });
              route("users", "routes/users/route.tsx", () => {
                route("", "routes/users/users.tsx", { index: true });
                route("create-user", "routes/users/users.create.tsx", {
                  index: true,
                });
                route("update-user", "routes/users/users.update.tsx", {
                  index: true,
                });
                route("deleted-user", "routes/users/users.deleted.tsx", {
                  index: true,
                });
              });
              route(
                "settings/departments",
                "routes/departments/route.tsx",
                () => {
                  route("", "routes/departments/settings.departments.tsx", {
                    index: true,
                  });
                  route(
                    "create-department",
                    "routes/departments/settings.create.tsx",
                    { index: true }
                  );
                  route(
                    "update-department",
                    "routes/departments/settings.update.tsx",
                    { index: true }
                  );
                  route(
                    "deleted-department",
                    "routes/departments/settings.deleted.tsx",
                    { index: true }
                  );
                }
              );
              route(
                "settings/categories",
                "routes/categories/route.tsx",
                () => {
                  route("", "routes/categories/settings.categories.tsx", {
                    index: true,
                  });
                  route(
                    "create-category",
                    "routes/categories/settings.create.tsx",
                    { index: true }
                  );
                  route(
                    "update-category",
                    "routes/categories/settings.update.tsx",
                    { index: true }
                  );
                  route(
                    "deleted-category",
                    "routes/categories/settings.deleted.tsx",
                    { index: true }
                  );
                }
              );
              route(
                "settings/manufacturers",
                "routes/manufacturers/route.tsx",
                () => {
                  route("", "routes/manufacturers/settings.manufacturers.tsx", {
                    index: true,
                  });
                  route(
                    "create-manufacturer",
                    "routes/manufacturers/settings.create.tsx",
                    { index: true }
                  );
                  route(
                    "update-manufacturer",
                    "routes/manufacturers/settings.update.tsx",
                    { index: true }
                  );
                  route(
                    "deleted-manufacturer",
                    "routes/manufacturers/settings.deleted.tsx",
                    { index: true }
                  );
                }
              );
              route("settings/locations", "routes/locations/route.tsx", () => {
                route("", "routes/locations/settings.locations.tsx", {
                  index: true,
                });
                route(
                  "create-location",
                  "routes/locations/settings.create.tsx",
                  { index: true }
                );
                route(
                  "update-location",
                  "routes/locations/settings.update.tsx",
                  { index: true }
                );
                route(
                  "deleted-location",
                  "routes/locations/settings.deleted.tsx",
                  { index: true }
                );
              });
              route("settings/companies", "routes/companies/route.tsx", () => {
                route("", "routes/companies/settings.companies.tsx", {
                  index: true,
                });
                route(
                  "create-company",
                  "routes/companies/settings.create.tsx",
                  { index: true }
                );
                route(
                  "update-company",
                  "routes/companies/settings.update.tsx",
                  { index: true }
                );
                route(
                  "deleted-company",
                  "routes/companies/settings.deleted.tsx",
                  { index: true }
                );
              });
              route(
                "settings/depreciation",
                "routes/depreciation/route.tsx",
                () => {
                  route("", "routes/depreciation/settings.depreciation.tsx", {
                    index: true,
                  });
                  route(
                    "create-depreciation",
                    "routes/depreciation/settings.create.tsx",
                    { index: true }
                  );
                  route(
                    "update-depreciation",
                    "routes/depreciation/settings.update.tsx",
                    { index: true }
                  );
                  route(
                    "deleted-depreciation",
                    "routes/depreciation/settings.deleted.tsx",
                    { index: true }
                  );
                }
              );
              route(
                "assets/requested",
                "routes/requested/assets.requested.tsx",
                { index: true }
              );
              route("assets/deleted", "routes/deleted/assets.deleted.tsx", {
                index: true,
              });
              route("assets/list-assets", "routes/assets/route.tsx", () => {
                route("", "routes/assets/assets.list_assets.tsx", {
                  index: true,
                });
                route("audit-assets", "routes/assets/assets.audit.tsx", {
                  index: true,
                });
                route("create-assets", "routes/assets/assets.create.tsx", {
                  index: true,
                });
                route("update-assets", "routes/assets/assets.update.tsx", {
                  index: true,
                });
                route("deleted-assets", "routes/assets/assets.deleted.tsx", {
                  index: true,
                });
              });
              route("licenses", "routes/licenses/route.tsx", () => {
                route("", "routes/licenses/licenses.tsx", { index: true });
                route("create-license", "routes/licenses/create.tsx", {
                  index: true,
                });
                route("update-license", "routes/licenses/update.tsx", {
                  index: true,
                });
                route("deleted-license", "routes/licenses/deleted.tsx", {
                  index: true,
                });
              });
              route("accessories", "routes/accessories/route.tsx", () => {
                route("", "routes/accessories/accessories.tsx", {
                  index: true,
                });
                route("create-accessory", "routes/accessories/create.tsx", {
                  index: true,
                });
                route("update-accessory", "routes/accessories/update.tsx", {
                  index: true,
                });
                route("deleted-accessories", "routes/accessories/deleted.tsx", {
                  index: true,
                });
              });
              route("consumables", "routes/consumables/route.tsx", () => {
                route("", "routes/consumables/consumables.tsx", {
                  index: true,
                });
                route("create-consumable", "routes/consumables/create.tsx", {
                  index: true,
                });
                route("update-consumable", "routes/consumables/update.tsx", {
                  index: true,
                });
                route("deleted-consumables", "routes/consumables/deleted.tsx", {
                  index: true,
                });
              });
              route("components", "routes/components/route.tsx", () => {
                route("", "routes/components/components.tsx", { index: true });
                route("create-component", "routes/components/create.tsx", {
                  index: true,
                });
                route("update-component", "routes/components/update.tsx", {
                  index: true,
                });
                route("deleted-components", "routes/components/deleted.tsx", {
                  index: true,
                });
              });
              route("predefined-kit", "routes/predefined_kit/route.tsx", () => {
                route("", "routes/predefined_kit/predefined_kit.tsx", {
                  index: true,
                });
                route(
                  "create-predefined-kit",
                  "routes/predefined_kit/create.tsx",
                  { index: true }
                );
                route(
                  "update-predefined-kit",
                  "routes/predefined_kit/update.tsx",
                  { index: true }
                );
                route(
                  "deleted-predefined-kit",
                  "routes/predefined_kit/deleted.tsx",
                  { index: true }
                );
              });
              route(
                "requestable-items",
                "routes/requestable_items/route.tsx",
                () => {
                  route("", "routes/requestable_items/requestable_items.tsx", {
                    index: true,
                  });
                  route(
                    "create-request",
                    "routes/requestable_items/create.tsx",
                    { index: true }
                  );
                }
              );
              route(
                "reports/activity-report",
                "routes/activity_report/reports.activity_report.tsx",
                { index: true }
              );
              route(
                "reports/custom-asset-report",
                "routes/custom_asset_report/reports.custom_asset_report.tsx",
                { index: true }
              );
              route(
                "reports/audit-log",
                "routes/audit_log/reports.audit_log.tsx",
                { index: true }
              );
              route(
                "reports/depreciation-report",
                "routes/depreciation_report/reports.depreciation_report.tsx",
                { index: true }
              );
              route(
                "reports/licenses-report",
                "routes/licenses_report/reports.licenses_report.tsx",
                { index: true }
              );
              route(
                "reports/asset-maintenance-report",
                "routes/asset_maintenance_report/reports.asset_maintenance_report.tsx",
                { index: true }
              );
              route(
                "reports/unaccepted-assets",
                "routes/unaccepted_assets/reports.unaccepted_assets.tsx",
                { index: true }
              );
              route(
                "reports/accessory-report",
                "routes/accessory_report/reports.accessory_report.tsx",
                { index: true }
              );
            });

            // BUDGET TRACKER
            route("budget", "components/budget_layout.tsx", () => {
              route("", "routes/budget_dashboard/budget_dashboard.tsx", { index: true });
              route("accounts", "routes/budget_accounts/route.tsx", () => {
                route("", "routes/budget_accounts/budget_accounts.tsx", { index: true });
                route("create-accounts", "routes/budget_accounts/create.tsx", {
                  index: true,
                });
                route("update-accounts", "routes/budget_accounts/update.tsx", {
                  index: true,
                });
                route("deleted-accounts", "routes/budget_accounts/deleted.tsx", {
                  index: true,
                });
              });

              route("transactions", "routes/budget_transactions/route.tsx", () => {
                route("", "routes/budget_transactions/budget_transactions.tsx", { index: true });
                route("create-transactions", "routes/budget_transactions/create.tsx", {
                  index: true,
                });
                route("update-transactions", "routes/budget_transactions/update.tsx", {
                  index: true,
                });
                route("deleted-transactions", "routes/budget_transactions/deleted.tsx", {
                  index: true,
                });
              });

              route("budgets", "routes/budgets/route.tsx", () => {
                route("", "routes/budgets/budget.tsx", { index: true });
                route("create-budget", "routes/budgets/create.tsx", {
                  index: true,
                });
                route("update-budget", "routes/budgets/update.tsx", {
                  index: true,
                });
                route("deleted-budget", "routes/budgets/deleted.tsx", {
                  index: true,
                });
              });

              route("budget-reports", "routes/budget_reports/budget_reports.tsx", { index: true });

            });

            // WORKFLOW TRACKER
            route("workflow", "components/workflow_layout.tsx", () => {
              route("", "routes/workflow_dashboard/workflow_dashboard.tsx", { index: true });
              route("workflows", "routes/workflows/route.tsx", () => {
                route("", "routes/workflows/workflows.tsx", { index: true });
                route("assigned", "routes/workflows/assigned.tsx", {
                  index: true,
                });
              });
              route("workflow-tracker", "routes/workflow_tracker/workflow_tracker.tsx", { index: true });
            });
          });

          route("*", "routes/404Page/page_not_exist.tsx", { index: true });
        });
      },
    }),
    tsconfigPaths(),
  ],
});

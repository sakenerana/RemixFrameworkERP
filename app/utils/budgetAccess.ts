export const parseAccessList = (access: unknown): number[] => {
  if (Array.isArray(access)) {
    return access.map(Number).filter(Number.isFinite);
  }

  if (typeof access !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(access);
    return Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : [];
  } catch {
    return access
      .replace(/[{}[\]"]/g, "")
      .split(",")
      .map((value) => Number(value.trim()))
      .filter(Number.isFinite);
  }
};

export const canManageBudgetParticulars = (params: {
  access?: unknown;
  department?: unknown;
}) => {
  const department = String(params.department || "").trim().toLowerCase();

  return department === "finance" || department === "it" || department === "it department";
};

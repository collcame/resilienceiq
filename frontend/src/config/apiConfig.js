const readFlag = (value, fallback) => {
  if (value === undefined || value === "") {
    return fallback;
  }

  return value.toLowerCase() === "true";
};

export const apiConfig = {
  mockAccounts: readFlag(
    import.meta.env.VITE_MOCK_ACCOUNTS,
    false
  ),

  mockSimulation: readFlag(
    import.meta.env.VITE_MOCK_SIMULATION,
    false
  ),

  mockPlanning: readFlag(
    import.meta.env.VITE_MOCK_PLANNING,
    false
  ),
};
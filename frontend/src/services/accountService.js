
import axios from "axios";
import { mockAccounts } from "./mockAccounts";
import { apiConfig } from "../config/apiConfig";

export async function getAccount(accountId) {
  const id = Number(accountId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Please enter a valid account ID.");
  }

  // Use illustrative customer profiles while Member 2
  // develops the real banking-data API.
  if (apiConfig.mockAccounts) {
    const account = mockAccounts[id];

    if (!account) {
      throw new Error("Account not found in the demo dataset.");
    }

    return { ...account };
  }

  // Fetch the actual customer profile from FastAPI.
  try {
    const response = await axios.get(`/api/accounts/${id}`);

    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(`Account ${id} was not found.`);
    }

    throw new Error(
      "Unable to load the account. Please check the backend connection."
    );
  }
}

// Retain this export for compatibility with existing components.
export const isMockMode = apiConfig.mockAccounts;
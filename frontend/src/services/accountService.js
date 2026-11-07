
import axios from "axios";
import { mockAccounts } from "./mockAccounts";

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== "false";

export async function getAccount(accountId) {
  const id = Number(accountId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Please enter a valid account ID.");
  }

  if (USE_MOCK_DATA) {
    const account = mockAccounts[id];

    if (!account) {
      throw new Error("Account not found in the demo dataset.");
    }

    return { ...account };
  }

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

export const isMockMode = USE_MOCK_DATA;
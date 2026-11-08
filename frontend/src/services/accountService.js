import axios from "axios";
import { mockAccounts } from "./mockAccounts";
import { apiConfig } from "../config/apiConfig";

export async function getAccount(accountId) {
  const id = Number(accountId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Please enter a valid account ID.");
  }

  if (apiConfig.mockAccounts) {
    const account = mockAccounts[id];
    if (!account) {
      throw new Error("Account not found in the demo dataset.");
    }
    return { ...account };
  }

  try {
    const response = await axios.get(`http://localhost:8000/api/accounts/${id}`);
    return response.data;
  } catch (error) {
    // Log the exact error to your browser console (Press F12 -> Console)
    console.error("FULL AXIOS ERROR:", error);

    if (error.response) {
      // The server responded with a status code outside of 2xx
      throw new Error(`Server Error (${error.response.status}): ${error.response.data?.detail || "Unknown error"}`);
    } else if (error.request) {
      // The request was made but no response was received (Backend is down or blocked by CORS)
      throw new Error("No response from backend. Make sure FastAPI is running on port 8000.");
    } else {
      throw new Error(`Request setup error: ${error.message}`);
    }
  }
}

export const isMockMode = apiConfig.mockAccounts;

import axios from "axios";
import { apiConfig } from "../config/apiConfig";

export async function generateActionPlan(account, inputs, simulation) {
  if (!account) {
    throw new Error("Please select an account first.");
  }

  if (!simulation) {
    throw new Error("Please run a financial shock simulation first.");
  }

  if (apiConfig.mockPlanning) {
    return {
      status: "pending",
      source: "demo",
      recommendations: [],
      message:
        "The personalized planning engine is not yet connected.",
    };
  }

  try {
    const response = await axios.post("/api/plan", {
      account_id: account.account_id,
      ...inputs,
    });

    return response.data;
  } catch (error) {
    throw new Error(
      typeof error.response?.data?.detail === "string"
        ? error.response.data.detail
        : "Unable to generate an action plan. Check the backend connection."
    );
  }
}
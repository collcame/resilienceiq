
import axios from "axios";
import { apiConfig } from "../config/apiConfig";

export async function generateActionPlan(account, simulation) {
  if (!account) {
    throw new Error("Please select an account first.");
  }

  if (!simulation) {
    throw new Error("Please run a financial shock simulation first.");
  }

  const requestBody = {
    account_id: Number(account.account_id),
    monthly_shortfall: Number(simulation.monthly_shortfall),
    runway_months: Number(simulation.runway_months),
    buffer_left: Number(simulation.buffer_left),
  };

  if (
    !Number.isInteger(requestBody.account_id) ||
    !Number.isFinite(requestBody.monthly_shortfall) ||
    !Number.isFinite(requestBody.runway_months) ||
    !Number.isFinite(requestBody.buffer_left)
  ) {
    throw new Error("The simulation contains invalid values.");
  }

  if (apiConfig.mockPlanning) {
    return {
      status: "pending",
      source: "demo",
      urgency_level: null,
      recommended_actions: [],
      target_buffer: null,
      suggested_monthly_savings: null,
      message: "Planning engine integration pending.",
    };
  }

  try {
    const response = await axios.post("/api/plan", requestBody);

    const data = response.data;

    if (
      typeof data?.urgency_level !== "string" ||
      !Array.isArray(data.recommended_actions) ||
      !data.recommended_actions.every(
        (action) => typeof action === "string"
      ) ||
      !Number.isFinite(data.target_buffer) ||
      !Number.isFinite(data.suggested_monthly_savings)
    ) {
      throw new Error("Unexpected response from the planning API.");
    }

    return {
      ...data,
      status: "ready",
      source: "api",
    };
  } catch (error) {
    if (error.response?.status === 422) {
      throw new Error(
        "The planning API rejected the simulation data (HTTP 422)."
      );
    }

    throw new Error(
      error.message === "Unexpected response from the planning API."
        ? error.message
        : "Unable to generate an action plan. Check the backend connection."
    );
  }
}
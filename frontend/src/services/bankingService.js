
import api from "./api.js";

// Get logged-in user's account
export const getMyAccount = async () => {
  const response = await api.get("/accounts/me");
  return response.data;
};

// Get logged-in user's transactions
export const getTransactions = async () => {
  const response = await api.get("/transactions");
  return response.data;
};

// Get beneficiaries
export const getBeneficiaries = async () => {
  const response = await api.get("/beneficiaries");
  return response.data;
};

// Add a beneficiary
export const addBeneficiary = async (beneficiaryData) => {
  const response = await api.post(
    "/beneficiaries",
    beneficiaryData
  );

  return response.data;
};

// Get notifications
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

// Transfer money
export const transferMoney = async (transferData) => {
  const response = await api.post(
    "/transactions/transfer",
    transferData
  );

  return response.data;
};


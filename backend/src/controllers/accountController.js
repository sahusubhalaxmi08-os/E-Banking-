import asyncHandler from "../utils/asyncHandler.js";
import { getCustomerAccounts } from "../services/accountService.js";

export const getMyAccounts = asyncHandler(async (req, res) => {
  const accounts = await getCustomerAccounts(req.user._id);

  res.json({
    success: true,
    accounts,
  });
});
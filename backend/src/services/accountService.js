import Account from "../models/Account.js";
import ApiError from "../utils/ApiError.js";

export async function getCustomerAccounts(userId) {
const accounts = await Account.find({ owner: userId })
.sort({ createdAt: -1 })
.lean();

return accounts.map((account) => ({
...account,
id: account._id.toString(),
balance: account.balancePaise / 100,
accountType: account.accountType
? account.accountType.charAt(0).toUpperCase() +
account.accountType.slice(1)
: "Savings",
}));
}

export async function getOwnedAccount(userId, accountId) {
const account = await Account.findOne({
_id: accountId,
owner: userId,
});

if (!account) {
throw new ApiError(404, "Account not found.");
}

return account;
}


import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Account from "../models/Account.js";
import ApiError from "../utils/ApiError.js";
import { generateToken } from "../utils/generateToken.js";

function createAccountNumber() {
  return Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join("");
}

export function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export async function registerUser({ name, email, password }) {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.exists({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: "customer",
  });

  try {
    await Account.create({
      owner: user._id,
      accountNumber: createAccountNumber(),
      accountType: "savings",
      balancePaise: 0,
    });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw error;
  }

  return {
    user: publicUser(user),
    token: generateToken(user._id),
  };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordHash");

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.status !== "active") {
    throw new ApiError(403, "Your account is inactive.");
  }

  return {
    user: publicUser(user),
    token: generateToken(user._id),
  };
}


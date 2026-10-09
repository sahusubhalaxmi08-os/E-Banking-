
import { z } from "zod";

// Registration validation
export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name is required"),
    email: z.string().trim().email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  }),
});

// Login validation
export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Money transfer validation
export const transferSchema = z.object({
  body: z.object({
    fromAccount: z.string().min(1, "Source account is required"),
    beneficiaryAccount: z
      .string()
      .trim()
      .min(1, "Beneficiary account is required"),
    amount: z.coerce
      .number()
      .positive("Amount must be greater than zero")
      .max(1000000, "Transfer limit is ₹10,00,000"),
    note: z.string().max(200).optional(),
  }),
});

// Beneficiary validation
export const beneficiarySchema = z.object({
  body: z.object({
    accountNumber: z
      .string()
      .trim()
      .min(1, "Beneficiary account number is required"),
    nickname: z
      .string()
      .trim()
      .max(50, "Nickname cannot exceed 50 characters")
      .optional(),
  }),
});


export const profileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .optional(),
  }).refine(
    (data) => data.name !== undefined || data.email !== undefined,
    {
      message: "Provide at least one field to update",
    }
  ),
});
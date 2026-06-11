import { z } from 'zod'

// Zod v4 no longer coerces undefined → '' like v3 did. When a field is
// touched-and-blurred without any input, RHF passes undefined, which trips
// Zod's type guard before any .min() / .email() check runs — producing the
// raw "invalid input: expected string, received undefined" message.
// Wrapping every string schema in preprocess ensures the empty-string path
// hits our human-readable required/format errors instead.
const s = <T extends z.ZodTypeAny>(schema: T) => z.preprocess((v) => (v == null ? '' : v), schema)

// ─── Reusable field schemas ────────────────────────────────────────────────

const emailField = s(
  z
    .email('Please enter a valid email address')
    .min(1, 'Email is required')
    .transform((v: string) => v.toLowerCase().trim()),
)

const strongPasswordField = s(
  z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
)

// ─── Schemas ───────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailField,
  password: s(z.string().min(1, 'Password is required')),
})

export const registerSchema = z
  .object({
    name: s(
      z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be fewer than 50 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
        .transform((v: string) => v.trim()),
    ),
    email: emailField,
    password: strongPasswordField,
    confirmPassword: s(z.string().min(1, 'Please confirm your password')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailField,
})

// ─── Inferred types ────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

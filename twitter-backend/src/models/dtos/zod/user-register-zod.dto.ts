import { z } from 'zod';

export const UserRegistrationSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: 'Username must be at least 2 characters' })
      .max(20, { message: 'Username cannot exceed 20 characters' }),
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .regex(/^[^@]+@[^@]+\.[^@]+$/, { message: 'Email format is invalid' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characaters long' })
      .refine((val) => !val.includes('123'), {
        message: "Password cannot contain '123'",
      }),
    passwordRepeat: z
      .string()
      .min(6, { message: 'Password confirmation is required' }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordRepeat) {
      ctx.addIssue({
        path: ['passwordRepeat'],
        message: 'Passwords do not match',
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type UserRegistrationZodDto = z.infer<typeof UserRegistrationSchema>;

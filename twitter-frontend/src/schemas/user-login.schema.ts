import { z } from 'zod';

export const UserLoginSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .regex(/^[^@]+@[^@]+\.[^@]+$/, { message: 'Email format is invalid' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characaters long' }),
  })
  .required();

export type UserLoginZodDto = z.infer<typeof UserLoginSchema>;

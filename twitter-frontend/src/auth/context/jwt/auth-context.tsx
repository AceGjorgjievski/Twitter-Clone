'use client';

import { createContext } from 'react';

import { JWTContextType } from '@/auth/types';

// ----------------------------------------------------------------------

export const AuthContext = createContext({} as JWTContextType);

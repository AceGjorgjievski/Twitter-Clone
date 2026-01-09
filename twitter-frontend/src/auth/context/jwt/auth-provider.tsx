"use client";

import { useReducer, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./auth-context";
import { setSession, isValidToken } from "./utils";
import axiosInstance, { endpoints } from "@/utils/axios";
import { ActionMapType, AuthStateType, AuthUserType } from "@/auth/types";

enum Types {
  INITIAL = "INITIAL",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  LOGOUT = "LOGOUT",
}

type Payload = {
  [Types.INITIAL]: { user: AuthUserType | null };
  [Types.LOGIN]: { user: AuthUserType };
  [Types.REGISTER]: { user: AuthUserType };
  [Types.LOGOUT]: undefined;
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType): AuthStateType => {
  switch (action.type) {
    case Types.INITIAL:
      return { ...state, user: action.payload.user, loading: false };
    case Types.LOGIN:
      return { ...state, user: action.payload.user, loading: false };
    case Types.REGISTER:
      return { ...state, user: action.payload.user, loading: false };
    case Types.LOGOUT:
      return { ...state, user: null, loading: false };
    default:
      return state;
  }
};

const STORAGE_KEY = "accessToken";

type Props = { children: React.ReactNode };

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        const res = await axiosInstance.get(endpoints.auth.current);

        const user = res.data;

        dispatch({
          type: Types.INITIAL,
          payload: {
            user: {
              ...user,
              accessToken,
            },
          },
        });
      } else {
        dispatch({
          type: Types.INITIAL,
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: Types.INITIAL,
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await axiosInstance.post(endpoints.auth.login, {
      email,
      password,
    });
    const data = res.data;

    const token = data.token || data.accessToken;
    const user = data.user || data;

    if (!token) {
      throw new Error("No token received from server");
    }

    setSession(token);

    dispatch({
      type: Types.LOGIN,
      payload: { user: { ...user, accessToken: token } },
    });
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string, passwordRepeat: string) => {
      const res = await axiosInstance.post(endpoints.auth.register, {
        username,
        email,
        password,
        passwordRepeat
      });
      const data = res.data;

      const token = data.token || data.accessToken;
      const user = data.user || data;

      setSession(token);

      dispatch({
        type: Types.REGISTER,
        payload: { user: { ...user, accessToken: token } },
      });
    },
    []
  );

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({ type: Types.LOGOUT });
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: state.loading,
      authenticated: !!state.user,
      unauthenticated: !state.user,
      login,
      register,
      logout,
    }),
    [state.user, state.loading, login, register, logout]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import supabase from "~/utils/supabase.client";
import { message } from "antd";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<{ data: { user: User | null } | null; error: AuthError | null }>;
  signIn: (credentials: { email?: string; password?: string; phone?: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<{ user: User | null; error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setToken(data.session?.access_token ?? null);
      }
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      message.error((error as AuthError).message || "Sign up failed");
      return { data: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (credentials: { email?: string; password?: string; phone?: string }) => {
    setLoading(true);
    try {
      let error: AuthError | null = null;
      let sessionResult: Session | null = null;

      if (credentials.phone) {
        const { data, error: phoneError } = await supabase.auth.signInWithOtp({ phone: credentials.phone });
        sessionResult = data.session;
        error = phoneError;
      } else if (credentials.email && credentials.password) {
        const { data, error: emailError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password,
        });
        sessionResult = data.session;
        error = emailError;
      } else {
        throw new Error("Invalid credentials");
      }

      if (error) throw error;

      setSession(sessionResult);
      setUser(sessionResult?.user ?? null);
      setToken(sessionResult?.access_token ?? null);

      return { error: null };
    } catch (error) {
      message.error((error as AuthError).message || "Sign in failed");
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      setToken(null);
    } catch (error) {
      message.error((error as AuthError).message || "Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      message.success("Password reset email sent");
      return { error: null };
    } catch (error) {
      message.error((error as AuthError).message || "Reset failed");
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    token,
    loading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

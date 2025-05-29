import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User, AuthError } from "@supabase/supabase-js";
import supabase from "~/utils/supabase.client";
import { message } from "antd";
import { UserService } from "~/services/user.service";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ data: { user: User | null } | null; error: AuthError | null }>;
  signIn: (credentials: { email?: string; password?: string; phone?: string }) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  getUser: () => Promise<{ user: User | null; error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error getting initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

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
    try {
      setLoading(true);
      let error: AuthError | null = null;

      if (credentials.phone) {
        // Phone sign in logic
        const { error: phoneError } = await supabase.auth.signInWithOtp({
          phone: credentials.phone
        });
        error = phoneError;
      } else if (credentials.email && credentials.password) {
        // Email/password sign in
        const { error: emailError } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });
        error = emailError;
      } else {
        throw new Error("Invalid credentials provided");
      }

      if (error) throw error;

      return { error: null };
    } catch (error) {
      message.error((error as AuthError).message || "Sign in failed");
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      message.error((error as AuthError).message || "Sign out failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;

      message.success("Password reset email sent");
      return { error: null };
    } catch (error) {
      message.error((error as AuthError).message || "Password reset failed");
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

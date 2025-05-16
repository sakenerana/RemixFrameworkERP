import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabase from "~/utils/supabase.client";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: any, password: any) => Promise<{ error: any }>;
  signIn: (email: any, password: any, phone: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  getUser: () => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: any, password: any) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      console.log("account created");
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: any, password: any, phone: any) => {
    console.log("account signin");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        phone,
      });
      if (error) throw error;
      console.log("account signin");
      return { error: null };
    } catch (error) {
      console.log("sign in error", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    console.log("signout");
  };

  const resetPassword = async (email: any) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      console.log("reset password done");
      return { error: null };
    } catch (error) {
      console.log("reset password error");
      return { error };
    }
  };

  const getUser = async () => {
    try {
      const { error } = await supabase.auth.getUser();
      if (error) throw error;
      console.log("get user done");
      return { error: null };
    } catch (error) {
      console.log("get user error");
      return { error };
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

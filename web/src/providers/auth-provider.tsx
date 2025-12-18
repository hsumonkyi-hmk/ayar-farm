"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { initSocket, disconnectSocket } from "@/lib/socket";

type AuthContextType = {
  user: any;
  session: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  confirmation: (code: string, email?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setSession({ user: parsedUser, access_token: storedToken });
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (session?.access_token) {
      initSocket(session.access_token);
    }
  }, [session]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      setUser(user);
      setSession({ user, access_token: token });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      router.navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error("Error signing in", {
        description: error.message || "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: any) => {
    setIsLoading(true);
    try {
      // Backend expects: name, phone_number, email, password, user_type
      await api.post("/auth/register", data);

      if (data.email) {
        localStorage.setItem("pending_confirmation_email", data.email);
      }

      toast.success("Registration successful", {
        description: "Please check your email/phone for OTP",
      });

      router.navigate({ to: "/auth/confirm" });
    } catch (error: any) {
      toast.error("Error signing up", {
        description: error.message || "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      disconnectSocket();
      setUser(null);
      setSession(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.navigate({ to: "/login" });
    } catch (error: any) {
      toast.error("Error signing out", {
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmation = async (code: string, email?: string) => {
    setIsLoading(true);
    try {
      const targetEmail =
        email ||
        localStorage.getItem("pending_confirmation_email") ||
        user?.email;

      if (!targetEmail) {
        throw new Error("Email is required for verification");
      }

      const response = await api.post("/auth/verify", {
        email: targetEmail,
        code,
      });
      const { user: verifiedUser, token } = response.data;

      setUser(verifiedUser);
      setSession({ user: verifiedUser, access_token: token });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(verifiedUser));
      localStorage.removeItem("pending_confirmation_email");

      toast.success("Verification successful");
      router.navigate({ to: "/auth/success" });
    } catch (error: any) {
      toast.error("Verification failed", {
        description: error.message || "An unknown error occurred",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        confirmation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

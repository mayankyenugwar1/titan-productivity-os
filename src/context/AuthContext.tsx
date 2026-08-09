import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { parseAuthError, type FriendlyAuthResult } from "@/utils/authErrorHandler";

export interface AuthOperationResponse {
  data?: {
    user: User | null;
    session: Session | null;
    requiresVerification?: boolean;
  } | null;
  error?: FriendlyAuthResult | null;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthOperationResponse>;
  signUp: (
    fullName: string,
    username: string,
    email: string,
    password: string
  ) => Promise<AuthOperationResponse>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper timeout wrapper for network requests (15s deadline)
async function withTimeout<T>(promise: Promise<T>, timeoutMs = 15000): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("Authentication request timed out. Please try again."));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.warn("[TITAN AUTH] Initial session fetch warning:", err);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email: string, password: string): Promise<AuthOperationResponse> {
    try {
      const response = await withTimeout(
        supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })
      );

      if (response.error) {
        const friendly = parseAuthError(response.error, email);
        return { error: friendly };
      }

      if (response.data.session) {
        setSession(response.data.session);
        setUser(response.data.user ?? response.data.session.user ?? null);
        setLoading(false);
      }

      return {
        data: {
          user: response.data.user,
          session: response.data.session,
        },
        error: null,
      };
    } catch (err) {
      const friendly = parseAuthError(err, email);
      return { error: friendly };
    }
  }

  async function signUp(
    fullName: string,
    username: string,
    email: string,
    password: string
  ): Promise<AuthOperationResponse> {
    const cleanEmail = email.trim();
    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim();

    try {
      const response = await withTimeout(
        supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: cleanFullName,
              username: cleanUsername,
            },
          },
        })
      );

      if (response.error) {
        const friendly = parseAuthError(response.error, cleanEmail);
        return { error: friendly };
      }

      if (response.data.session) {
        setSession(response.data.session);
        setUser(response.data.user ?? response.data.session.user ?? null);
        setLoading(false);
      }

      // Check if email confirmation is enabled in Supabase
      const requiresVerification = Boolean(
        response.data.user && (!response.data.session || response.data.user.identities?.length === 0)
      );

      return {
        data: {
          user: response.data.user,
          session: response.data.session,
          requiresVerification,
        },
        error: null,
      };
    } catch (err) {
      const friendly = parseAuthError(err, cleanEmail);
      return { error: friendly };
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("[TITAN AUTH] SignOut warning:", err);
    } finally {
      setUser(null);
      setSession(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
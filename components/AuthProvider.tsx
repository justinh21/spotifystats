'use client';

import { createContext, useEffect } from "react";
import { Session, User } from "@supabase/auth-helpers-nextjs";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<{ user: User | null; session: Session | null }>({
    user: null,
    session: null,
  });

const AuthProvider = ({accessToken, children}: {accessToken: any, children: any}) => {
    const supabase = createClientComponentClient()
    const router = useRouter()

    useEffect(() => {
        const {
            data: {subscription: authListener},
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.access_token !== accessToken) {
                router.refresh()
            }
        })

        return () => {
            authListener?.unsubscribe();
        }
    }, [accessToken, supabase, router])

    return children
}

export default AuthProvider;
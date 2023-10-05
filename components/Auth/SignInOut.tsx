'use client'

import { Button } from "@nextui-org/button"
import { button as buttonStyles } from "@nextui-org/theme";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

import type { Session } from "@supabase/auth-helpers-nextjs";

export default function SignInOut({session}: {session:Session | null}) {
    const supabase = createClientComponentClient()
    const router = useRouter()

    const signOut = async() => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.log(error)
        }
        router.refresh()
    }

    const signIn = async() => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "spotify",
            options: {
                redirectTo: `http://localhost:3000/auth/callback`
            },
        })

        if (error) {
            console.log(error)
        }
        router.refresh()
    }

    return (
        <button
        // as={NextLink}
        onClick={session ? signOut : signIn}
        className={buttonStyles({ color: 'primary', radius: "full", variant: "shadow" })}
    >
        {session ? 'Logout' : 'Login'}
        </button>
    )
}
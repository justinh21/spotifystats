import { cookies } from "next/headers";
import SignInOut from "../../components/Auth/SignInOut";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "../../components/primitives";
import { Button } from "@nextui-org/button";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'

export default async function SignInPage() {
	const supabase = createServerComponentClient({ cookies })
	const {data} = await supabase.auth.getSession()

	if (data?.session) {
		redirect('/')
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Visualise your&nbsp;</h1>
				<h1 className={title({ color: "green" })}>Spotify&nbsp;</h1>
				<br />
				<h1 className={title()}>
					listening habits.
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Beautiful, fast and modern Spotify tracker.
				</h2>
			</div>

			<div className="flex gap-3">
				<SignInOut session={data?.session}/>
			</div>
		</section>
	);
}
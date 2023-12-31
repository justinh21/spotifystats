import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { cookies } from "next/headers";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "../components/primitives";
import { GithubIcon } from "../components/icons";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { redirect } from "next/navigation";
import TopArtists from "@/components/TopArtists";
import TopSongs from "@/components/TopSongs";
import TopAlbums from "@/components/TopAlbums";
import useSWR from "swr";

export const dynamic = 'force-dynamic'

export default async function Home() {
	const supabase = createServerComponentClient({ cookies })

	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/sign-in')
	}

	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
				<Avatar
					showFallback
					// name={user.user_metadata.name}
					src={user.user_metadata.avatar_url}
					size="lg"
				/>
				<h1>Welcome {user.user_metadata.full_name}!</h1>
			<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
				<div className="flex flex-col items-center gap-3">
					<TopAlbums/>
				</div>
				{/* <div className="flex flex-col items-center gap-3">
					<h1>Your Top Artists</h1>
					<TopArtists/>
				</div> */}
				{/* <div className="flex flex-col items-center gap-3">
					<h1>Your Top Songs</h1>
					<TopSongs/>
				</div> */}
			</div>
		</section>
	);
}

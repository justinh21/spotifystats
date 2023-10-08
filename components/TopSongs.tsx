"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";
import { getTopSongs } from "@/lib/spotify";
import useSWR from "swr";

export default function TopSongs() {
    const { data, error, isLoading } = useSWR('Get top songs', getTopSongs)

    if (error) {
        console.log(error)
        return <div>Failed to load</div>
    }

    if (isLoading) {
        return <div>Is loading..</div>
    }

    const rows = data.map((song: any, i: number) =>
                    <TableRow key={i}>
                    <TableCell>
                        <Avatar
                            showFallback
                            name={song.name}
                            src={song.album.images[0].url}
                            size="md"
                        />
                    </TableCell>
                    <TableCell>{`${song.name} - ${song.artists[0].name}`}</TableCell>
                    </TableRow>
                )
    return (
        <Table hideHeader aria-label="Top artists">
            <TableHeader>
                <TableColumn>Image</TableColumn>
                <TableColumn>Artist</TableColumn>
            </TableHeader>
            <TableBody>
                {rows}
            </TableBody>
        </Table>
    )
}
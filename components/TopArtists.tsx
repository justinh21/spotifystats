"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";
import { getTopArtists } from "@/lib/spotify";
import useSWR from "swr";

export default function TopArtists() {
    const { data, error, isLoading } = useSWR('Get top artists', getTopArtists)

    if (error) {
        console.log(error)
        return <div>Failed to load</div>
    }

    if (isLoading) {
        return <div>Is loading..</div>
    }
    
    const rows = data.map((artist: any, i: number) =>
                    <TableRow key={i}>
                    <TableCell>
                        <Avatar
                            showFallback
                            name={artist.name}
                            src={artist.images[0].url}
                            size="md"
                        />
                    </TableCell>
                    <TableCell>{artist.name}</TableCell>
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
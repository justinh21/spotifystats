"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";

export default function TopArtists({artists}: {artists: any}) {
    const rows = artists.map((artist: any, i: number) =>
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
"use client";

import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Avatar } from "@nextui-org/avatar";

export default function TopSongs({songs}: {songs: any}) {
    const rows = songs.map((song: any, i: number) =>
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
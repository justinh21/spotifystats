"use client";

import {Card, CardHeader, CardBody, CardFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Image} from "@nextui-org/react";
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
                    {/* <TableCell>
                        <Avatar
                            showFallback
                            name={artist.name}
                            src={artist.images[0].url}
                            size="md"
                        />
                    </TableCell> */}
                    <TableCell>
                        <Card isFooterBlurred>
                            <Image
                                alt={artist.name}
                                className="object-cover"
                                src={artist.images[0].url}
                                height={200}
                                width={200}
                            >
                            </Image>
                            <CardFooter className="text-white justify-center overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] ml-1 z-10">
                                {artist.name}
                            </CardFooter>
                        </Card>
                    </TableCell>
                    {/* <TableCell>{artist.name}</TableCell> */}
                    </TableRow>
                )
    return (
        <Table hideHeader aria-label="Top artists" classNames={{
            wrapper: "bg-transparent",
            }}>
            <TableHeader>
                <TableColumn>Image</TableColumn>
                {/* <TableColumn>Artist</TableColumn> */}
            </TableHeader>
            <TableBody>
                {rows}
            </TableBody>
        </Table>
    )
}
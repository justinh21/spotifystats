"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Image,
  Input
} from "@nextui-org/react";
import NextImage from "next/image"
import { Avatar } from "@nextui-org/avatar";
import { getSavedAlbums } from "@/lib/spotify";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";

export default function TopAlbums() {
  const [filterValue, setFilterValue] = useState("");
  const { data, error, isLoading } = useSWR("Get saved albums", getSavedAlbums);

  const hasSearchFilter = Boolean(filterValue)

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
  },[])

  const filteredItems = useMemo(() => {
    if (data) {
        let filteredAlbums = [...data];

        console.log(filteredAlbums)

        if (hasSearchFilter) {
            filteredAlbums = filteredAlbums.filter((item) =>
            item.album.name.toLowerCase().includes(filterValue.toLowerCase()),
          );
        }
    
        return filteredAlbums;
    }
  }, [data, filterValue, hasSearchFilter]);

  if (error) {
    console.log(error);
    return <div>Failed to load</div>;
  }

  if (isLoading) {
    return <div>Is loading..</div>;
  }

  const rows = filteredItems.map((item: any, i: number) =>
    <Card key={i} className="dark:bg-gray-600/30" isBlurred>
        <CardBody>
            <Image
            as={NextImage}
            alt={item.album.name}
            className="object-cover rounded-none drop-shadow"
            src={item.album.images[0].url}
            height={256}
            width={256}
            >
            </Image>
            <h3 className="font-semibold text-foreground/90 mt-2">{item.album.name}</h3>
            <p className="text-small text-foreground/80">
            {item.album.artists.length < 2 ? <>{item.album.artists[0].name}</> : <>{item.album.artists[0].name + " + ..."}</>}
            </p>
        </CardBody>
    </Card>
    );

  return (
    <div>
    <Input
        isClearable
        className="w-full sm:max-w-[35%] mb-4"
        placeholder="Search by name..."
        value={filterValue}
        onClear={() => onClear()}
        onValueChange={onSearchChange}
    />
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {rows}
    </div>
    </div>
  );
}

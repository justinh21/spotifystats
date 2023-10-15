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
  Input,
  Button,
  Skeleton
} from "@nextui-org/react";
import NextImage from "next/image"
import { Avatar } from "@nextui-org/avatar";
import { getSavedAlbums } from "@/lib/spotify";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { AlphaSortAscending, AlphaSortDescending } from "./icons";

export default function TopAlbums() {
  const [filterValue, setFilterValue] = useState("");
  const [sortAlpha, setSortAlpha] = useState(true)
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

  const onAlphaClick = useCallback(() => {
    setSortAlpha(!sortAlpha)
  },[sortAlpha])

  const filteredItems = useMemo(() => {
    if (data) {
        let filteredAlbums = [...data];

        console.log(filteredAlbums)

        if (hasSearchFilter) {
            filteredAlbums = filteredAlbums.filter((item) => {
              if (item.album.name.toLowerCase().includes(filterValue.toLowerCase())) {
                return true
              } else {
                for (const artist of item.album.artists) {
                  if (artist.name.toLowerCase().includes(filterValue.toLowerCase())) {
                    return true
                  }
                }
              }
            }
          );
        }

        if (sortAlpha) {
          filteredAlbums = filteredAlbums.sort((a,b) => a.album.name.localeCompare(b.album.name))
        } else {
          filteredAlbums = filteredAlbums.sort((a,b) => -1 * a.album.name.localeCompare(b.album.name))
        }

        return filteredAlbums;
    } else {
      let filteredAlbums = [null] 
      return filteredAlbums;
    }
  }, [data, filterValue, hasSearchFilter, sortAlpha]);

  if (error) {
    console.log(error);
    return <div>Failed to load</div>;
  }

  if (isLoading) {
    const placeholderCards = []

    for (let i = 0; i < 12; i++) {
      placeholderCards.push(
        <Skeleton className="rounded-b-lg">
        <Card>
            <Image
              disableSkeleton
              as={NextImage}
              alt="Placeholder"
              className="rounded-none drop-shadow"
              src=""
              width={256}
              height={256}
            />
        </Card>
        <div className="py-6 px-3">
          <h3 className="text-sm font-semibold text-foreground/90 mt-2 truncate"></h3>
          <p className="text-xs text-foreground/80"></p>
        </div>
      </Skeleton>
      )
    }

    return (
      <div>
        <div className="flex items-center gap-2 justify-between my-4">
          <Input
            isClearable
            className="w-full sm:max-w-[35%]"
            placeholder="Search by name..."
            value={filterValue}
            disabled={true}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            />
            { sortAlpha ? 
            <AlphaSortAscending
              className="text-default-600"
            /> :
            <AlphaSortDescending
            className="text-default-600"
            />
            }
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {placeholderCards}
        </div>
      </div>
    );
  }

  const rows = filteredItems.map((item: any, i: number) =>
    <Card key={i} className="dark:bg-gray-600/30 rounded-t-none" isBlurred>
        <CardBody className="pt-0 px-0 pb-3">
          <Image
            disableSkeleton
            as={NextImage}
            alt={item.album.name}
            className="rounded-none drop-shadow"
            src={item.album.images[0].url}
            width={256}
            height={256}
          />
            <div className="px-3">
              <h3 className="text-sm font-semibold text-foreground/90 mt-2 truncate">{item.album.name}</h3>
              <p className="text-xs text-foreground/80">
              {item.album.artists.length < 2 ? <>{item.album.artists[0].name}</> : <>{item.album.artists[0].name + " + ..."}</>}
              </p>
            </div>
        </CardBody>
    </Card>
    );

  return (
    <div>
    <div className="flex items-center gap-2 justify-between my-4">
      <Input
          isClearable
          className="w-full sm:max-w-[35%]"
          placeholder="Search by name..."
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
      />
      { sortAlpha ? 
      <AlphaSortAscending
        className="text-default-600 hover:text-primary cursor-pointer"
        onClick={onAlphaClick}
      /> :
      <AlphaSortDescending
      className="text-default-600 hover:text-primary cursor-pointer"
      onClick={onAlphaClick}
      />
      }
    </div>
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {rows}
    </div>
    </div>
  );
}

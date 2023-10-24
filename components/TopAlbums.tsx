"use client";

import {Input, Skeleton} from "@nextui-org/react";
import NextImage from "next/image"
import { Avatar } from "@nextui-org/avatar";
import { getSavedAlbums } from "@/lib/spotify";
import { useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { AlphaSortAscending, AlphaSortDescending } from "./icons";
import AlbumCard from "./Card";
import SkeletonAlbumCard from "./SkeletonCard";

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
        <SkeletonAlbumCard key={i}/>
      )
    }

    return (
      <div>
        <div className="flex items-center gap-2 justify-between my-4">
          <Skeleton className="rounded-xl w-full sm:w-[35%]">
            <div className="h-[40px]">Yooo</div>
          </Skeleton>
          <Skeleton className="rounded-full">
            <AlphaSortAscending/>
          </Skeleton>
        </div>
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {placeholderCards}
        </div>
      </div>
    );
  }

  const rows = filteredItems.map((item: any, i: number) =>
    <AlbumCard key={i} item={item}/>
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

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image,
    Skeleton
  } from "@nextui-org/react";
import NextImage from "next/image"

export default function SkeletonAlbumCard() {
    return (
        <Skeleton className="rounded-b-lg">
        <Card>
            <div className="w-[256px] h-[256px]"/>
        </Card>
        <div className="py-6 px-3">
        <h3 className="text-sm font-semibold text-foreground/90 mt-2 truncate"></h3>
        <p className="text-xs text-foreground/80"></p>
        </div>
    </Skeleton>
    )
}
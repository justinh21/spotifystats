import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Image
  } from "@nextui-org/react";
import NextImage from "next/image"
import useImageColour from "@/hooks/useImageColour";
import SkeletonAlbumCard from "./SkeletonCard";

export default function AlbumCard({item}: {item: any}) {
    const colour = useImageColour(item.album.images[0].url)
    
    return (
    <Card className="dark:bg-gray-600/30 rounded-t-none" isBlurred>
        <CardBody className="pt-0 px-0 pb-3">
          <Image
            disableSkeleton
            as={NextImage}
            alt={item.album.name}
            className='rounded-none drop-shadow border-4'
            style={{
              borderColor: `${colour}`
            }}
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
    )
}
import { Image } from "@unpic/react";
import type { ReactNode } from "react";

export function Showcase({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export function ShowcaseImage({
  src,
  alt = "",
  height,
}: {
  src: string;
  alt?: string;
  height: number;
}) {
  return (
    <div className="relative overflow-hidden md:rounded-lg">
      <Image
        alt="background-image"
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-cover md:block"
        draggable={false}
        height={1084}
        src="/showcase-background.png"
        width={1920}
      />
      <div className="absolute inset-0 hidden bg-bg-1/20 md:block" />
      <div className="relative flex justify-center md:p-4">
        <Image
          alt={alt}
          className="w-full shadow-2xl ring-1 ring-black/10"
          height={height}
          layout="fullWidth"
          src={src}
        />
      </div>
    </div>
  );
}

export function ShowcaseCaption({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-center font-normal">{children}</p>;
}

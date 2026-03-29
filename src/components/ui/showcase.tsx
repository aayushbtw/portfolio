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
    <div className="relative overflow-hidden rounded-2xl">
      <Image
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
        draggable={false}
        height={1084}
        src="/showcase-background.png"
        width={1920}
      />
      <div className="absolute inset-0 bg-bg-1/20" />
      <div className="relative flex justify-center px-6 py-6">
        <Image
          alt={alt}
          className="w-full shadow-2xl"
          height={height}
          layout="fullWidth"
          src={src}
        />
      </div>
    </div>
  );
}

export function ShowcaseCaption({ children }: { children: ReactNode }) {
  return <p className="mt-2 text-center text-sm">{children}</p>;
}

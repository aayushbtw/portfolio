import { Image } from "@unpic/react";

export function Showcase({
  src,
  alt = "",
  height,
}: {
  src: string;
  alt?: string;
  height: number;
}) {
  return (
    <div className="relative my-6 overflow-hidden rounded-2xl first:mt-0 last:mb-0">
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

import { Image } from "@unpic/react";

function ShowcaseImage({
  src,
  alt = "",
  height,
}: {
  src: string;
  alt?: string;
  height: number;
}) {
  return (
    <div className="relative overflow-hidden md:rounded-md">
      <Image
        alt=""
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover select-none md:block"
        draggable={false}
        height={1084}
        src="/showcase-background.png"
        width={1920}
      />
      <div className="bg-bg-1/20 absolute inset-0 hidden md:block" />
      <div className="md:p-md relative flex justify-center">
        <Image
          alt={alt}
          className="ring-fg-1/10 w-full shadow-2xl ring-1"
          height={height}
          layout="fullWidth"
          src={src}
        />
      </div>
    </div>
  );
}

export { ShowcaseImage };

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
    <Image
      alt={alt}
      className="ring-fg-1/10 w-full ring-1 md:rounded-md"
      height={height}
      layout="fullWidth"
      src={src}
    />
  );
}

export { ShowcaseImage };

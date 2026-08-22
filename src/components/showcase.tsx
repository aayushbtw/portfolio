import { Image } from "@unpic/react";

function Showcase({ className, ...props }: React.ComponentProps<"figure">) {
  return <figure className={className} data-slot="showcase" {...props} />;
}

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
        className="pointer-events-none absolute inset-0 hidden h-full w-full select-none object-cover md:block"
        draggable={false}
        height={1084}
        src="/showcase-background.png"
        width={1920}
      />
      <div className="absolute inset-0 hidden bg-bg-1/20 md:block" />
      <div className="relative flex justify-center md:p-md">
        <Image
          alt={alt}
          className="w-full shadow-2xl ring-1 ring-fg-1/10"
          height={height}
          layout="fullWidth"
          src={src}
        />
      </div>
    </div>
  );
}

function ShowcaseCaption({
  className,
  ...props
}: React.ComponentProps<"figcaption">) {
  return (
    <figcaption className={className} data-slot="showcase-caption" {...props} />
  );
}

export { Showcase, ShowcaseCaption, ShowcaseImage };

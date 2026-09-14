import { cn } from "~/lib/utils";

const LAYERS = [
  { blur: 1, transparent: 0 },
  { blur: 3, transparent: 33 },
  { blur: 8, transparent: 66 },
];

interface ProgressiveBlurProps {
  className?: string;
  position?: "top" | "bottom";
}

function ProgressiveBlur({
  className,
  position = "bottom",
}: ProgressiveBlurProps) {
  const direction = `to ${position}`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10 h-12",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      data-slot="progressive-blur"
    >
      {LAYERS.map(({ blur, transparent }, i) => {
        const maskImage = `linear-gradient(${direction}, transparent ${transparent}%, black 100%)`;

        return (
          <div
            className="absolute inset-0"
            key={blur}
            style={{
              WebkitBackdropFilter: `blur(${blur}px)`,
              WebkitMaskImage: maskImage,
              backdropFilter: `blur(${blur}px)`,
              maskImage,
              zIndex: i + 1,
            }}
          />
        );
      })}
    </div>
  );
}

export { ProgressiveBlur };

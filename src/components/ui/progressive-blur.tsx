import { cn } from "~/lib/utils";

const LAYERS = [
  { blur: 0.5, transparent: 0, black: 100 },
  { blur: 1, transparent: 20, black: 100 },
  { blur: 2, transparent: 40, black: 100 },
  { blur: 4, transparent: 60, black: 100 },
  { blur: 8, transparent: 80, black: 100 },
];

interface ProgressiveBlurProps {
  className?: string;
  position?: "top" | "bottom";
}

export function ProgressiveBlur({
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
    >
      {LAYERS.map(({ blur, transparent, black }, i) => {
        const maskImage = `linear-gradient(${direction}, transparent ${transparent}%, black ${black}%)`;
        return (
          <div
            className="absolute inset-0"
            key={blur}
            style={{
              zIndex: i + 1,
              backdropFilter: `blur(${blur}px)`,
              WebkitBackdropFilter: `blur(${blur}px)`,
              maskImage,
              WebkitMaskImage: maskImage,
            }}
          />
        );
      })}
    </div>
  );
}

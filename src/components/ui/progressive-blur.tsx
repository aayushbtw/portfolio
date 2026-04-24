import { cn } from "~/lib/utils";

const LAYER_COUNT = 8;
const MAX_BLUR = 8; // px
const STEP = 100 / LAYER_COUNT;

const blurLayers = Array.from({ length: LAYER_COUNT }, (_, i) => {
  const blur = MAX_BLUR / 2 ** (LAYER_COUNT - 1 - i);
  const start = i * STEP;

  const stops = [`transparent ${start}%`, `black ${start + STEP}%`];
  if (start + STEP * 2 <= 100) {
    stops.push(`black ${start + STEP * 2}%`);
  }
  if (start + STEP * 3 <= 100) {
    stops.push(`transparent ${start + STEP * 3}%`);
  }

  return { blur, stops, zIndex: i + 1 };
});

interface ProgressiveBlurProps {
  className?: string;
  position?: "top" | "bottom";
}

export function ProgressiveBlur({
  className,
  position = "bottom",
}: ProgressiveBlurProps) {
  const direction = position === "top" ? "to top" : "to bottom";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-x-0 z-10",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
    >
      <div className="relative h-12 overflow-hidden">
        {blurLayers.map(({ blur, stops, zIndex }) => {
          const maskImage = `linear-gradient(${direction}, ${stops.join(", ")})`;
          return (
            <div
              className="absolute inset-0"
              key={zIndex}
              style={{
                zIndex,
                backdropFilter: `blur(${blur}px)`,
                maskImage,
                WebkitMaskImage: maskImage,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

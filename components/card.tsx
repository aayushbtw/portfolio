import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-y-sm", className)} {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={className} {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"h1">) {
  return <h1 className={cn("heading", className)} {...props} />;
}

function CardDescription({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("subheading", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("paragraph flex flex-col gap-y-xs", className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent };

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { CraftCard } from "@/components/crafts/card/card";

export default function CraftsCard() {
  return (
    <Card>
      <CardContent>
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-card-secondary)_1px,transparent_1px)] bg-[size:10px_10px] bg-center" />
        <div className="relative py-10">
          <CraftCard />
        </div>
      </CardContent>
    </Card>
  );
}

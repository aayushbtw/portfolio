import { createFileRoute } from "@tanstack/react-router";
import { Box } from "~/components/primitives/box";
import { Text } from "~/components/primitives/text";
import {
  Meter,
  MeterLegend,
  type MeterSegment,
  type MeterShade,
  SHADE_COUNT,
} from "~/components/ui/meter";
import { PageHeader } from "~/components/ui/page-header";
import { Stat, StatStrip } from "~/components/ui/stat";
import { seo } from "~/lib/seo";
import usage from "~/lib/usage.json";
import {
  formatCompact,
  formatDate,
  formatNumber,
  formatShortDate,
} from "~/lib/utils";

const title = "Claude Usage";
const description = "How many tokens I’ve burned coding with Claude Code.";

export const Route = createFileRoute("/_app/usage")({
  head: () => seo({ title, description }),
  component: UsagePage,
});

function UsagePage() {
  return (
    <Box as="section">
      <PageHeader title={title}>
        <Text as="span" variant="label">
          ~ {formatNumber(usage.total)} tokens in {usage.year}
        </Text>
      </PageHeader>

      <StatStrip marginTop="lg">
        <TokenStat label="Input" value={usage.input} />
        <TokenStat label="Output" value={usage.output} />
        <TokenStat label="Cache write" value={usage.cacheWrite} />
        <TokenStat label="Cache read" value={usage.cacheRead} />
      </StatStrip>

      <Box marginTop="xl">
        <Text as="h2" variant="section-label">
          Last {usage.days.length} active days
        </Text>

        <Box display="flex" flexDirection="column" gap="sm" marginTop="sm">
          {usage.days.map((day) => {
            const segments = daySegments(day.models);

            return (
              <Box
                display="flex"
                flexDirection="column"
                gap="xs"
                key={day.date}
              >
                <Box
                  alignItems="baseline"
                  display="flex"
                  gap="md"
                  justifyContent="between"
                >
                  <Text as="span" color="fg-2">
                    {formatShortDate(day.date)}
                  </Text>
                  <Text as="span" numeric="tabular" variant="label">
                    {formatCompact(day.tokens)}
                  </Text>
                </Box>

                <Meter segments={segments} value={day.barWidth} />
                <MeterLegend segments={segments} />
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box display="flex" justifyContent="end" marginTop="lg">
        <Text numeric="tabular" variant="label">
          {formatNumber(usage.sessions)} sessions · updated{" "}
          {formatDate(usage.generatedAt)}
        </Text>
      </Box>
    </Box>
  );
}

// Shade by how much each model is used across the year, so a model keeps the
// same shade on every day's bar and the legends stay readable together.
function daySegments(
  models: { name: string; share: number }[]
): MeterSegment[] {
  return models.map((model) => {
    const rank = usage.models.findIndex((m) => m.name === model.name);
    const shade = Math.min(
      rank === -1 ? SHADE_COUNT - 1 : rank,
      SHADE_COUNT - 1
    ) as MeterShade;

    return { label: model.name, shade, share: model.share };
  });
}

// Share of the year's total is meaningful only to this page, so the arithmetic
// stays here and `Stat` stays a presentational primitive.
function TokenStat({ label, value }: { label: string; value: number }) {
  const share = (value / usage.total) * 100;

  return (
    <Stat
      detail={`${share < 1 ? "<1" : Math.round(share)}%`}
      label={label}
      value={formatCompact(value)}
    />
  );
}

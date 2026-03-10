"use client";

import { use } from "react";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { cn } from "@/lib/utils";

function GithubCalendar({
  contributions,
}: {
  contributions: Promise<Activity[]>;
}) {
  const data = use(contributions);

  return (
    <ContributionGraph
      blockMargin={2}
      blockRadius={3}
      blockSize={12}
      data={data}
    >
      <ContributionGraphCalendar
        className="no-scrollbar"
        title="GitHub Contributions"
      >
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            className={cn(
              'data-[level="0"]:fill-[#ebedf0]',
              'data-[level="1"]:fill-[#9be9a8]',
              'data-[level="2"]:fill-[#40c463]',
              'data-[level="3"]:fill-[#30a14e]',
              'data-[level="4"]:fill-[#216e39]'
            )}
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter>
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <p className="my-0! text-fg-3! text-sm!">
              {totalCount.toLocaleString("en")} contributions in {year}
            </p>
          )}
        </ContributionGraphTotalCount>

        {/* <ContributionGraphLegend /> */}
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}

function GithubCalendarFallback() {
  return <div className="h-36.5 animate-pulse rounded-xl bg-bg-2" />;
}

export { GithubCalendar, GithubCalendarFallback };

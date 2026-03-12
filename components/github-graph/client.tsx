"use client";

import { eachDayOfInterval, format, formatISO, parseISO } from "date-fns";
import { use, useMemo } from "react";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { ContributionsResponse, OctoResponse } from "@/lib/octo";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

function GithubGraphClient({
  contributions,
}: {
  contributions: Promise<OctoResponse<ContributionsResponse>>;
}) {
  const result = use(contributions);
  console.log({ trace: "octo-debug", source: "github-graph-client", ok: result.ok, hasData: result.ok && !!result.data });

  if (!result.ok) {
    return <GithubGraphClientError />;
  }

  const { contributions: data, total } = result.data;

  return (
    <ContributionGraph
      blockMargin={2}
      blockRadius={3}
      blockSize={12}
      data={data}
      totalCount={total}
    >
      <ContributionGraphCalendar className="no-scrollbar">
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger
              delay={10}
              render={
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
              }
            />
            <TooltipContent>
              {activity.count > 1 ? activity.count : "No"} contributions on{" "}
              {format(parseISO(activity.date), "do MMMM")}
            </TooltipContent>
          </Tooltip>
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
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}

function GithubGraphClientFallback() {
  const placeholder = useMemo(() => {
    const year = new Date().getFullYear() - 1;
    return eachDayOfInterval({
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31),
    }).map(
      (day): Activity => ({
        count: 0,
        date: formatISO(day, { representation: "date" }),
        level: 0,
      })
    );
  }, []);

  return (
    <ContributionGraph
      blockMargin={2}
      blockRadius={3}
      blockSize={12}
      data={placeholder}
    >
      <ContributionGraphCalendar className="no-scrollbar">
        {({ activity, dayIndex, weekIndex }) => (
          <ContributionGraphBlock
            activity={activity}
            className='animate-pulse data-[level="0"]:fill-[#ebedf0]'
            dayIndex={dayIndex}
            weekIndex={weekIndex}
          />
        )}
      </ContributionGraphCalendar>

      <ContributionGraphFooter>
        <span className="h-5 w-45 animate-pulse rounded bg-bg-2" />
      </ContributionGraphFooter>
    </ContributionGraph>
  );
}

function GithubGraphClientError() {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-xs">
        <GithubGraphClientFallback />
      </div>
      <p className="absolute inset-0 flex items-center justify-center text-fg-3 text-sm">
        Failed to load contributions.
      </p>
    </div>
  );
}
export { GithubGraphClient, GithubGraphClientFallback };

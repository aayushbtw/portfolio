"use client";

import { eachDayOfInterval, format, formatISO, parseISO } from "date-fns";
import { useMemo } from "react";
import useSWR from "swr";
import type { Activity } from "@/components/kibo-ui/contribution-graph";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import { type ContributionsResponse, fetcher, octo } from "@/lib/octo";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const lastYear = new Date().getFullYear() - 1;

function GithubGraph() {
  const { data, error, isLoading } = useSWR(
    octo.contributions(lastYear),
    fetcher<ContributionsResponse>,
    { revalidateOnFocus: false, dedupingInterval: 86_400_000 }
  );

  if (isLoading) {
    return <GithubGraphFallback />;
  }

  if (error || !data) {
    return <GithubGraphError />;
  }

  return (
    <div className="mt-[1.6em]">
      <ContributionGraph
        blockMargin={2}
        blockRadius={3}
        blockSize={12}
        data={data.contributions}
        totalCount={data.total}
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
    </div>
  );
}

function GithubGraphFallback() {
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
    <div className="mt-[1.6em]">
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
    </div>
  );
}

function GithubGraphError() {
  return (
    <div className="relative mt-[1.6em]">
      <div className="pointer-events-none select-none blur-xs">
        <GithubGraphFallback />
      </div>
      <p className="absolute inset-0 flex items-center justify-center text-fg-3 text-sm">
        Failed to load contributions.
      </p>
    </div>
  );
}

export { GithubGraph };

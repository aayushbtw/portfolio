import { format, parseISO } from "date-fns";
import {
  ContributionGraph,
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphTotalCount,
} from "@/components/kibo-ui/contribution-graph";
import type { ContributionsResponse } from "@/lib/octo";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

function GithubGraph({ data }: { data: ContributionsResponse }) {
  return (
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
  );
}

export { GithubGraph };

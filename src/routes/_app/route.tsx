import * as stylex from "@stylexjs/stylex";
import { useHotkeySequences } from "@tanstack/react-hotkeys";
import type { Hotkey } from "@tanstack/react-hotkeys";
import type { LinkProps } from "@tanstack/react-router";
import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { BackLink } from "~/components/back-link";
import { useRightColumn } from "~/components/layout-provider";
import { ProgressiveBlur } from "~/components/ui/progressive-blur";
import { useHaptics } from "~/lib/haptics";
import { layout, media, space } from "~/styles/tokens.stylex";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const destinations: { key: Hotkey; to: LinkProps["to"] }[] = [
  { key: "H", to: "/" },
  { key: "W", to: "/writings" },
  { key: "S", to: "/skills" },
  { key: "E", to: "/explorations" },
  { key: "M", to: "/music" },
  { key: "U", to: "/usage" },
];

function useHotkeys() {
  const navigate = useNavigate();
  const { trigger } = useHaptics();

  useHotkeySequences(
    destinations.map((destination) => ({
      sequence: ["G", destination.key],
      callback: () => {
        trigger("click");
        void navigate({ to: destination.to });
      },
    }))
  );
}

const sticky = {
  alignSelf: { default: null, [media.lg]: "start" },
  position: { default: null, [media.lg]: "sticky" },
  top: { default: null, [media.lg]: 0 },
} as const;

const styles = stylex.create({
  frame: {
    columnGap: layout.columnGap,
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      [media.lg]: `1fr minmax(0, ${layout.content}) 1fr`,
    },
    paddingInline: layout.gutter,
  },
  back: {
    ...sticky,
    justifySelf: { default: null, [media.lg]: "end" },
    paddingTop: { default: space.xl, [media.lg]: layout.pageTop },
  },
  main: {
    marginInline: "auto",
    maxWidth: layout.content,
    minWidth: 0,
    paddingBottom: layout.pageBottom,
    paddingTop: { default: space.lg, [media.lg]: layout.pageTop },
    width: "100%",
  },
  right: {
    ...sticky,
    display: { default: "none", [media.lg]: "flex" },
    flexDirection: "column",
    gap: layout.sectionGap,
    paddingTop: layout.pageTop,
  },
});

function AppLayout() {
  const right = useRightColumn();
  useHotkeys();

  return (
    <>
      <ProgressiveBlur position="top" />

      <div {...stylex.props(styles.frame)}>
        <div {...stylex.props(styles.back)}>
          <BackLink />
        </div>

        <main id="main" {...stylex.props(styles.main)}>
          <Outlet />
        </main>

        <div {...stylex.props(styles.right)}>{right}</div>
      </div>

      <ProgressiveBlur />
    </>
  );
}

import * as stylex from "@stylexjs/stylex";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Box } from "~/components/primitives/box";
import { Icon } from "~/components/primitives/icon";
import type { StyleProp } from "~/components/primitives/style-prop";
import { Text } from "~/components/primitives/text";
import { useHaptics } from "~/lib/haptics";
import { background, foreground } from "~/styles/tokens/color.stylex";

const RESET_DELAY = 1500;

const styles = stylex.create({
  command: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    minWidth: 0,
    overflowX: "auto",
    whiteSpace: "nowrap",
  },
  // The prompt is decoration, not part of what you copy.
  prompt: { userSelect: "none" },
  copyButton: {
    color: {
      default: foreground["fg-3"],
      ":hover": foreground["fg-2"],
    },
    scale: { default: "1", ":active": "0.96" },
    transitionProperty: "color, scale",
    transitionDuration: "150ms",
    borderStyle: "none",
    background: "none",
    cursor: "pointer",
  },
  link: {
    textDecorationLine: "none",
    color: foreground["fg-2"],
    backgroundColor: {
      default: background["bg-1"],
      ":hover": background["bg-2"],
    },
    scale: { default: "1", ":active": "0.98" },
    transitionProperty: "background-color, scale",
    transitionDuration: "150ms",
  },
});

function Install({
  command,
  children,
  marginTop,
}: {
  command: string;
  children?: React.ReactNode;
  marginTop?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <Box
      backgroundColor="bg-2-soft"
      borderColor="default"
      borderRadius="md"
      data-not-typeset
      display="flex"
      flexDirection="column"
      gap="xs"
      marginTop={marginTop}
      padding="xs"
    >
      <InstallCommand command={command} />

      {children ? (
        <Box display="flex" gap="xs">
          {children}
        </Box>
      ) : null}
    </Box>
  );
}

function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);
  const { trigger } = useHaptics();

  useEffect(() => () => clearTimeout(timeout.current ?? undefined), []);

  async function copy() {
    await navigator.clipboard.writeText(command);
    trigger("click");
    setCopied(true);
    clearTimeout(timeout.current ?? undefined);
    timeout.current = setTimeout(() => setCopied(false), RESET_DELAY);
  }

  return (
    <Box
      alignItems="center"
      backgroundColor="bg-1"
      borderColor="default"
      borderRadius="sm"
      display="flex"
      gap="md"
    >
      <Text as="code" style={styles.command} translate="no" variant="mono">
        <Text as="span" color="fg-3" style={styles.prompt} variant="mono">
          {"$ "}
        </Text>
        {command}
      </Text>

      <Box
        aria-label={copied ? "Copied" : "Copy command"}
        as="button"
        borderRadius="sm"
        onClick={copy}
        padding="xs"
        style={styles.copyButton}
        type="button"
      >
        <Icon
          as={copied ? IconCheck : IconCopy}
          color={copied ? "brand" : undefined}
          size="md"
        />
      </Box>
    </Box>
  );
}

function InstallLink({
  children,
  href,
  style,
}: {
  children: React.ReactNode;
  href: string;
  style?: StyleProp;
}) {
  return (
    <Box
      alignItems="center"
      as="a"
      borderColor="default"
      borderRadius="sm"
      display="flex"
      flex="1"
      gap="xs"
      href={href}
      justifyContent="center"
      paddingBlock="sm"
      rel="noopener"
      style={[styles.link, style]}
      target="_blank"
    >
      {children}
    </Box>
  );
}

export { Install, InstallLink };

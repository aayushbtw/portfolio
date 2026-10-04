import type { ComponentType } from "react";

import { ChatInput } from "~/components/explorations/chat-input";

const explorations = {
  "chat-input": ChatInput,
} satisfies Record<string, ComponentType>;

function isExploration(name: string): name is keyof typeof explorations {
  return Object.hasOwn(explorations, name);
}

export { explorations, isExploration };

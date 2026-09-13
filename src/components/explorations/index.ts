import type { ComponentType } from "react";

import { ChatInput } from "~/components/explorations/chat-input";

const explorations: Record<string, ComponentType> = {
  "chat-input": ChatInput,
};

export { explorations };

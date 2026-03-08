import { OG_CONTENT_TYPE, OG_SIZE, OGImage } from "@/components/og-image";
import { content } from "./_content";

export const alt = content.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return OGImage({
    title: content.title,
    description: content.description,
  });
}

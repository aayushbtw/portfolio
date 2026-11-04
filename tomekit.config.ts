import type { ComponentNode } from "@tanstack/markdown";
import { commentComponentsExtension } from "@tanstack/markdown/extensions/comment-components";
import { headingCollectionExtension } from "@tanstack/markdown/extensions/headings";
import { parseMarkdown } from "@tanstack/markdown/parser";
import { defineConfig, directory } from "tomekit";
import type {
  Entry,
  FileInfo,
  LoadIssue,
  Source,
  TransformContext,
} from "tomekit";
import { z } from "zod";

// A comment component with no `tagName` renders as one generic element for every
// name, so the components map cannot tell `showcase` from `showcase-image`.
// Naming the tag is what makes it addressable.
function transformComponent(node: ComponentNode): ComponentNode {
  return { ...node, properties: node.attributes, tagName: `md-${node.name}` };
}

const extensions = [
  commentComponentsExtension({ transformComponent }),
  headingCollectionExtension(),
];

function parse<TMetadata extends object>(
  { body, metadata, slug }: Source<TMetadata>,
  { collection }: TransformContext
) {
  const document = parseMarkdown(body, { extensions, headingIds: true });

  return {
    body: document,
    metadata: {
      ...metadata,
      headings: (document.headings ?? []).filter((h) => h.level === 2),
      url: `/${collection}/${slug}`,
    },
  };
}

const posts = directory("content/posts");

const seriesFields = z.object({ part: z.number(), series: z.string() });

// The schema sees one file at a time, so a repeated or skipped part number,
// which would make "Part N of M" wrong, can only be caught across the folder.
function seriesIssues(entries: readonly Entry<FileInfo>[]): LoadIssue[] {
  const parts = entries.flatMap(({ file, metadata }) => {
    const fields = seriesFields.safeParse(metadata);

    return fields.success ? [{ ...fields.data, file: file?.path }] : [];
  });

  return [...Map.groupBy(parts, (p) => p.series)].flatMap(([series, group]) => {
    const sorted = group.toSorted((a, b) => a.part - b.part);
    const wrong = sorted.find((p, i) => p.part !== i + 1);

    return wrong
      ? [
          {
            file: wrong.file,
            message: `series "${series}" has parts ${sorted.map((p) => p.part).join(", ")}. Number its parts 1 to ${sorted.length}, each once`,
          },
        ]
      : [];
  });
}

export default defineConfig({
  collections: {
    explorations: {
      loader: directory("content/explorations"),
      schema: z.strictObject({
        description: z.string(),
        draft: z.boolean().default(false),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: (source, context) =>
        source.metadata.draft && !context.dev
          ? context.skip("draft")
          : parse(source, context),
    },
    skills: {
      loader: directory("content/skills"),
      schema: z.strictObject({
        category: z.string(),
        description: z.string(),
        publishedAt: z.iso.date(),
        title: z.string(),
      }),
      transform: parse,
    },
    writings: {
      loader: {
        load: async (context) => {
          const result = await posts.load(context);

          return {
            ...result,
            issues: [...(result.issues ?? []), ...seriesIssues(result.entries)],
          };
        },
      },
      schema: z
        .strictObject({
          description: z.string(),
          image: z.string().optional(),
          modifiedAt: z.iso.date().optional(),
          part: z.int().positive().optional(),
          publishedAt: z.iso.date(),
          series: z.string().min(1).optional(),
          title: z.string(),
        })
        .transform(({ part, series, ...metadata }, context) => {
          if ((part === undefined) !== (series === undefined)) {
            const [present, missing] =
              part === undefined ? ["series", "part"] : ["part", "series"];

            context.issues.push({
              code: "custom",
              input: { part, series },
              message: `needs ${missing} too. Set both, or neither`,
              path: [present],
            });
          }

          return {
            ...metadata,
            series:
              part === undefined || series === undefined
                ? undefined
                : { part, title: series },
          };
        }),
      transform: parse,
    },
  },
});

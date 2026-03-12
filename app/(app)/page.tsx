import Link from "next/link";
import { GithubGraph } from "@/components/github-graph";
import { ListPosts } from "@/components/list-posts";
import { ListProjects } from "@/components/list-projects";
import { config } from "@/lib/config";
import { generateMetadata } from "@/lib/utils";
import { content } from "./_content";

export const metadata = generateMetadata({
  title: content.title,
  description: content.description,
  url: content.url,
});

export default function HomePage() {
  return (
    <>
      <h1>{content.title}</h1>
      <p>
        {content.description} Full-stack engineer at{" "}
        <Link
          href={`https://www.netision.com/?utm_source=${config.domain}`}
          rel="noopener"
          target="_blank"
        >
          Netision
        </Link>
        .
      </p>

      <GithubGraph />

      <h3 data-title>Projects</h3>
      <ListProjects />

      <h3 data-title>Writings</h3>
      <ListPosts limit={5} />
    </>
  );
}

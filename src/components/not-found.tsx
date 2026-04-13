import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <div className="mx-auto px-6 py-12 sm:py-20">
      <div className="flex h-[calc(100vh-12rem)] w-full flex-col items-center justify-center">
        <h1 className="mb-3 font-medium text-3xl text-fg-1 capitalize">
          page not found
        </h1>
        <p className="my-0 text-base text-fg-2">
          This page doesn't exist or has been moved.
        </p>
        <Link
          className="mt-5 rounded-xl px-4 py-1 outline transition-colors duration-300 hover:text-fg-1"
          to="/"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}

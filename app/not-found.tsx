import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center pb-10">
      <h1 className="font-medium text-3xl text-fg-1 capitalize">
        page not found
      </h1>

      <p className="mt-3 text-fg-2">
        This page doesn't exist or has been moved.
      </p>

      <Link
        className="mt-5 rounded-xl px-4 py-1 outline transition-all duration-300 hover:text-fg-1"
        href="/"
      >
        Go Home
      </Link>
    </div>
  );
}

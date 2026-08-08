import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>404 | Ritual Agent Hub</title>
        <meta name="description" content="Page not found on Ritual Agent Hub." />
      </Helmet>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#09090B] px-6 text-center text-white">
        <SearchX size={64} className="text-emerald-500" />
        <h1 className="mt-8 text-6xl font-black">404</h1>
        <p className="mt-4 text-xl text-zinc-400">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-2xl bg-emerald-500 px-8 py-4 font-semibold text-black transition hover:bg-emerald-400"
        >
          Back Home
        </Link>
      </main>
    </>
  );
}

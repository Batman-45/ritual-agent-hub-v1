import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { supabase } from "../services/supabase";

export default function FeaturedBuilders() {
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBuilders() {
      const { data, error } = await supabase
        .from("Builders")
        .select("*")
        .limit(6);

      if (!error) {
        setBuilders(data || []);
      }

      setLoading(false);
    }
    loadBuilders();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-4xl font-black">
              Featured Builders
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1,2,3].map((i)=>(
              <div
                key={i}
                className="h-72 animate-pulse rounded-3xl bg-zinc-900"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12">

          <p className="font-semibold text-emerald-400">
            COMMUNITY
          </p>

          <h2 className="mt-2 text-5xl font-black">
            Featured Builders
          </h2>

          <p className="mt-3 max-w-2xl text-zinc-400">
            Meet the developers building the future of AI on Ritual.
          </p>

        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {builders.map((builder) => {

            const initials =
              builder.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

            return (

              <div
                key={builder.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8 transition hover:-translate-y-2 hover:border-emerald-500"
              >

                {builder.avatar ? (

                  <img
                    src={builder.avatar}
                    alt={builder.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />

                ) : (

                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-2xl font-black text-black">
                    {initials}
                  </div>

                )}

                <div className="mt-6">

                  <div className="flex items-center gap-2">

                    <h3 className="text-2xl font-bold">
                      {builder.name}
                    </h3>

                    {builder.verified && (
                      <CheckCircle
                        size={20}
                        className="text-emerald-400"
                      />
                    )}

                  </div>

                  <p className="mt-3 h-12 text-sm text-zinc-400">
                    {builder.bio || "Ritual ecosystem builder"}
                  </p>

                </div>

                <Link
                  to={`/builder/${builder.id}`}
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  View Profile

                  <ArrowRight size={18} />
                </Link>

              </div>

            );

          })}

        </div>

      </div>

    </section>
  );
}
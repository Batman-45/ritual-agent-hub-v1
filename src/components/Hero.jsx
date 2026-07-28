import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Cpu,
} from "lucide-react";

import LiveStats from "./LiveStats";
import logo from "../assets/ritual-logo.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#09090B]">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute inset-0 bg-[#09090B]" />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
          className="absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[150px]"
        />

        <motion.div
          animate={{
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
          }}
          className="absolute left-20 top-40 h-56 w-56 rounded-full bg-cyan-500/10 blur-[120px]"
        />

        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
          }}
          className="absolute right-20 bottom-20 h-72 w-72 rounded-full bg-purple-500/10 blur-[120px]"
        />

      </div>

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg,#fff 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl items-center px-6">

        <div className="grid w-full items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >

            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2">

              <img
                src={logo}
                alt="Ritual"
                className="h-6 w-6 rounded-full"
              />

              <span className="text-sm font-semibold text-emerald-400">
                Built for the Ritual Ecosystem
              </span>

            </div>

            <h1 className="text-6xl font-black leading-tight text-white xl:text-8xl">

              Discover

              <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">

                AI Projects

              </span>

              Built on Ritual

            </h1>

            <p className="mt-8 max-w-xl text-lg leading-8 text-zinc-400">

              Explore innovative AI agents, decentralized applications,
              infrastructure and developer tools powering the Ritual ecosystem.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                to="/submit"
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4 font-bold text-black transition hover:scale-105"
              >
                Submit Project
                <ArrowRight size={18} />
              </Link>

              <a
                href="#projects"
                className="rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-semibold transition hover:border-emerald-400"
              >
                Explore Projects
              </a>

            </div>

            <LiveStats />

          </motion.div>
                    {/* RIGHT */}

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >

            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              className="overflow-hidden rounded-[36px] border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-xl"
            >

              <div className="h-56 bg-gradient-to-br from-emerald-400 via-cyan-400 to-purple-500" />

              <div className="p-8">

                <div className="mb-6 flex items-center gap-4">

                  <img
                    src={logo}
                    alt="Ritual"
                    className="h-20 w-20 rounded-3xl bg-white p-3"
                  />

                  <div>

                    <h2 className="text-3xl font-black text-white">
                      Ritual Directory
                    </h2>

                    <p className="text-zinc-400">
                      Discover the Ritual Ecosystem
                    </p>

                  </div>

                </div>

                <p className="leading-8 text-zinc-400">
                  Browse AI agents, decentralized applications,
                  infrastructure, developer tools and open-source
                  projects built on Ritual.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">

                  <div className="rounded-2xl bg-zinc-800 p-4 text-center">

                    <h3 className="text-2xl font-bold text-emerald-400">
                      250+
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Projects
                    </p>

                  </div>

                  <div className="rounded-2xl bg-zinc-800 p-4 text-center">

                    <h3 className="text-2xl font-bold text-cyan-400">
                      50K+
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Views
                    </p>

                  </div>

                  <div className="rounded-2xl bg-zinc-800 p-4 text-center">

                    <h3 className="text-2xl font-bold text-pink-400">
                      8K+
                    </h3>

                    <p className="mt-1 text-xs text-zinc-500">
                      Likes
                    </p>

                  </div>

                </div>

              </div>

            </motion.div>

            <motion.div
              animate={{
                y: [0, 15, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="absolute -bottom-8 -left-8 hidden rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 backdrop-blur-xl lg:block"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-emerald-500/20 p-4">

                  <Cpu
                    size={30}
                    className="text-emerald-400"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-white">
                    AI Infrastructure
                  </h3>

                  <p className="text-sm text-zinc-500">
                    Secure • Decentralized • Scalable
                  </p>

                </div>

              </div>

            </motion.div>

          </motion.div>

        </div>

      </div>

      <motion.div
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >

        <ChevronDown
          size={36}
          className="text-zinc-500"
        />

      </motion.div>

    </section>
  );
}
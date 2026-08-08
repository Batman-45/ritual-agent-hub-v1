import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
} from "lucide-react";

import LiveStats from "./LiveStats";
import logo from "../assets/ritual-logo.png";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#09090B] py-20">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#09090B]" />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute left-1/2 top-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[150px]"
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2">
            <img src={logo} alt="Ritual" className="h-6 w-6 rounded-full" />
            <span className="text-sm font-semibold text-emerald-400">
              Ritual Ecosystem Explorer
            </span>
          </div>

          <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl xl:text-8xl">
            Discover
            <span className="block bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 bg-clip-text text-transparent">
              AI Agent Projects
            </span>
            Built on Ritual
          </h1>

          <p className="mt-8 max-w-2xl mx-auto text-lg leading-8 text-zinc-400">
            Explore innovative AI agents, decentralized applications,
            infrastructure and developer tools powering the Ritual ecosystem.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href="#projects"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-8 py-4 font-bold text-black transition hover:scale-105"
            >
              Explore Projects
              <ArrowRight size={18} />
            </a>
            <Link
              to="/builders"
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-8 py-4 font-semibold text-white transition hover:border-emerald-400"
            >
              View Builders
            </Link>
          </div>

          <div className="mt-16">
            <LiveStats />
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ChevronDown size={36} className="text-zinc-500" />
      </motion.div>
    </section>
  );
}
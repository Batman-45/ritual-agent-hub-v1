import { motion } from "framer-motion";

export default function StatsCard({
  icon,
  value,
  label,
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-xl transition-colors hover:border-emerald-500"
    >
      <div className="mb-4 text-emerald-400">
        {icon}
      </div>

      <h2 className="text-4xl font-black">
        {value}
      </h2>

      <p className="mt-2 text-zinc-400">
        {label}
      </p>
    </motion.div>
  );
}
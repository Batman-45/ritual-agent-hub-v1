import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Boxes, Users, Layers } from "lucide-react";
import { supabase } from "../services/supabase";

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [data, setData] = useState({ projects: [], builders: [], categories: [] });

  useEffect(() => {
    async function loadData() {
      const { data: projects } = await supabase.from("Projects").select("id, name, builder, category");
      if (projects) {
        const uniqueBuilders = [...new Set(projects.map((p) => p.builder).filter(Boolean))];
        const uniqueCategories = [...new Set(projects.map((p) => p.category).filter(Boolean))];
        setData({ projects, builders: uniqueBuilders, categories: uniqueCategories });
      }
    }
    if (isOpen) loadData();
  }, [isOpen]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  const runCommand = (command) => {
    command();
    onClose(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Command.Dialog
          open={isOpen}
          onOpenChange={onClose}
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-12"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => onClose(false)}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl"
          >
            <Command className="p-2">
              <div className="flex items-center border-b border-zinc-800 px-3">
                <Search className="mr-2 text-zinc-500" size={20} />
                <Command.Input
                  autoFocus
                  placeholder="Search projects, builders, categories..."
                  value={query}
                  onValueChange={setQuery}
                  className="h-14 w-full border-0 bg-transparent text-white placeholder-zinc-500 outline-none focus:ring-0"
                />
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto p-2">
                <Command.Empty className="p-4 text-center text-zinc-500">No results found.</Command.Empty>
                
                <Command.Group heading="Projects" className="px-2 py-1.5 text-xs text-zinc-500 font-semibold">
                  {data.projects.map((p) => (
                    <Command.Item
                      key={p.id}
                      onSelect={() => runCommand(() => navigate(`/project/${p.id}`))}
                      className="flex cursor-pointer items-center gap-3 rounded-xl p-3 text-sm text-zinc-300 aria-selected:bg-zinc-800 aria-selected:text-white"
                    >
                      <Boxes size={16} /> {p.name}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Builders" className="px-2 py-1.5 text-xs text-zinc-500 font-semibold">
                  {data.builders.map((b) => (
                    <Command.Item
                      key={b}
                      onSelect={() => runCommand(() => navigate(`/builder/${encodeURIComponent(b)}`))}
                      className="flex cursor-pointer items-center gap-3 rounded-xl p-3 text-sm text-zinc-300 aria-selected:bg-zinc-800 aria-selected:text-white"
                    >
                      <Users size={16} /> {b}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Categories" className="px-2 py-1.5 text-xs text-zinc-500 font-semibold">
                  {data.categories.map((c) => (
                    <Command.Item
                      key={c}
                      onSelect={() => runCommand(() => navigate(`/search?category=${encodeURIComponent(c)}`))}
                      className="flex cursor-pointer items-center gap-3 rounded-xl p-3 text-sm text-zinc-300 aria-selected:bg-zinc-800 aria-selected:text-white"
                    >
                      <Layers size={16} /> {c}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </Command.Dialog>
      )}
    </AnimatePresence>
  );
}
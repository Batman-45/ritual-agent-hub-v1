import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        navigate("/admin", { replace: true });
      }
    }

    checkSession();
  }, [navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      toast.success("Welcome back!");

      navigate("/admin", {
        replace: true,
      });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center px-6">

      <button
        onClick={() => navigate("/")}
        className="absolute left-8 top-8 flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2 text-white transition hover:bg-zinc-800"
      >
        <ArrowLeft size={18} />
        Home
      </button>

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl"
      >

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
            <Lock className="text-emerald-400" size={30} />
          </div>

          <h1 className="text-4xl font-black text-white">
            Admin Login
          </h1>

          <p className="mt-3 text-zinc-400">
            Sign in to manage Ritual Agent Hub
          </p>

        </div>

        <div className="mb-6">

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Email
          </label>

          <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-800 focus-within:border-emerald-500">

            <Mail
              className="ml-4 text-zinc-500"
              size={20}
            />

            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-white outline-none"
            />

          </div>

        </div>

        <div className="mb-8">

          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Password
          </label>

          <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-800 focus-within:border-emerald-500">

            <Lock
              className="ml-4 text-zinc-500"
              size={20}
            />

            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent px-4 py-4 text-white outline-none"
            />

          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-4 font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              Signing In...
            </>
          ) : (
            "Login"
          )}
        </button>

      </form>

    </div>
  );
}
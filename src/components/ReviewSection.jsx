import { useState, useEffect } from "react";
import { Star, MessageSquareQuote, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../services/supabase";

export default function ReviewSection({ projectId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
    loadReviews();
  }, [projectId]);

  async function loadReviews() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Reviews")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    if (!error) {
      setReviews(data || []);
    }

    setLoading(false);
  }

  async function submitReview() {
    if (!currentUser) {
      toast.error("Please login first.");
      return;
    }

    if (!review.trim()) {
      toast.error("Please write a review.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("Reviews").insert({
      project_id: projectId,
      user_id: currentUser.id,
      user_email: currentUser.email,
      rating,
      review: review.trim(),
    });

    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setReview("");
    setRating(5);
    toast.success("Review submitted!");
    loadReviews();
  }

  async function deleteReview(reviewId) {
    if (!window.confirm("Delete your review?")) return;
    
    const { error } = await supabase.from("Reviews").delete().eq("id", reviewId);
    
    if (error) {
        toast.error(error.message);
        return;
    }
    
    toast.success("Review deleted.");
    loadReviews();
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 sm:p-8">
      {/* Write a Review */}
      <h2 className="mb-6 text-2xl font-bold">Write a Review</h2>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-zinc-400">
          Rating
        </label>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              aria-label={`${star} star${star !== 1 ? "s" : ""}`}
              className={`text-3xl transition hover:scale-110 ${
                star <= rating ? "text-yellow-400" : "text-zinc-700 hover:text-yellow-400/40"
              }`}
            >
              <Star
                size={28}
                className={star <= rating ? "fill-yellow-400" : ""}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        placeholder="Write your review..."
        className="mb-4 h-32 w-full rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white placeholder:text-zinc-500 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
      />

      <button
        onClick={submitReview}
        disabled={submitting}
        className="rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </span>
        ) : (
          "Submit Review"
        )}
      </button>

      <hr className="my-8 border-zinc-800" />

      {/* Reviews List */}
      <h3 className="mb-6 text-xl font-bold">
        Reviews ({reviews.length})
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="animate-spin text-emerald-400" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 py-12 text-center">
          <MessageSquareQuote size={40} className="mx-auto text-zinc-600" />
          <p className="mt-4 text-zinc-400">No reviews yet.</p>
          <p className="mt-1 text-sm text-zinc-500">
            Be the first to share your thoughts.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="border-b border-zinc-800 pb-6 last:border-b-0"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-sm font-bold">
                    {r.user_email?.charAt(0)?.toUpperCase() || "U"}
                  </div>

                  <p className="font-semibold text-white">
                    {r.user_email?.split("@")[0] || "User"}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                        key={star}
                        size={14}
                        className={
                            star <= (r.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-zinc-700"
                        }
                        />
                    ))}
                    </div>
                    {currentUser?.id === r.user_id && (
                        <button onClick={() => deleteReview(r.id)} className="text-zinc-500 hover:text-red-400 transition">
                            <Trash2 size={16}/>
                        </button>
                    )}
                </div>
              </div>

              <p className="mt-3 leading-7 text-zinc-300">{r.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
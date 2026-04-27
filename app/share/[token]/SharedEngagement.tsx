"use client";

import { useEffect, useState } from "react";
import { Heart, Loader2, MessageCircle, Send } from "lucide-react";

type Comment = {
  id: string;
  name: string | null;
  comment: string;
  createdAt: string;
};

export function SharedEngagement({ capsuleId }: { capsuleId: string }) {
  const [loveCount, setLoveCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [loving, setLoving] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    const res = await fetch(`/api/capsules/${capsuleId}/engagement`);
    if (!res.ok) return;

    const data = await res.json();
    setLoveCount(data.loveCount || 0);
    setComments(data.comments || []);
  };

  useEffect(() => {
    fetchData();
  }, [capsuleId]);

  const handleLove = async () => {
    try {
      setLoving(true);
      setLoveCount((prev) => prev + 1);

      await fetch(`/api/capsules/${capsuleId}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "love" }),
      });
    } finally {
      setLoving(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      setSending(true);

      await fetch(`/api/capsules/${capsuleId}/engagement`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "comment",
          name,
          comment,
        }),
      });

      setComment("");
      await fetchData();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mt-3 rounded-2xl border border-[#7b4b24]/30 bg-[#fff3dc]/55 p-3">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={handleLove}
          disabled={loving}
          className="flex items-center gap-2 rounded-full border border-[#8b2e16]/30 bg-[#8b2e16]/10 px-3 py-1.5 font-serif text-xs font-black text-[#8b2e16] transition hover:bg-[#8b2e16] hover:text-[#fff3dc]"
        >
          {loving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Heart className="h-3.5 w-3.5 fill-current" />
          )}
          Love {loveCount}
        </button>

        <div className="flex items-center gap-1.5 font-serif text-[10px] uppercase tracking-widest text-[#7b4b24]">
          <MessageCircle className="h-3.5 w-3.5" />
          {comments.length} comments
        </div>
      </div>

      <div className="space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name..."
          className="h-8 w-full rounded-xl border border-[#7b4b24]/30 bg-[#f8ead0] px-3 font-serif text-xs text-[#2b160b] outline-none placeholder:text-[#7b4b24]/50"
        />

        <div className="flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
            className="h-8 min-w-0 flex-1 rounded-xl border border-[#7b4b24]/30 bg-[#f8ead0] px-3 font-serif text-xs text-[#2b160b] outline-none placeholder:text-[#7b4b24]/50"
          />

          <button
            type="button"
            onClick={handleComment}
            disabled={sending || !comment.trim()}
            className="flex h-8 w-9 items-center justify-center rounded-xl bg-[#8b2e16] text-[#fff3dc] transition hover:bg-[#c23a16] disabled:opacity-40"
          >
            {sending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Send className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="mt-3 max-h-32 space-y-2 overflow-y-auto pr-1">
          {comments.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-[#7b4b24]/20 bg-[#f3dfb9]/70 px-3 py-2"
            >
              <p className="font-serif text-[10px] font-black uppercase tracking-widest text-[#8b2e16]">
                {c.name || "Traveler"}
              </p>
              <p className="mt-0.5 font-serif text-xs text-[#3b2414]">
                {c.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
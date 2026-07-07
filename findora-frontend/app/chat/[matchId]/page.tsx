"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { Send, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "@/components/dashboard-shell";
import { Avatar } from "@/components/ui-bits";
import { api } from "@/lib/api";
import { getToken, API_URL } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { ChatMessage, MatchRecord } from "@/lib/types";
import { timeAgo } from "@/lib/format";

export default function ChatPage() {
  const { user } = useAuth();
  const params = useParams<{ matchId: string }>();
  const [match, setMatch] = useState<MatchRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = `match_${params.matchId}`;

  useEffect(() => {
    api.get<{ data: MatchRecord[] }>("/matches").then((r) => {
      const found = r.data.find((m) => m._id === params.matchId);
      if (found) setMatch(found);
    });
    api.get<{ data: ChatMessage[] }>(`/messages/${params.matchId}`).then((r) => setMessages(r.data));
  }, [params.matchId]);

  useEffect(() => {
    const socketUrl = API_URL.replace(/\/api\/?$/, "");
    const socket = io(socketUrl, { auth: { token: getToken() } });
    socketRef.current = socket;
    socket.emit("conversation:join", conversationId);
    socket.on("message:new", (msg: ChatMessage) => {
      setMessages((prev) => (prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]));
    });
    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const otherParty =
    match && user
      ? String(match.lostOwner._id) === user.id
        ? match.foundOwner
        : match.lostOwner
      : null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !otherParty || !user) return;
    const body = { matchId: params.matchId, recipient: otherParty._id, text };
    setText("");
    try {
      const res = await api.post<{ data: ChatMessage }>("/messages", body);
      setMessages((prev) => (prev.some((m) => m._id === res.data._id) ? prev : [...prev, res.data]));
    } catch {
      // no-op — real app would show a retry affordance
    }
  };

  return (
    <DashboardShell>
      <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-100 p-4">
          <Link href="/matches" className="text-slate-400 hover:text-slate-700">
            <ArrowLeft className="size-4.5" />
          </Link>
          <Avatar name={otherParty?.name} src={otherParty?.avatar} size={9} />
          <div>
            <p className="font-heading text-sm font-semibold text-slate-900">
              Chat with {otherParty?.name || "Findora user"}
            </p>
            <p className="text-xs text-slate-500">
              Regarding {match?.lostItem?.title || "this report"}
            </p>
          </div>
        </div>

        <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
          {messages.map((m) => {
            const mine = m.sender === user?.id;
            return (
              <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    mine ? "rounded-br-sm bg-brand-indigo text-white" : "rounded-bl-sm bg-slate-100 text-slate-800"
                  }`}
                >
                  <p>{m.text}</p>
                  <p className={`mt-1 text-[10px] ${mine ? "text-white/70" : "text-slate-400"}`}>{timeAgo(m.createdAt)}</p>
                </div>
              </div>
            );
          })}
          {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-slate-400">
              Say hello and share a detail only the real owner would know.
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-slate-100 p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="input-plain flex-1"
          />
          <button className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-indigo text-white hover:bg-brand-indigo-dark">
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/e2bc4a3b-2c2f-4ed5-a331-28cca59b4a69";

interface Thread {
  id: number;
  buyer_name: string;
  buyer_contact: string;
  last_message_at: string;
}
interface Message {
  id: number;
  sender: string;
  text_original: string;
  text_translated: string;
  lang_original: string;
  created_at: string;
}

export default function SellerChats({ token }: { token: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(async () => {
    const res = await fetch(`${CHAT_URL}?action=seller_threads`, { headers: { "X-Auth-Token": token } });
    const data = await res.json();
    setThreads(data.threads || []);
  }, [token]);

  const loadMessages = useCallback(async (id: number) => {
    const res = await fetch(`${CHAT_URL}?action=seller_messages&thread_id=${id}`, { headers: { "X-Auth-Token": token } });
    const data = await res.json();
    setMessages(data.messages || []);
  }, [token]);

  useEffect(() => {
    loadThreads();
    const t = setInterval(loadThreads, 6000);
    return () => clearInterval(t);
  }, [loadThreads]);

  useEffect(() => {
    if (activeId == null) return;
    loadMessages(activeId);
    const t = setInterval(() => loadMessages(activeId), 4000);
    return () => clearInterval(t);
  }, [activeId, loadMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || activeId == null) return;
    setSending(true);
    const res = await fetch(`${CHAT_URL}?action=send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify({ thread_id: activeId, text }),
    });
    const data = await res.json();
    setMessages(data.messages || []);
    setText("");
    setSending(false);
  };

  if (threads.length === 0) {
    return (
      <div className="bg-white card-soft rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon name="MessagesSquare" size={28} className="text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">Пока нет сообщений от покупателей. Когда кто-то напишет — чат появится здесь.</p>
      </div>
    );
  }

  return (
    <div className="bg-white card-soft rounded-2xl overflow-hidden grid md:grid-cols-[260px_1fr] h-[480px]">
      {/* Список чатов */}
      <div className="border-r border-border overflow-y-auto">
        {threads.map((th) => (
          <button
            key={th.id}
            onClick={() => setActiveId(th.id)}
            className={`w-full text-left px-4 py-3 border-b border-border flex items-center gap-3 transition-all ${
              activeId === th.id ? "bg-accent" : "hover:bg-secondary/50"
            }`}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-display font-bold flex-shrink-0">
              {th.buyer_name?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm text-brand-navy truncate">{th.buyer_name}</div>
              {th.buyer_contact && <div className="text-xs text-muted-foreground truncate">{th.buyer_contact}</div>}
            </div>
          </button>
        ))}
      </div>

      {/* Окно сообщений */}
      <div className="flex flex-col">
        {activeId == null ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-6 text-center">
            Выберите чат слева
          </div>
        ) : (
          <>
            <div className="px-4 py-2 border-b border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Авто-перевод 中文 ↔ RU</span>
              <button onClick={() => setShowOriginal(!showOriginal)} className="text-xs text-primary hover:underline flex items-center gap-1">
                <Icon name="Languages" size={14} />
                {showOriginal ? "Перевод" : "Оригинал"}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m) => {
                const mine = m.sender === "seller";
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm border-2 ${
                        mine
                          ? "bg-primary text-white border-brand-navy rounded-br-sm"
                          : "bg-secondary text-brand-navy border-border rounded-bl-sm"
                      }`}
                    >
                      <div>{mine ? m.text_original : (showOriginal ? m.text_original : m.text_translated || m.text_original)}</div>
                      {!mine && m.text_translated && (
                        <div className="text-[11px] mt-1 text-muted-foreground">
                          {showOriginal ? "" : `оригинал: ${m.text_original}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <form onSubmit={send} className="p-3 flex gap-2 border-t border-border">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="回复买家 / Ответить..."
                className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="px-4 bg-primary text-white rounded-xl border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)] hover:scale-[1.02] transition-all disabled:opacity-60"
              >
                <Icon name="Send" size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

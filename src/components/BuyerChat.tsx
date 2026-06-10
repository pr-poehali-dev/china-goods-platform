import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/e2bc4a3b-2c2f-4ed5-a331-28cca59b4a69";

interface Message {
  id: number;
  sender: string;
  text_original: string;
  text_translated: string;
  lang_original: string;
  created_at: string;
}

interface BuyerChatProps {
  sellerId: number;
  sellerName: string;
  onClose: () => void;
}

export default function BuyerChat({ sellerId, sellerName, onClose }: BuyerChatProps) {
  const [buyerToken, setBuyerToken] = useState<string>(() => localStorage.getItem("buyer_token") || "");
  const [buyerName, setBuyerName] = useState<string>(() => localStorage.getItem("buyer_name") || "");
  const [nameInput, setNameInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!buyerToken) return;
    const res = await fetch(`${CHAT_URL}?action=buyer_thread&seller_id=${sellerId}`, {
      headers: { "X-Buyer-Token": buyerToken },
    });
    const data = await res.json();
    setMessages(data.messages || []);
  }, [buyerToken, sellerId]);

  useEffect(() => {
    loadMessages();
    const t = setInterval(loadMessages, 4000);
    return () => clearInterval(t);
  }, [loadMessages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const res = await fetch(`${CHAT_URL}?action=send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Buyer-Token": buyerToken },
      body: JSON.stringify({ seller_id: sellerId, text, buyer_name: buyerName }),
    });
    const data = await res.json();
    if (data.buyer_token && !buyerToken) {
      setBuyerToken(data.buyer_token);
      localStorage.setItem("buyer_token", data.buyer_token);
    }
    setMessages(data.messages || []);
    setText("");
    setSending(false);
  };

  const startChat = () => {
    const name = nameInput.trim() || "Покупатель";
    setBuyerName(name);
    localStorage.setItem("buyer_name", name);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border-2 border-brand-navy rounded-2xl w-full max-w-md shadow-[8px_8px_0_hsl(220,45%,14%)] flex flex-col h-[560px] max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-brand-navy bg-primary rounded-t-xl">
          <div className="flex items-center gap-2 text-white">
            <Icon name="MessageSquare" size={20} />
            <div>
              <div className="font-display font-bold">{sellerName}</div>
              <div className="text-[11px] text-white/80">Авто-перевод RU ↔ 中文</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-1.5 transition-all">
            <Icon name="X" size={18} />
          </button>
        </div>

        {!buyerName ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-4">
              <Icon name="UserRound" size={28} className="text-primary" />
            </div>
            <p className="text-brand-navy font-medium mb-4">Как к вам обращаться?</p>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm mb-3"
              onKeyDown={(e) => e.key === "Enter" && startChat()}
            />
            <button
              onClick={startChat}
              className="w-full px-6 py-3 bg-primary text-white font-display font-bold rounded-xl border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)] hover:scale-[1.02] transition-all"
            >
              Начать чат
            </button>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  Напишите первое сообщение — поставщик получит его на китайском
                </p>
              )}
              {messages.map((m) => {
                const mine = m.sender === "buyer";
                const showOrig = showOriginal;
                return (
                  <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm border-2 ${
                        mine
                          ? "bg-primary text-white border-brand-navy rounded-br-sm"
                          : "bg-secondary text-brand-navy border-border rounded-bl-sm"
                      }`}
                    >
                      <div>{mine ? m.text_original : (showOrig ? m.text_original : m.text_translated || m.text_original)}</div>
                      {!mine && m.text_translated && (
                        <div className={`text-[11px] mt-1 ${mine ? "text-white/70" : "text-muted-foreground"}`}>
                          {showOrig ? "перевод выкл." : `оригинал: ${m.text_original}`}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>

            {/* Toggle + input */}
            <div className="px-4 pt-2">
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className="text-xs text-primary hover:underline flex items-center gap-1 mb-2"
              >
                <Icon name="Languages" size={14} />
                {showOriginal ? "Показывать перевод" : "Показать оригинал"}
              </button>
            </div>
            <form onSubmit={send} className="p-4 pt-0 flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Сообщение на русском..."
                className="flex-1 px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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

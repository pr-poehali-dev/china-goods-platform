import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const BUYERS_URL = "https://functions.poehali.dev/06fde46a-bde9-49a8-980c-32123c272734";
const CHAT_URL = "https://functions.poehali.dev/e2bc4a3b-2c2f-4ed5-a331-28cca59b4a69";

interface Buyer {
  id: number;
  email: string;
  name: string;
  phone: string;
}
interface Chat {
  id: number;
  seller_id: number;
  seller_name: string;
  seller_avatar: string;
  seller_city: string;
  last_message_at: string;
  unread: number;
}
interface Message {
  id: number;
  sender: string;
  text_original: string;
  text_translated: string;
  lang_original: string;
  created_at: string;
}

export default function BuyerAccount({ embedded = false }: { embedded?: boolean }) {
  const [auth, setAuth] = useState<string>(() => localStorage.getItem("buyer_auth") || "");
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [mode, setMode] = useState<"login" | "register">("register");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadMe = useCallback(async (token: string) => {
    const res = await fetch(`${BUYERS_URL}?action=me`, { headers: { "X-Buyer-Auth": token } });
    if (res.ok) {
      const data = await res.json();
      setBuyer(data.buyer);
    } else {
      localStorage.removeItem("buyer_auth");
      setAuth("");
    }
  }, []);

  const loadChats = useCallback(async () => {
    if (!auth) return;
    const res = await fetch(`${CHAT_URL}?action=buyer_chats`, { headers: { "X-Buyer-Auth": auth } });
    if (res.ok) {
      const data = await res.json();
      setChats(data.chats || []);
    }
  }, [auth]);

  const loadMessages = useCallback(async (threadId: number) => {
    const res = await fetch(`${CHAT_URL}?action=buyer_chat_messages&thread_id=${threadId}`, {
      headers: { "X-Buyer-Auth": auth },
    });
    const data = await res.json();
    setMessages(data.messages || []);
    loadChats();
  }, [auth, loadChats]);

  useEffect(() => {
    if (auth) loadMe(auth);
  }, [auth, loadMe]);

  useEffect(() => {
    if (!auth) return;
    loadChats();
    const t = setInterval(loadChats, 6000);
    return () => clearInterval(t);
  }, [auth, loadChats]);

  useEffect(() => {
    if (activeChat == null) return;
    loadMessages(activeChat.id);
    const t = setInterval(() => loadMessages(activeChat.id), 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChat?.id]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`${BUYERS_URL}?action=${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("buyer_auth", data.token);
      localStorage.setItem("buyer_account_name", data.buyer.name);
      setAuth(data.token);
      setBuyer(data.buyer);
      setForm({ name: "", email: "", password: "", phone: "" });
    } else {
      setError(data.error || "Ошибка");
    }
  };

  const logout = () => {
    localStorage.removeItem("buyer_auth");
    localStorage.removeItem("buyer_account_name");
    setAuth("");
    setBuyer(null);
    setChats([]);
    setActiveChat(null);
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeChat) return;
    setSending(true);
    const res = await fetch(`${CHAT_URL}?action=send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Buyer-Auth": auth },
      body: JSON.stringify({ seller_id: activeChat.seller_id, text }),
    });
    const data = await res.json();
    setMessages(data.messages || []);
    setText("");
    setSending(false);
  };

  const inputCls = "w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  // ── Не авторизован: форма входа/регистрации ──
  if (!auth || !buyer) {
    return (
      <div className={embedded ? "" : "max-w-md mx-auto"}>
        <div className="bg-white card-soft rounded-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="UserRound" size={26} className="text-primary" />
            </div>
            <h3 className="font-display font-bold text-2xl text-brand-navy">
              {mode === "register" ? "Регистрация" : "Вход в кабинет"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "register" ? "Создайте аккаунт покупателя" : "Войдите в свой аккаунт"}
            </p>
          </div>
          <form onSubmit={handleAuth} className="space-y-3">
            {mode === "register" && (
              <input className={inputCls} placeholder="Ваше имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            )}
            <input type="email" className={inputCls} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input type="password" className={inputCls} placeholder="Пароль" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            {mode === "register" && (
              <input className={inputCls} placeholder="Телефон (необязательно)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            )}
            {error && <p className="text-sm text-primary font-medium">{error}</p>}
            <button type="submit" disabled={loading} className="w-full btn-modern px-6 py-3 text-white font-body font-bold rounded-2xl disabled:opacity-60">
              {loading ? "..." : mode === "register" ? "Создать аккаунт" : "Войти"}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              {mode === "register" ? "Уже есть аккаунт? " : "Нет аккаунта? "}
              <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setMode(mode === "register" ? "login" : "register"); setError(""); }}>
                {mode === "register" ? "Войти" : "Зарегистрироваться"}
              </button>
            </p>
          </form>
        </div>
      </div>
    );
  }

  // ── Авторизован: профиль + переписка ──
  return (
    <div className={embedded ? "" : "max-w-4xl mx-auto"}>
      {/* Профиль */}
      <div className="bg-white card-soft rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center font-display font-bold text-2xl text-white">
            {buyer.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-display font-bold text-xl text-brand-navy">{buyer.name}</div>
            <div className="text-sm text-muted-foreground">{buyer.email}</div>
          </div>
        </div>
        <button onClick={logout} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          <Icon name="LogOut" size={16} /> Выйти
        </button>
      </div>

      {/* Переписка с продавцами */}
      <div className="bg-white card-soft rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Icon name="MessagesSquare" size={20} className="text-primary" />
          <h3 className="font-display font-bold text-lg text-brand-navy">Мои переписки</h3>
        </div>

        {chats.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="MessageSquare" size={28} className="text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">
              У вас пока нет переписок. Найдите поставщика в каталоге и напишите ему — диалог появится здесь.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[280px_1fr] h-[480px]">
            {/* Список чатов */}
            <div className="border-r border-border overflow-y-auto">
              {chats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChat(c)}
                  className={`w-full text-left px-4 py-3 border-b border-border flex items-center gap-3 transition-all ${
                    activeChat?.id === c.id ? "bg-accent" : "hover:bg-secondary/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center overflow-hidden flex-shrink-0">
                    {c.seller_avatar ? (
                      <img src={c.seller_avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-display font-bold">{c.seller_name?.[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-brand-navy truncate">{c.seller_name}</div>
                    {c.seller_city && <div className="text-xs text-muted-foreground truncate">{c.seller_city}</div>}
                  </div>
                  {c.unread > 0 && (
                    <span className="flex-shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Окно сообщений */}
            <div className="flex flex-col">
              {!activeChat ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm p-6 text-center">
                  Выберите переписку слева
                </div>
              ) : (
                <>
                  <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-navy">{activeChat.seller_name}</span>
                    <button onClick={() => setShowOriginal(!showOriginal)} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Icon name="Languages" size={14} />
                      {showOriginal ? "Перевод" : "Оригинал"}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((m) => {
                      const mine = m.sender === "buyer";
                      return (
                        <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${mine ? "bg-primary text-white rounded-br-sm" : "bg-secondary text-brand-navy rounded-bl-sm"}`}>
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
                      placeholder="Сообщение на русском..."
                      className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button type="submit" disabled={sending || !text.trim()} className="px-4 btn-modern text-white rounded-xl disabled:opacity-60">
                      <Icon name="Send" size={18} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

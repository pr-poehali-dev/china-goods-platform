import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const CHAT_URL = "https://functions.poehali.dev/e2bc4a3b-2c2f-4ed5-a331-28cca59b4a69";

export default function AccountNavButton({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  const load = useCallback(async () => {
    const auth = localStorage.getItem("buyer_auth");
    if (!auth) {
      setLoggedIn(false);
      setUnread(0);
      return;
    }
    setLoggedIn(true);
    try {
      const res = await fetch(`${CHAT_URL}?action=buyer_unread`, { headers: { "X-Buyer-Auth": auth } });
      if (res.ok) {
        const data = await res.json();
        setUnread(data.total_unread || 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 8000);
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
    };
  }, [load]);

  return (
    <button
      onClick={() => navigate("/account")}
      className={`relative flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm hover:bg-secondary/80 transition-all ${className}`}
    >
      <Icon name="UserRound" size={16} />
      <span>{loggedIn ? "Кабинет" : "Покупателям"}</span>
      {unread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-md shadow-blue-500/30 animate-pulse">
          {unread}
        </span>
      )}
    </button>
  );
}
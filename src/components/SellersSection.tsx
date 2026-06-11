import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/icon";
import SellerChats from "@/components/SellerChats";
import BuyerChat from "@/components/BuyerChat";
import { toast } from "sonner";

const SELLERS_URL = "https://functions.poehali.dev/d6dd7774-7d1c-436f-a1ac-d5342ecb46b4";
const CONTENT_URL = "https://functions.poehali.dev/497830cf-ab2d-4e0b-b5a1-497fa90b8d0d";
const CHUNK_URL = "https://functions.poehali.dev/4ef9bd33-5775-48e5-ae6c-a4a396086a2f";
const CHAT_URL = "https://functions.poehali.dev/e2bc4a3b-2c2f-4ed5-a331-28cca59b4a69";
const CHUNK_SIZE = 5 * 1024 * 1024; // 5 МБ

const playNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const playTone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    };
    playTone(880, 0, 0.15);
    playTone(1175, 0.13, 0.2);
  } catch {
    /* звук недоступен */
  }
};

const requestPushPermission = async () => {
  if (!("Notification" in window)) return;
  if (Notification.permission === "default") {
    await Notification.requestPermission();
  }
};

const sendPushNotification = (title: string, body: string) => {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, {
      body,
      icon: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/039ee8c0-b2b5-43f3-b255-98f11b27d55a.jpg",
      badge: "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/039ee8c0-b2b5-43f3-b255-98f11b27d55a.jpg",
      tag: "new-message",
      renotify: true,
    });
  } catch {
    /* push недоступен */
  }
};

interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  image_url: string;
}
interface Video {
  id: number;
  title: string;
  video_url: string;
}
interface Seller {
  id: number;
  email?: string;
  company_name: string;
  wechat_id: string;
  phone: string;
  description: string;
  avatar_url: string;
  city: string;
  products: Product[];
  videos: Video[];
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function SellersSection({ embedded = false, compact = false }: { embedded?: boolean; compact?: boolean }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("seller_token"));
  const [me, setMe] = useState<Seller | null>(null);
  const [publicSellers, setPublicSellers] = useState<Seller[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [showAuth, setShowAuth] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "", company_name: "" });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"profile" | "products" | "videos" | "chats">("profile");
  const [chatWith, setChatWith] = useState<{ id: number; name: string } | null>(null);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const prevUnreadRef = useRef<number | null>(null);

  const [profile, setProfile] = useState({ company_name: "", wechat_id: "", phone: "", description: "", city: "", avatar_url: "" });
  const [savedMsg, setSavedMsg] = useState("");

  const [productForm, setProductForm] = useState({ title: "", price: "", description: "", image_url: "" });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [videoForm, setVideoForm] = useState({ title: "", video_url: "" });
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoError, setVideoError] = useState("");
  const [videoDragOver, setVideoDragOver] = useState(false);

  const MAX_VIDEO_MB = 150;

  const loadPublic = useCallback(async () => {
    const res = await fetch(`${SELLERS_URL}?action=list`);
    const data = await res.json();
    setPublicSellers(data.sellers || []);
  }, []);

  const loadMe = useCallback(async (t: string) => {
    const res = await fetch(`${SELLERS_URL}?action=me`, { headers: { "X-Auth-Token": t } });
    if (res.ok) {
      const data = await res.json();
      setMe(data.seller);
      setProfile({
        company_name: data.seller.company_name || "",
        wechat_id: data.seller.wechat_id || "",
        phone: data.seller.phone || "",
        description: data.seller.description || "",
        city: data.seller.city || "",
        avatar_url: data.seller.avatar_url || "",
      });
    } else {
      localStorage.removeItem("seller_token");
      setToken(null);
    }
  }, []);

  useEffect(() => {
    loadPublic();
  }, [loadPublic]);

  useEffect(() => {
    if (token) {
      loadMe(token);
      requestPushPermission();
    }
  }, [token, loadMe]);

  // Обновление заголовка вкладки при непрочитанных
  useEffect(() => {
    const base = "TaoSeller — Кабинет";
    if (unreadTotal > 0) {
      document.title = `(${unreadTotal}) 📩 ${base}`;
    } else {
      document.title = base;
    }
    return () => { document.title = "TaoSeller"; };
  }, [unreadTotal]);

  const loadUnread = useCallback(async (t: string) => {
    const res = await fetch(`${CHAT_URL}?action=unread_total`, { headers: { "X-Auth-Token": t } });
    if (res.ok) {
      const data = await res.json();
      const count = data.total_unread || 0;
      const prev = prevUnreadRef.current;
      if (prev !== null && count > prev) {
        playNotificationSound();
        toast("📩 Новое сообщение от покупателя", {
          description: "Откройте вкладку «Сообщения», чтобы ответить",
        });
        // Браузерный push — работает даже когда вкладка свёрнута
        sendPushNotification(
          "📩 Новое сообщение",
          "Покупатель написал вам на TaoSeller. Откройте сайт, чтобы ответить."
        );
      }
      prevUnreadRef.current = count;
      setUnreadTotal(count);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadUnread(token);
    const t = setInterval(() => loadUnread(token), 8000);
    return () => clearInterval(t);
  }, [token, loadUnread]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);
    const res = await fetch(`${SELLERS_URL}?action=${authMode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(authForm),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      localStorage.setItem("seller_token", data.token);
      setToken(data.token);
      setShowAuth(false);
      setAuthForm({ email: "", password: "", company_name: "" });
    } else {
      setAuthError(data.error || "Ошибка");
    }
  };

  const logout = () => {
    localStorage.removeItem("seller_token");
    setToken(null);
    setMe(null);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    await fetch(`${SELLERS_URL}?action=profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify(profile),
    });
    setLoading(false);
    setSavedMsg("Профиль сохранён!");
    setTimeout(() => setSavedMsg(""), 2500);
    loadMe(token);
    loadPublic();
  };

  const uploadFile = async (file: File): Promise<string> => {
    const base64 = await fileToBase64(file);
    const ext = file.name.split(".").pop() || "bin";
    const res = await fetch(`${CONTENT_URL}?action=upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token! },
      body: JSON.stringify({ file_base64: base64, content_type: file.type, ext }),
    });
    const data = await res.json();
    return data.url;
  };

  const onImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingImg(true);
    const url = await uploadFile(file);
    setProductForm((f) => ({ ...f, image_url: url }));
    setUploadingImg(false);
  };

  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    await fetch(`${CONTENT_URL}?action=add_product`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify(productForm),
    });
    setLoading(false);
    setProductForm({ title: "", price: "", description: "", image_url: "" });
    loadMe(token);
    loadPublic();
  };

  const uploadVideoWithProgress = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop() || "mp4";
    const headers = { "Content-Type": "application/json", "X-Auth-Token": token! };

    // 1. Инициализируем multipart upload
    const initRes = await fetch(`${CHUNK_URL}?action=init`, {
      method: "POST", headers,
      body: JSON.stringify({ ext, content_type: file.type }),
    });
    const initData = await initRes.json();
    if (!initRes.ok || !initData.upload_id) throw new Error(initData.error || "Ошибка инициализации");
    const { upload_id, key } = initData;

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const parts: { part_number: number; etag: string }[] = [];

    // 2. Загружаем по чанкам
    for (let i = 0; i < totalChunks; i++) {
      const slice = file.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      const arrayBuf = await slice.arrayBuffer();
      const b64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuf)));

      const chunkRes = await fetch(`${CHUNK_URL}?action=chunk`, {
        method: "POST", headers,
        body: JSON.stringify({ key, upload_id, part_number: i + 1, chunk_b64: b64 }),
      });
      const chunkData = await chunkRes.json();
      if (!chunkRes.ok || !chunkData.etag) {
        await fetch(`${CHUNK_URL}?action=abort`, { method: "POST", headers, body: JSON.stringify({ key, upload_id }) });
        throw new Error(chunkData.error || "Ошибка загрузки чанка");
      }
      parts.push({ part_number: i + 1, etag: chunkData.etag });
      setVideoProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    // 3. Завершаем загрузку
    const completeRes = await fetch(`${CHUNK_URL}?action=complete`, {
      method: "POST", headers,
      body: JSON.stringify({ key, upload_id, parts }),
    });
    const completeData = await completeRes.json();
    if (!completeRes.ok || !completeData.url) throw new Error(completeData.error || "Ошибка завершения загрузки");
    return completeData.url;
  };

  const handleVideoFile = async (file: File | undefined) => {
    setVideoError("");
    if (!file || !token) return;
    if (!file.type.startsWith("video/")) {
      setVideoError("Выберите видеофайл");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setVideoError(`Видео слишком большое (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум ${MAX_VIDEO_MB} МБ`);
      return;
    }
    setUploadingVideo(true);
    setVideoProgress(0);
    try {
      const url = await uploadVideoWithProgress(file);
      setVideoForm((f) => ({ ...f, video_url: url }));
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : "Ошибка загрузки");
    }
    setUploadingVideo(false);
  };

  const onVideoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleVideoFile(e.target.files?.[0]);
    e.target.value = "";
  };

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !videoForm.video_url) return;
    setLoading(true);
    await fetch(`${CONTENT_URL}?action=add_video`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify(videoForm),
    });
    setLoading(false);
    setVideoForm({ title: "", video_url: "" });
    setVideoProgress(0);
    setVideoError("");
    loadMe(token);
    loadPublic();
  };

  const deleteVideo = async (videoId: number) => {
    if (!token) return;
    await fetch(`${CONTENT_URL}?action=delete_video`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Auth-Token": token },
      body: JSON.stringify({ video_id: videoId }),
    });
    loadMe(token);
    loadPublic();
  };

  const inputCls = "w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm";
  const btnCls = "btn-modern px-6 py-3 text-white font-body font-bold rounded-2xl disabled:opacity-60";

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper {...(embedded ? {} : { id: "sellers" })} className={embedded ? "" : "py-24 px-4 bg-cream"}>
      <div className={embedded ? "" : "container mx-auto"}>
        {!embedded && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent rounded-full text-primary text-sm font-bold mb-4">
              <Icon name="MessageSquare" size={16} /> WeChat
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-brand-navy">
              Продавцы <span className="text-grad">WeChat</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Проверенные поставщики из Китая. Зарегистрируйтесь, заполните профиль, загрузите товары и видео — и клиенты найдут вас.
            </p>
          </div>
        )}

        {embedded && !compact && (
          <p className="text-center text-muted-foreground max-w-xl mx-auto mb-10">
            Проверенные поставщики из Китая. Зарегистрируйтесь, заполните профиль, загрузите товары и видео — и клиенты найдут вас.
          </p>
        )}

        {/* Кабинет поставщика */}
        {token && me ? (
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white card-soft rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary border border-border flex items-center justify-center overflow-hidden">
                  {me.avatar_url ? (
                    <img src={me.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-display font-bold text-2xl text-white">
                      {me.company_name?.[0]?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-brand-navy">{me.company_name}</div>
                  <div className="text-sm text-muted-foreground">Кабинет поставщика</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {"Notification" in window && Notification.permission === "default" && (
                  <button
                    onClick={requestPushPermission}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:-translate-y-0.5"
                    style={{background:"linear-gradient(135deg,hsl(200,70%,88%),hsl(200,60%,94%))", color:"hsl(220,45%,18%)"}}
                  >
                    <Icon name="Bell" size={14} /> Включить уведомления
                  </button>
                )}
                {"Notification" in window && Notification.permission === "granted" && (
                  <span className="flex items-center gap-1 text-xs text-brand-teal font-medium">
                    <Icon name="BellRing" size={13} /> Уведомления вкл.
                  </span>
                )}
                <button onClick={logout} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                  <Icon name="LogOut" size={16} /> Выйти
                </button>
              </div>
            </div>

            {/* Табы */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: "profile", label: "Профиль", icon: "User" },
                { id: "products", label: "Товары", icon: "Package" },
                { id: "videos", label: "Видео", icon: "Video" },
                { id: "chats", label: "Сообщения", icon: "MessagesSquare" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as typeof tab)}
                  className={`relative px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border ${
                    tab === t.id
                      ? "bg-primary text-white border-primary shadow-md shadow-blue-500/20"
                      : "bg-white text-brand-navy border-border hover:border-primary"
                  }`}
                >
                  <Icon name={t.icon} size={16} /> {t.label}
                  {t.id === "chats" && unreadTotal > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-brand-red text-white text-[11px] font-bold flex items-center justify-center border border-white/40">
                      {unreadTotal}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Профиль */}
            {tab === "profile" && (
              <form onSubmit={saveProfile} className="bg-white card-soft rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden flex-shrink-0 relative group" style={{background:"linear-gradient(135deg,hsl(200,70%,92%),hsl(200,60%,95%))"}}>
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <Icon name="Camera" size={24} className="text-primary/50 mx-auto mb-1" />
                        <span className="text-[10px] text-slate-400">фото</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer block">
                      <span className="px-4 py-2.5 rounded-xl text-sm font-bold inline-flex items-center gap-2 transition-all hover:-translate-y-0.5" style={{background:"linear-gradient(135deg,hsl(200,70%,88%),hsl(200,60%,94%))", color:"hsl(220,45%,18%)"}}>
                        <Icon name="Upload" size={15} />
                        {uploadingImg ? "Загружаю..." : "Загрузить фото"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file || !token) return;
                          setUploadingImg(true);
                          const url = await uploadFile(file);
                          setProfile((p) => ({ ...p, avatar_url: url }));
                          setUploadingImg(false);
                        }}
                      />
                    </label>
                    <p className="text-xs text-slate-400 mt-1.5">PNG, JPG до 5 МБ. Фото отображается на главной и в профиле</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Название компании</label>
                    <input className={inputCls} value={profile.company_name} onChange={(e) => setProfile({ ...profile, company_name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Город</label>
                    <input className={inputCls} placeholder="Гуанчжоу, Иу..." value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">WeChat ID</label>
                    <input className={inputCls} placeholder="wxid_..." value={profile.wechat_id} onChange={(e) => setProfile({ ...profile, wechat_id: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Телефон / WhatsApp</label>
                    <input className={inputCls} placeholder="+86 ..." value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">О компании</label>
                  <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Чем занимаетесь, какие товары, минимальный заказ..." value={profile.description} onChange={(e) => setProfile({ ...profile, description: e.target.value })} />
                </div>
                <div className="flex items-center gap-4">
                  <button type="submit" className={btnCls} disabled={loading}>Сохранить профиль</button>
                  {savedMsg && <span className="text-sm text-brand-teal font-medium">{savedMsg}</span>}
                </div>
              </form>
            )}

            {/* Товары */}
            {tab === "products" && (
              <div className="space-y-6">
                <form onSubmit={addProduct} className="bg-white card-soft rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-lg text-brand-navy">Добавить товар</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input className={inputCls} placeholder="Название товара" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} required />
                    <input className={inputCls} placeholder="Цена (напр. 5 ¥ / шт)" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} />
                  </div>
                  <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Описание товара" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-accent text-primary rounded-lg inline-block text-sm font-medium hover:bg-accent/70 transition-all">
                        {uploadingImg ? "Загрузка..." : "Фото товара"}
                      </span>
                      <input type="file" accept="image/*" className="hidden" onChange={onImagePick} />
                    </label>
                    {productForm.image_url && <img src={productForm.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border-2 border-border" />}
                  </div>
                  <button type="submit" className={btnCls} disabled={loading || uploadingImg}>Добавить в каталог</button>
                </form>

                {me.products.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {me.products.map((p) => (
                      <div key={p.id} className="bg-white card-soft rounded-2xl overflow-hidden">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.title} className="w-full h-32 object-cover" />
                        ) : (
                          <div className="w-full h-32 bg-secondary flex items-center justify-center"><Icon name="Package" size={28} className="text-muted-foreground" /></div>
                        )}
                        <div className="p-3">
                          <div className="font-semibold text-sm text-brand-navy leading-tight">{p.title}</div>
                          {p.price && <div className="text-primary font-display font-bold text-sm mt-1">{p.price}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-6">Товаров пока нет — добавьте первый</p>
                )}
              </div>
            )}

            {/* Видео */}
            {tab === "videos" && (
              <div className="space-y-6">
                <form onSubmit={addVideo} className="bg-white card-soft rounded-2xl p-6 space-y-4">
                  <h3 className="font-display font-bold text-lg text-brand-navy">Загрузить видео</h3>
                  <input className={inputCls} placeholder="Название видео (необязательно)" value={videoForm.title} onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })} />

                  {/* Зона загрузки drag&drop */}
                  {!videoForm.video_url && !uploadingVideo && (
                    <label
                      onDragOver={(e) => { e.preventDefault(); setVideoDragOver(true); }}
                      onDragLeave={() => setVideoDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setVideoDragOver(false);
                        handleVideoFile(e.dataTransfer.files?.[0]);
                      }}
                      className={`block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                        videoDragOver ? "border-primary bg-accent" : "border-border hover:border-primary hover:bg-secondary/40"
                      }`}
                    >
                      <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-accent flex items-center justify-center">
                        <Icon name="Video" size={26} className="text-primary" />
                      </div>
                      <div className="font-display font-bold text-brand-navy mb-1">Перетащите видео сюда</div>
                      <div className="text-sm text-muted-foreground mb-3">или выберите файл с ПК / телефона</div>
                      <span className="inline-block px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/25">
                        Выбрать видео
                      </span>
                      <div className="text-xs text-muted-foreground mt-3">MP4, MOV, WebM · до {MAX_VIDEO_MB} МБ</div>
                      <input type="file" accept="video/*" className="hidden" onChange={onVideoPick} />
                    </label>
                  )}

                  {/* Прогресс загрузки */}
                  {uploadingVideo && (
                    <div className="rounded-2xl border-2 border-border p-5">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-brand-navy font-medium flex items-center gap-2">
                          <Icon name="Loader" size={16} className="text-primary animate-spin" /> Загрузка видео...
                        </span>
                        <span className="font-bold text-primary">{videoProgress}%</span>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-200" style={{ width: `${videoProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* Превью загруженного видео */}
                  {videoForm.video_url && !uploadingVideo && (
                    <div className="rounded-2xl border-2 border-border overflow-hidden relative">
                      <video src={videoForm.video_url} controls className="w-full h-56 object-cover bg-black" />
                      <div className="absolute top-2 left-2 px-3 py-1 bg-brand-teal text-white text-xs font-bold rounded-full flex items-center gap-1">
                        <Icon name="Check" size={14} /> Готово к публикации
                      </div>
                      <button
                        type="button"
                        onClick={() => { setVideoForm((f) => ({ ...f, video_url: "" })); setVideoProgress(0); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-all"
                      >
                        <Icon name="X" size={16} className="text-brand-navy" />
                      </button>
                    </div>
                  )}

                  {videoError && (
                    <div className="text-sm text-primary font-medium flex items-center gap-2">
                      <Icon name="TriangleAlert" size={16} /> {videoError}
                    </div>
                  )}

                  <button type="submit" className={btnCls} disabled={loading || uploadingVideo || !videoForm.video_url}>Добавить видео</button>
                </form>

                {me.videos.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {me.videos.map((v) => (
                      <div key={v.id} className="bg-white card-soft rounded-2xl overflow-hidden relative group">
                        <video src={v.video_url} controls className="w-full h-48 object-cover bg-black" />
                        <button
                          onClick={() => deleteVideo(v.id)}
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          title="Удалить видео"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                        {v.title && <div className="p-3 font-semibold text-sm text-brand-navy">{v.title}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-6">Видео пока нет</p>
                )}
              </div>
            )}

            {/* Сообщения от покупателей */}
            {tab === "chats" && token && (
              <SellerChats
                token={token}
                onUnreadChange={(n) => {
                  prevUnreadRef.current = n;
                  setUnreadTotal(n);
                }}
              />
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto mb-16 text-center">
            <div className="bg-white card-soft rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-accent border border-border flex items-center justify-center mx-auto mb-4">
                <Icon name="Store" size={30} className="text-primary" />
              </div>
              <h3 className="font-display font-bold text-2xl text-brand-navy mb-2">Вы поставщик из Китая?</h3>
              <p className="text-muted-foreground text-sm mb-6">Создайте кабинет, добавьте товары и видео — и получайте заказы напрямую</p>
              <button onClick={() => { setShowAuth(true); setAuthMode("register"); }} className={`${btnCls} w-full`}>
                Стать продавцом
              </button>
              <button onClick={() => { setShowAuth(true); setAuthMode("login"); }} className="mt-3 text-sm text-primary hover:underline">
                Уже есть кабинет? Войти
              </button>
            </div>
          </div>
        )}

        {/* Публичный каталог поставщиков */}
        {!compact && (
        <div className="max-w-6xl mx-auto">
          <h3 className="font-display font-bold text-2xl text-brand-navy mb-6 text-center">Наши поставщики</h3>
          {publicSellers.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-6">Пока нет зарегистрированных поставщиков — станьте первым!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicSellers.map((s) => (
                <div key={s.id} className="bg-white card-soft rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                      {s.avatar_url ? (
                        <img src={s.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display font-bold text-white">{s.company_name?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-brand-navy truncate">{s.company_name}</div>
                      {s.city && <div className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="MapPin" size={12} /> {s.city}</div>}
                    </div>
                  </div>
                  {s.description && <p className="text-sm text-slate-600 mb-4 line-clamp-3">{s.description}</p>}

                  {(s.wechat_id || s.phone) && (
                    <div className="space-y-1 mb-4 text-sm">
                      {s.wechat_id && <div className="flex items-center gap-2 text-brand-navy"><Icon name="MessageSquare" size={14} className="text-primary" /> {s.wechat_id}</div>}
                      {s.phone && <div className="flex items-center gap-2 text-brand-navy"><Icon name="Phone" size={14} className="text-primary" /> {s.phone}</div>}
                    </div>
                  )}

                  {s.products.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                      {s.products.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex-shrink-0 w-16">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.title} className="w-16 h-16 rounded-lg object-cover border border-border" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center"><Icon name="Package" size={18} className="text-muted-foreground" /></div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {s.videos.length > 0 && (
                    <video src={s.videos[0].video_url} controls className="w-full h-32 rounded-lg object-cover bg-black" />
                  )}

                  <div className="flex gap-4 mt-3 mb-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="Package" size={12} /> {s.products.length} товаров</span>
                    <span className="flex items-center gap-1"><Icon name="Video" size={12} /> {s.videos.length} видео</span>
                  </div>

                  <button
                    onClick={() => setChatWith({ id: s.id, name: s.company_name })}
                    className="w-full btn-modern px-4 py-2.5 text-white font-body font-bold text-sm rounded-xl flex items-center justify-center gap-2"
                  >
                    <Icon name="MessageSquare" size={16} /> Написать поставщику
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>

      {/* Чат с поставщиком */}
      {chatWith && (
        <BuyerChat sellerId={chatWith.id} sellerName={chatWith.name} onClose={() => setChatWith(null)} />
      )}

      {/* Модалка авторизации */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAuth(false)} />
          <div className="relative bg-white border border-border rounded-2xl p-8 w-full max-w-md shadow-xl shadow-blue-500/15">
            <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-xl transition-all">
              <Icon name="X" size={18} />
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Icon name="Store" size={24} className="text-white" />
              </div>
              <h3 className="font-display font-bold text-2xl text-brand-navy">
                {authMode === "register" ? "РЕГИСТРАЦИЯ ПРОДАВЦА" : "ВХОД ДЛЯ ПРОДАВЦА"}
              </h3>
            </div>
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "register" && (
                <input className={inputCls} placeholder="Название компании" value={authForm.company_name} onChange={(e) => setAuthForm({ ...authForm, company_name: e.target.value })} required />
              )}
              <input type="email" className={inputCls} placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} required />
              <input type="password" className={inputCls} placeholder="Пароль" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} required />
              {authError && <p className="text-sm text-primary font-medium">{authError}</p>}
              <button type="submit" className={`${btnCls} w-full`} disabled={loading}>
                {loading ? "..." : authMode === "register" ? "Создать кабинет" : "Войти"}
              </button>
              <p className="text-center text-sm text-muted-foreground">
                {authMode === "register" ? "Уже есть кабинет? " : "Нет кабинета? "}
                <button type="button" className="text-primary hover:underline font-medium" onClick={() => { setAuthMode(authMode === "register" ? "login" : "register"); setAuthError(""); }}>
                  {authMode === "register" ? "Войти" : "Зарегистрироваться"}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </Wrapper>
  );
}
import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import SellerChats from "@/components/SellerChats";
import BuyerChat from "@/components/BuyerChat";

const SELLERS_URL = "https://functions.poehali.dev/d6dd7774-7d1c-436f-a1ac-d5342ecb46b4";
const CONTENT_URL = "https://functions.poehali.dev/497830cf-ab2d-4e0b-b5a1-497fa90b8d0d";

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

  const [profile, setProfile] = useState({ company_name: "", wechat_id: "", phone: "", description: "", city: "", avatar_url: "" });
  const [savedMsg, setSavedMsg] = useState("");

  const [productForm, setProductForm] = useState({ title: "", price: "", description: "", image_url: "" });
  const [uploadingImg, setUploadingImg] = useState(false);
  const [videoForm, setVideoForm] = useState({ title: "", video_url: "" });
  const [uploadingVideo, setUploadingVideo] = useState(false);

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
    if (token) loadMe(token);
  }, [token, loadMe]);

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

  const onVideoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    setUploadingVideo(true);
    const url = await uploadFile(file);
    setVideoForm((f) => ({ ...f, video_url: url }));
    setUploadingVideo(false);
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
    loadMe(token);
    loadPublic();
  };

  const inputCls = "w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm";
  const btnCls = "px-6 py-3 bg-primary text-white font-display font-bold rounded-xl border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)] hover:scale-[1.02] transition-all disabled:opacity-60";

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper {...(embedded ? {} : { id: "sellers" })} className={embedded ? "" : "py-24 px-4 bg-cream"}>
      <div className={embedded ? "" : "container mx-auto"}>
        {!embedded && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-accent rounded-full text-primary text-sm font-bold mb-4">
              <Icon name="MessageSquare" size={16} /> WeChat
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-brand-navy">
              ПРОДАВЦЫ <span className="marker-red">WECHAT</span>
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
                <div className="w-14 h-14 rounded-2xl bg-primary border-2 border-brand-navy flex items-center justify-center overflow-hidden">
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
              <button onClick={logout} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                <Icon name="LogOut" size={16} /> Выйти
              </button>
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
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border-2 ${
                    tab === t.id
                      ? "bg-primary text-white border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)]"
                      : "bg-white text-brand-navy border-border hover:border-brand-navy"
                  }`}
                >
                  <Icon name={t.icon} size={16} /> {t.label}
                </button>
              ))}
            </div>

            {/* Профиль */}
            {tab === "profile" && (
              <form onSubmit={saveProfile} className="bg-white card-soft rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-secondary border-2 border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon name="Building2" size={28} className="text-muted-foreground" />
                    )}
                  </div>
                  <label className="cursor-pointer text-sm font-medium text-primary">
                    <span className="px-4 py-2 bg-accent rounded-lg inline-block hover:bg-accent/70 transition-all">
                      {uploadingImg ? "Загрузка..." : "Загрузить лого"}
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
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-accent text-primary rounded-lg inline-block text-sm font-medium hover:bg-accent/70 transition-all">
                        {uploadingVideo ? "Загрузка..." : "Выбрать видео"}
                      </span>
                      <input type="file" accept="video/*" className="hidden" onChange={onVideoPick} />
                    </label>
                    {videoForm.video_url && <span className="text-sm text-brand-teal flex items-center gap-1"><Icon name="Check" size={16} /> Готово</span>}
                  </div>
                  <button type="submit" className={btnCls} disabled={loading || uploadingVideo || !videoForm.video_url}>Добавить видео</button>
                </form>

                {me.videos.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {me.videos.map((v) => (
                      <div key={v.id} className="bg-white card-soft rounded-2xl overflow-hidden">
                        <video src={v.video_url} controls className="w-full h-48 object-cover bg-black" />
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
            {tab === "chats" && token && <SellerChats token={token} />}
          </div>
        ) : (
          <div className="max-w-md mx-auto mb-16 text-center">
            <div className="bg-white card-soft rounded-2xl p-8">
              <div className="w-16 h-16 rounded-2xl bg-accent border-2 border-brand-navy flex items-center justify-center mx-auto mb-4">
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
                    <div className="w-12 h-12 rounded-xl bg-primary border-2 border-brand-navy flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    className="w-full px-4 py-2.5 bg-primary text-white font-display font-bold text-sm rounded-xl border-2 border-brand-navy shadow-[3px_3px_0_hsl(220,45%,14%)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
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
          <div className="relative bg-white border-2 border-brand-navy rounded-2xl p-8 w-full max-w-md shadow-[8px_8px_0_hsl(220,45%,14%)]">
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
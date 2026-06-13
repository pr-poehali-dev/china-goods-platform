import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import BuyerChat from "@/components/BuyerChat";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const SELLERS_URL = "https://functions.poehali.dev/d6dd7774-7d1c-436f-a1ac-d5342ecb46b4";
const DRAGON_IMAGE = "https://cdn.poehali.dev/projects/edb6cf3c-b4b5-4994-bb1e-ca5122151314/files/34d465ef-9cc6-42bc-bc73-7069c0d29790.jpg";

interface Product {
  id: number;
  title: string;
  price: string;
  description: string;
  image_url: string;
}

interface VideoItem {
  id: number;
  title: string;
  video_url: string;
}

interface Supplier {
  id: number;
  company_name: string;
  city: string;
  avatar_url: string;
  description: string;
  wechat_id: string;
  phone: string;
  products: Product[];
  videos: VideoItem[];
}

export default function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [fsVideo, setFsVideo] = useState<VideoItem | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${SELLERS_URL}?action=list`)
      .then(r => r.json())
      .then(data => {
        const found = (data.sellers || []).find(
          (s: Supplier) => String(s.id) === String(id)
        );
        setSupplier(found || null);
      })
      .catch(() => setSupplier(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!fsVideo) { document.body.style.overflow = ""; return; }
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFsVideo(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [fsVideo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:"hsl(200,60%,97%)"}}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-float">🐉</div>
          <p className="text-slate-500 font-display">Загружаем профиль...</p>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{background:"hsl(200,60%,97%)"}}>
        <div className="text-center">
          <div className="text-6xl mb-4">🐉</div>
          <h2 className="font-display font-bold text-2xl text-brand-navy mb-2">Поставщик не найден</h2>
          <Link to="/" className="text-primary underline">На главную</Link>
        </div>
      </div>
    );
  }

  const videos = supplier.videos || [];
  const products = supplier.products || [];

  return (
    <div className="min-h-screen font-body" style={{background: "hsl(200,60%,97%)"}}>

      <SiteHeader />

      {/* HERO */}
      <section className="pt-24 pb-0 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-6 left-[10%] w-64 h-32 rounded-full bg-white/70 blur-3xl" />
          <div className="absolute top-8 right-[8%] w-80 h-36 rounded-full bg-white/60 blur-3xl" />
        </div>

        {/* Баннер */}
        <div className="relative h-52 md:h-64 overflow-hidden" style={{background:"linear-gradient(135deg, hsl(200,75%,82%) 0%, hsl(200,65%,88%) 100%)"}}>
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <span className="text-[200px] select-none">🐉</span>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-6">
            {/* Аватар */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden flex-shrink-0 border-4 border-white shadow-xl shadow-sky-300/25">
              {supplier.avatar_url ? (
                <img src={supplier.avatar_url} alt={supplier.company_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl font-display font-bold text-primary" style={{background:"linear-gradient(135deg,hsl(200,70%,88%),hsl(200,60%,94%))"}}>
                  {supplier.company_name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="font-display font-bold text-3xl text-brand-navy">{supplier.company_name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold text-primary" style={{background:"hsl(200,80%,90%)"}}>
                  ✓ Проверен
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                {supplier.city && <span className="flex items-center gap-1"><Icon name="MapPin" size={14} />{supplier.city}, Китай</span>}
                {videos.length > 0 && <span className="flex items-center gap-1"><Icon name="Video" size={14} />{videos.length} видео</span>}
                {products.length > 0 && <span className="flex items-center gap-1"><Icon name="Package" size={14} />{products.length} товаров</span>}
              </div>
            </div>

            <div className="flex gap-3 pb-2">
              <button
                onClick={() => setChatOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
                style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))"}}
              >
                <Icon name="MessageCircle" size={16} />
                Написать поставщику
              </button>
            </div>
          </div>

          <div className="flex gap-6 pb-6 border-b border-white/60">
            {[
              { value: `${videos.length}`, label: "видео" },
              { value: `${products.length}`, label: "товаров" },
              { value: supplier.city || "Китай", label: "город" },
            ].map((s, i) => (
              <div key={i}>
                <div className="font-display font-bold text-xl text-brand-navy">{s.value}</div>
                <div className="text-xs text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КОНТЕНТ */}
      <section className="py-10 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Левая колонка */}
            <div className="lg:col-span-2 space-y-8">

              {/* О поставщике */}
              {supplier.description && (
                <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
                  <h2 className="font-display font-bold text-xl text-brand-navy mb-4 flex items-center gap-2">
                    <span>📋</span> О поставщике
                  </h2>
                  <p className="text-slate-600 leading-relaxed">{supplier.description}</p>
                </div>
              )}

              {/* Каталог товаров */}
              {products.length > 0 && (
                <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
                  <h2 className="font-display font-bold text-xl text-brand-navy mb-6 flex items-center gap-2">
                    <span>🛒</span> Каталог товаров
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {products.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:-translate-y-0.5" style={{background:"linear-gradient(135deg, hsl(200,70%,95%), hsl(200,60%,97%))", border:"1px solid rgba(255,255,255,0.9)"}}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{background:"rgba(255,255,255,0.8)"}}>📦</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-brand-navy text-sm">{item.title}</div>
                          {item.price && <div className="text-primary font-bold text-sm mt-0.5">{item.price}</div>}
                          {item.description && <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Видео */}
              <div className="rounded-3xl p-8" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.25)"}}>
                <h2 className="font-display font-bold text-xl text-brand-navy mb-6 flex items-center gap-2">
                  <span>🎬</span> Видео с производства
                </h2>

                {videos.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {videos.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setFsVideo(v)}
                        className="group relative rounded-2xl overflow-hidden aspect-[3/4] bg-secondary"
                        style={{boxShadow:"0 4px 16px rgba(176,220,240,0.3)"}}
                      >
                        <video
                          src={v.video_url}
                          muted
                          loop
                          playsInline
                          preload="metadata"
                          onMouseEnter={e => { e.currentTarget.currentTime = 0; e.currentTarget.play().catch(()=>{}); }}
                          onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <Icon name="Play" size={22} className="text-primary ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Icon name="Maximize2" size={14} className="text-primary" />
                        </div>
                        {v.title && (
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white text-xs font-medium line-clamp-2">{v.title}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden aspect-video flex items-center justify-center" style={{background:"linear-gradient(135deg, hsl(200,70%,88%), hsl(200,60%,93%))"}}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Icon name="Play" size={28} className="text-primary ml-1" />
                      </div>
                      <p className="text-slate-500 text-sm">Поставщик скоро добавит видео</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Правая колонка — контакты */}
            <div className="space-y-6">
              <div className="rounded-3xl p-6 sticky top-24" style={{background:"rgba(255,255,255,0.85)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.3)"}}>
                <h2 className="font-display font-bold text-lg text-brand-navy mb-5 flex items-center gap-2">
                  <span>📞</span> Контакты
                </h2>

                <div className="space-y-3 mb-6">
                  {supplier.phone && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"hsl(200,65%,95%)"}}>
                      <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center text-lg">💬</div>
                      <div>
                        <div className="text-xs text-slate-400">Телефон / Telegram</div>
                        <div className="font-semibold text-brand-navy text-sm">{supplier.phone}</div>
                      </div>
                    </div>
                  )}
                  {supplier.wechat_id && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"hsl(200,65%,95%)"}}>
                      <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg">🟢</div>
                      <div>
                        <div className="text-xs text-slate-400">WeChat</div>
                        <div className="font-semibold text-brand-navy text-sm">{supplier.wechat_id}</div>
                      </div>
                    </div>
                  )}
                  {supplier.city && (
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{background:"hsl(200,65%,95%)"}}>
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg">📍</div>
                      <div>
                        <div className="text-xs text-slate-400">Город</div>
                        <div className="font-semibold text-brand-navy text-sm">{supplier.city}, Китай</div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setChatOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm shadow-lg transition-all hover:-translate-y-0.5"
                  style={{background:"linear-gradient(135deg, hsl(354,78%,52%), hsl(25,85%,55%))"}}
                >
                  <Icon name="MessageCircle" size={16} />
                  Написать поставщику
                </button>

                <p className="text-xs text-slate-400 text-center mt-3">
                  Перевод и помощь в переговорах — бесплатно
                </p>
              </div>

              <div className="rounded-3xl p-6" style={{background:"rgba(255,255,255,0.8)", backdropFilter:"blur(16px)", border:"1.5px solid rgba(255,255,255,0.9)", boxShadow:"0 8px 32px rgba(176,220,240,0.2)"}}>
                <h3 className="font-display font-bold text-sm text-brand-navy mb-4">Условия работы</h3>
                <div className="space-y-2.5">
                  {["Фотоотчёт перед отправкой", "Работа через TaoSeller", "Помощь с переводом", "Гарантия качества товара"].map((text, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span>✅</span><span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Фуллскрин видео */}
      {fsVideo && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setFsVideo(null)}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if ((e.changedTouches[0].clientX - (touchStartX.current ?? 0)) < -50) setFsVideo(null); }}
        >
          <button onClick={() => setFsVideo(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center z-20">
            <Icon name="X" size={22} className="text-white" />
          </button>
          <video
            src={fsVideo.video_url}
            autoPlay
            loop
            controls
            playsInline
            className="max-w-full max-h-full rounded-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Чат с поставщиком */}
      {chatOpen && supplier && (
        <BuyerChat
          sellerId={supplier.id}
          sellerName={supplier.company_name}
          onClose={() => setChatOpen(false)}
        />
      )}

      <SiteFooter />
    </div>
  );
}